import { deleteUserBid, getAllBids, getBidById, getBidsByUserId, placeBid, updateBidStatus } from "../services/bid.service.js";

export async function getAllBidsController(req, res, next) {

  try {
    const responses = await getAllBids();
    res.status(201).json({
      message: "All Bids retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBidController(req, res, next) {
    const id = req.params.id;

  try {
    const responses = await getBidById(id);
    res.status(201).json({
      message: "Bid retrieved successfully.",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteBidController(req, res, next) {
    const id = req.params.id;
    const userId = req.user.id;

  try {
    const responses = await deleteUserBid(id, userId);
    res.status(201).json({
      message: "Deleted bid successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBidController(req, res, next) {
  const auctionId = req.body.auctionId;
  const userId = req.user.id;

  try {
    const responses = await placeBid(userId, auctionId, req.body);
    res.status(201).json({
      message: "Bid created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateBidController(req, res, next) {
   const id = req.params.id;

  try {
    const responses = await updateBidStatus(id, req.body);
    res.status(201).json({
      message: "Bid status updated successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBidsByUserIdController(req, res, next) {
   const id = req.params.id;

  try {
    const responses = await getBidsByUserId(id);
    res.status(201).json({
      message: "User bids retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}