import { placeBid } from "../../services/bid.service.js";
import { bidSchema } from "../../validations/shared.schema.js";

export default function handleAuctionEvents(io, socket) {
  // join auction event
  socket.on("join_auction", (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.data.user.id} joined ${auctionId}`);
  });
  //

  // leave auction event
  socket.on("leave_auction", (auctionId) => {
    socket.leave(auctionId);
    console.log(`User ${socket.data.user.id} left ${auctionId}`);
  });

  // redis before saving to db and do background job???

  // receive newest bid price, and send price to everyone in auction room
  socket.on("send_bid", async (payload) => {
    try {
      const { auctionId, amount } = payload;
      const userId = socket.data.user.id;

      // save to db
      const data = {
        bidderId: userId,
        auctionId: Number(auctionId),
        amount: Number(amount),
      };

      const savedBid = await placeBid(
        userId,
        Number(auctionId),
        data,
      );

      savedBid.username = socket.data.user.username;

      io.to(auctionId).emit("newest_bid", savedBid);
    } catch (error) {
      console.log(error);
      console.error(error.message);
      socket.emit("bid_error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnection:", socket.data.user.username);
  });

  // what is this? socket.on("newPath", (data) => {});
}
