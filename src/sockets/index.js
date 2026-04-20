import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middlewares/auth.js";

export default function initSocket(server, CLIENT_URL) {
    const io = new Server(server, {
        cors: { origin: CLIENT_URL},
        methods: ['GET', 'POST']
    });

    // CHECK SOCKET AUTH
    io.use(socketAuthMiddleware);

    // Connect incoming socket to handshake
    io.on("connection", (socket) => {


        socket.on("disconnect", () => {
            console.log("Disconnected", socket.id)
        });
    });
}

