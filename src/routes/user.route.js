import express from "express";
import { createAddressController, deleteUserController, getAllUsersController, getUserController, updateAddressController, updateUserController } from "../controllers/user.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addressParamsSchema, idSchema, updateAddressSchema, updateUserSchema, } from "../validations/index.js";


const userRoutes = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
userRoutes.get('', authCheck, getAllUsersController);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
userRoutes.get('/:id', authCheck, validate(idSchema, "params"), getUserController);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update a user data
 *     tags: [Users]
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
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
userRoutes.patch('/:id', authCheck, validate(idSchema, "params"), validate(updateUserSchema, "body"), updateUserController)

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
userRoutes.delete('/:id', authCheck, validate(idSchema, "params"), deleteUserController);


/**
 * @openapi
 * /users/{id}/addresses:
 *   post:
 *     summary: Create an address for specific user Id
 *     tags: [Addresses]
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
 *              $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address added successfully
 */
userRoutes.post('/:id/addresses/', authCheck, validate(idSchema, "params"), validate(updateAddressSchema, "body"), createAddressController);

/**
 * @openapi
 * /users/{id}/addresses/{addressId}:
 *   patch:
 *     summary: Update a specific address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
userRoutes.patch('/:id/addresses/:addressId', authCheck, validate(addressParamsSchema, "params"), validate(updateAddressSchema, "body"), updateAddressController);

export default userRoutes;