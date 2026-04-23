import express from "express";
import { createAuctionController, deleteAuctionController, getAllAuctionsController, getAuctionByProductIdController, getAuctionController, updateAuctionController } from "../controllers/auction.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idSchema, createAuctionSchema, updateAuctionSchema } from "../validations/index.js";

const auctionRoutes = express.Router();

/**
 * @openapi
 * /auctions:
 *   post:
 *     summary: Create new auction
 *     tags: [Auctions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Auction'
 *     responses:
 *       200:
 *         description: Auction added successfully
 *       404:
 *         description: Fail to add auction
 */
auctionRoutes.post('', authCheck, validate(createAuctionSchema, "body"), createAuctionController);

/**
 * @openapi
 * /auctions:
 *   patch:
 *     summary: Update auction on waiting status
 *     tags: [Auctions]
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
 *              $ref: '#/components/schemas/Auction'
 *     responses:
 *       200:
 *         description: Auction updated successfully
 *       404:
 *         description: Fail to update auction
 */
auctionRoutes.patch('/:id', authCheck, validate(idSchema, "params"), validate(updateAuctionSchema, "body"), updateAuctionController);

/**
 * @openapi
 * /auctions:
 *   get:
 *     summary: Get all auctions
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: Auctions retrieved successfully
 *       404:
 *         description: Fail to fetch auctions
 */
auctionRoutes.get('', authCheck, getAllAuctionsController);

/**
 * @openapi
 * /auctions/product/{id}:
 *   get:
 *     summary: Get auction by product id
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction retrieved successfully
 *       404:
 *         description: Fail to fetch auction
 */
auctionRoutes.get('/product/:id', authCheck, validate(idSchema, "params"), getAuctionByProductIdController);

/**
 * @openapi
 * /auctions/{id}:
 *   get:
 *     summary: Get auction by id
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction retrieved successfully
 *       404:
 *         description: Fail to fetch auction
 */
auctionRoutes.get('/:id', authCheck, validate(idSchema, "params"), getAuctionController);

/**
 * @openapi
 * /auctions/{id}:
 *   delete:
 *     summary: Delete auction by id
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction deleted successfully
 *       404:
 *         description: Fail to delete auction
 */
auctionRoutes.delete('/:id', authCheck,  validate(idSchema, "params"), deleteAuctionController);

export default auctionRoutes;