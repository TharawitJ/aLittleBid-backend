import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import cors from "cors";
import notFound from "./middlewares/notFound.middleware.js";
import userRoutes from "./routes/user.route.js";

const app = express(); 
const PORT = 3000;

console.log("Hit the route!");

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
})
);

app.use(express.json());

app.use('/api/users', userRoutes);

// app.use(notFound);

// app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

