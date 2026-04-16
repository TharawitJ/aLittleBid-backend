import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
// import errorHandler from "./middlewares/errorHandler.middleware.js";
// import notFound from "./middlewares/notFound.middleware.js";



const app = express(); 
const PORT = 3500;

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

