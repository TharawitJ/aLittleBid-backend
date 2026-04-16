import express from "express";
import { getAllProductsController } from "../controllers/product.controller";

const productRoutes = express.Router();

// TO DO validate data, check auth
productRoutes.get('', getAllProductsController);

// productRoutes.get('/:id', getUserController);
// productRoutes.delete('/:id', deleteUserController);

// productRoutes.patch('/:id/addresses/:addressId', updateAddressController)
// productRoutes.post('/:id/addresses/', createAddressController)

export default productRoutes;