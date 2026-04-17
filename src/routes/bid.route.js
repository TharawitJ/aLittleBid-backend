import express from "express";
import { createBidController, deleteBidController, getAllBidsController, getBidController, updateBidController } from "../controllers/bid.controller.js";

const bidRoutes = express.Router();

/**
 * @openapi
 * /bids:
 *   post:
 *     summary: Create new bid
 *     tags: [Bids]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Bid'
 *     responses:
 *       200:
 *         description: Bid added successfully
 *       404:
 *         description: Fail to add Bid
 */
bidRoutes.post('', createBidController);

bidRoutes.patch('/:id', updateBidController);

bidRoutes.get('', getAllBidsController);

bidRoutes.get('/:id', getBidController);

bidRoutes.delete('/:id', deleteBidController);

export default bidRoutes;