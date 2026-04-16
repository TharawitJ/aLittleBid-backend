import express from "express";
import { createProductController, deleteProductController, getAllProductsController, getProductController } from "../controllers/product.controller.js";

const productRoutes = express.Router();

// TO DO validate data, check auth

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
productRoutes.get('', getAllProductsController);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
productRoutes.get('/:id', getProductController);
// productRoutes.post('/:userId', createProductController);
// productRoutes.patch('/:id/addresses/:addressId', updateAddressController);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not deleted
 */
productRoutes.delete('/:id', deleteProductController);

export default productRoutes;