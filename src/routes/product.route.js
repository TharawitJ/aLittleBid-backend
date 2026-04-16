import express from "express";
import { createProductController, deleteProductController, getAllProductsController, getProductController } from "../controllers/product.controller.js";

const productRoutes = express.Router();

// TO DO validate data, check auth
productRoutes.get('', getAllProductsController);
productRoutes.get('/:id', getProductController);
productRoutes.post('/:userId', createProductController);
// productRoutes.patch('/:id/addresses/:addressId', updateAddressController);

productRoutes.delete('/:id', deleteProductController);

export default productRoutes;