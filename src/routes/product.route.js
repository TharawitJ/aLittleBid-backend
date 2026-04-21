import express from "express";
import { createProductController, deleteProductController, getAllCategoriesController, getAllProductsController, getProductController, updateProductController } from "../controllers/product.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idSchema, createProductSchema, updateProductSchema } from "../validations/index.js";


const productRoutes = express.Router();

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product added successfully
 *       404:
 *         description: Fail to add product
 */
productRoutes.post('', authCheck, validate(createProductSchema, "body"), createProductController);

/**
 * @openapi
 * /products/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all categories
 */
productRoutes.get('/categories', authCheck, getAllCategoriesController);

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
productRoutes.get('', authCheck, getAllProductsController);

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
productRoutes.get('/:id', authCheck, validate(idSchema, "params"), getProductController);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
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
productRoutes.delete('/:id', authCheck, validate(idSchema, "params"), deleteProductController);

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Fail to update product
 */
productRoutes.patch('/:id', authCheck, validate(idSchema, "params"), validate(updateProductSchema, "body"), updateProductController);

export default productRoutes;