import express from "express";
import { createImageController, createProductController, deleteImageByIdController, deleteProductController, getAllCategoriesController, getAllImagesController, getAllProductsController, getImageByIdController, getProductController, updateProductController } from "../controllers/product.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idSchema, createProductSchema, updateProductSchema, createImageSchema } from "../validations/index.js";
import { getAllImages } from "../services/product.service.js";


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
 * /products/images:
 *   post:
 *     summary: Create new product image
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Image'
 *     responses:
 *       200:
 *         description: Product image added successfully
 *       404:
 *         description: Fail to add product image
 */
productRoutes.post('/images', authCheck, validate(createImageSchema, "body"), createImageController);

/**
 * @openapi
 * /products/images:
 *   get:
 *     summary: Get all images
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all images
 */
productRoutes.get('/images', authCheck, getAllImagesController);

/**
 * @openapi
 * /products/images/:id:
 *   get:
 *     summary: Get image by id
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Image by id
 */
productRoutes.get('/images/:id', authCheck, validate(idSchema, "params"), getImageByIdController);

/**
 * @openapi
 * /products/images/:id:
 *   delete:
 *     summary: Delete image by id
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: delete Image by id
 */
productRoutes.delete('/images/:id', authCheck, validate(idSchema, "params"), deleteImageByIdController);

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