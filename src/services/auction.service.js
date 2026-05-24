import prisma from "../lib/prismaClient.js";
import createError from "http-errors";

import {
  isAuctionableTime,
  sanitizeData,
  validateProductOwnerAndFetch,
  validateSellerRole,
} from "../utils/helpers.js";
import { getUserById } from "./user.service.js";
import { getIo } from "../sockets/index.js";
import { scheduleAuctionEnd, scheduleAuctionStart } from "../schedulers/auctionTimerManager.js";

const AUCTION_FIELDS = [
  "productId",
  "startTime",
  "endTime",
  "startingPrice",
  "reservePrice",
  "minIncrement",
  "status",
];

const UPDATE_AUCTION_FIELDS = [
  "startTime",
  "endTime",
  "startingPrice",
  "reservePrice",
  "minIncrement",
  "status",
];

export async function createAuction(data) {
  const result = await prisma.auction.create({
    data: data,
  });
  return result;
}

export async function getAllAuctions() {
  const result = await prisma.auction.findMany();
  return result;
}

export async function getAuctionsWhere(optionsObject) {
  const result = await prisma.auction.findMany(optionsObject);
  return result;
}

export async function getAuctionById(id, tx) {
  const db = tx || prisma;
  console.log("typeof id", typeof id);
  const result = await db.auction.findUnique({
    where: { id },
    include: {
      bids: {
        orderBy: {
          amount: "desc",
        },
      },
      product: {
        include: {
          images: true,
        },
      },
    },
  });
  if (!result) throw createError(404, "Invalid auction");
  return result;
}

export async function updateAuctionById(id, data) {
  const result = await prisma.auction.update({
    where: { id },
    data: data,
  });
  return result;
}

export async function updateManyAuctions(whereObject, updateData) {
  const result = await prisma.auction.updateMany({
    where: whereObject,
    data: updateData,
  });
  return result;
}

export async function deleteAuctionById(id) {
  const result = await prisma.auction.delete({
    where: { id },
  });
  return result;
}

/// SPECIFIC SERVICE
export async function getAuctionByProductId(id) {
  const result = await prisma.auction.findFirst({
    where: { productId: id },
    include: {
      product: true,
    },
  });
  return result;
}

export async function getAuctionsByProductId(id) {
  const result = await prisma.auction.findMany({
    where: { productId: id },
  });
  if (!result) throw createError(404, "No auction available this product");
  return result;
}

export async function createUserAuction(userId, productId, data) {
  const user = await getUserById(userId);
  validateSellerRole(user);
  await validateProductOwnerAndFetch(productId, userId);

  const auctionExist = await getAuctionByProductId(productId);
  if (auctionExist)
    throw createError(403, "Auction already exist for this product");
  // THIS DOES NOT ALLOW PRODUCT TO HAVE MANY AUCIONS

  // guard against time
  // isAuctionableTime(data.startTime, data.endTime);

  const auctionData = sanitizeData(data, AUCTION_FIELDS);
  const result = await createAuction(auctionData);
  console.log('result', result)

  // scheduleAuctionStart(result);
  scheduleAuctionEnd(result);

  return result;
}

export async function updateUserAuction(auctionId, userId, data) {
  const user = await getUserById(userId);
  validateSellerRole(user);

  const auction = await getAuctionById(auctionId);
  await validateProductOwnerAndFetch(auction.productId, userId);
  if (auction.status !== "WAITING")
    throw createError(403, "Cannot edit when auction status is pass waiting.");

  const auctionData = sanitizeData(data, UPDATE_AUCTION_FIELDS);
  const result = await updateAuctionById(auctionId, auctionData);

  return result;
}

export async function deleteUserAuction(auctionId, userId) {
  const user = await getUserById(userId);
  validateSellerRole(user);

  const auction = await getAuctionById(auctionId);
  await validateProductOwnerAndFetch(auction.productId, userId);

  const result = await deleteAuctionById(auctionId);
  return result;
}

export async function getPopularAuctions(limit) {
  const optionsObject = {
    take: limit || undefined, 
    orderBy: {
      bids: {_count: "desc" }
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
      _count: { select: {
        bids: true
      }},
      bids: {
      orderBy: {
        amount: 'desc'
      },
      take: 1
    }
  }
};
  const result = await getAuctionsWhere(optionsObject);
  return result;
}

// CRON JOBS
export async function startAuctions() {
  const now = new Date();

  const whereObject = {
    status: "WAITING",
    startTime: { lte: now },
  };

  const updateData = { status: "ACTIVE" };

  const result = await updateManyAuctions(whereObject, updateData);
  // console.log(result);

  if (result.count > 0) {
    console.log(`Started ${result.count} auctions.`);
  }
}

export async function endAuctions() {
  const now = new Date();

  const auctionsToProcess = await prisma.auction.findMany({
    where: { status: "ACTIVE", endTime: { lte: now } },
    include: { bids: { orderBy: { amount: "desc" }, take: 1 } },
  });

  if (auctionsToProcess.length === 0) return;

   for (const auction of auctionsToProcess) {
    endAuctionAndPickWinner(auction);
   }
}

export async function endAuctionAndPickWinner(auction) {
    const highestBid = auction.bids ? auction.bids[0] : null;
    const io = getIo();

    // case no one bids
    if (!highestBid) {
        console.log('we are executing no winner block');
        await prisma.auction.update({
          where: { id: auction.id },
          data: { status: "UNSOLD" },
        });

        console.log('[server] emitting no winner:', auction.id);
        io?.to(`${auction.id}`).emit("no_bids", {
          auctionId: auction.id,
          message:
            "Auction closed unsold, no one made a bid.",
        });
        console.log('no bid is sent');
        return;
    }
    
    // case reservice price not met
    if (Number(highestBid.amount) <= Number(auction.reservePrice)) {
      await prisma.auction.update({
        where: { id: auction.id },
        data: { status: "UNSOLD" },
      });

      console.log('[server] emitting reserve not met to room :', auction.id);
      io?.to(`${auction.id}`).emit("reserve_not_met", {
        auctionId: auction.id,
        message:
          "Auction closed unsold. Highest bid does not meet the reserve price.",
      });
      return;
    }

    // when there is winner
    console.log('there is winner')
    const bid = await prisma.bid.update({
      where: { id: highestBid.id },
      data: { isWinning: true },
    });

    await prisma.auction.update({
      where: { id: auction.id },
      data: { status: "CLOSED" },
    });

    // emit winner
    const roomName = `${auction.id}`;
    const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
    console.log(`Emitting to room ${roomName}. Number of clients in room:`, clientsInRoom?.size || 0);

    io?.to(roomName).emit("auction_ended", {
      auctionId: auction.id,
      bidId: bid.id,
      winnerId: highestBid.bidderId,
      amount: highestBid.amount,
    });
}

// SCHEDULE
export async function initializeAuctionStartTimers() {
  console.log("Bootstrapping auction START timers...");

  const now = new Date();

  const auctions = await prisma.auction.findMany({
    where: {
      status: "WAITING",
      startTime: { gt: now }, // only future auctions
    },
  });

  for (const auction of auctions) {
    scheduleAuctionStart(auction);
  }

  console.log(`Scheduled start timers for ${auctions.length} auctions`);
}

export async function initializeAuctionEndTimers() {
  console.log("Bootstrapping auction END timers...");

  const now = new Date();

  const auctions = await prisma.auction.findMany({
    where: {
      status: "ACTIVE",
      endTime: { gt: now }, // only auctions that hasnt end time
    },
  });

  for (const auction of auctions) {
    scheduleAuctionEnd(auction);
  }

  console.log(`Scheduled end timers for ${auctions.length} auctions`);
}

export async function startAuctionById(id) {
  const updateData = { status: "ACTIVE" };
  const result = await updateAuctionById(id, updateData);
  return result;
}
