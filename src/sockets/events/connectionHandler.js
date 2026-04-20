import { placeBid } from "../../services/bid.service";

export default function handleConnectionEvents(io, socket) {

    // join auction event
    socket.on("join_auction", (auctionId) => {
        socket.join(auctionId);
        console.log(`User ${socket.data.user.id} joined ${auctionId}`);
    });
    //

    // leave auction event
   socket.on("leave_auction", (auctionId) => {
        socket.leave(auctionId);
        console.log(`User ${socket.data.user.id} joined ${auctionId}`);
    });

    // redis before saving to db and do background job???

    // receive newest bid price, and send price to everyone in auction room
    socket.on("send_bid", async (payload) => {
        const { auctionId, amount } = payload;
        const userId = socket.data.user.id;

        // save to db
        const data = {
            bidderId: userId,
            auctionId,
            amount
        };

        const savedBid = await placeBid(userId, auctionId, data)

        io.to(auctionId).emit("newest_bid", savedBid);
    });

    socket.on("disconnect", () => {
        console.log('User disconnection:', socket.user.firstname);
    });

    // what is this? socket.on("newPath", (data) => {});
}