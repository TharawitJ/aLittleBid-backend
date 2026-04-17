import express from "express";
import { createAuctionController } from "../controllers/auction.controller.js";

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
 *              $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Auction added successfully
 *       404:
 *         description: Fail to add auction
 */
auctionRoutes.post('', createAuctionController);

export default auctionRoutes;