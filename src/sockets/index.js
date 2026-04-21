import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middlewares/auth.js";
import handleAuctionEvents from "./events/auctionHandler.js";

export default function initSocket(server, CLIENT_URL) {
    const io = new Server(server, {
        cors: { origin: CLIENT_URL},
        methods: ['GET', 'POST']
    });

    // CHECK SOCKET AUTH
    io.use(socketAuthMiddleware);

    // Connect incoming socket to handshake globally
    io.on("connection", (socket) => {

        handleAuctionEvents(io, socket);

        socket.on("disconnect", () => {
            console.log("Disconnected", socket.id)
        });
    });

    // IF AUCTION WORK WE CAN UPDATE TO NAMESPACE
    const auctionNamespace = io.of("/auctions");
    // const chatNamespace = io.of('/chat').on('connection', chatHandler);
    // const notiNamespace = io.of('/notification').on('connection', notificationHandler);

    // auctionNamespace.on('connection', (socket) => {
    //     console.log(`User connected to AUCTION namespace: ${socket.id}`);
    //     handleAuctionEvents(auctionNamespace, socket);
    // });
}

