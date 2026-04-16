import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import productRoutes from "./routes/product.route.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

const app = express(); 
const PORT = 3000;

console.log("Hit the route!");

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
})
);

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

