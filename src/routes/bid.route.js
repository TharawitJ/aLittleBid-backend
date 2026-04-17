import express from "express";
import {
  createBidController,
  deleteBidController,
  getAllBidsController,
  getBidController,
  updateBidController,
} from "../controllers/bid.controller.js";

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
bidRoutes.post("", createBidController);

/**
 * @openapi
 * /bids/{id}:
 *   patch:
 *     summary: Update bid by id
 *     tags: [Bids]
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
 *          schema:
 *             type: object
 *             required:
 *                 - isWinning
 *             properties:
 *                isWinning:
 *                  type: boolean
 *     responses:
 *       200:
 *         description: Bid updated successfully
 *       400:
 *         description: Fail to update Bid
 */
bidRoutes.patch("/:id", updateBidController);

/**
 * @openapi
 * /bids:
 *   get:
 *     summary: Get all bids
 *     tags: [Bids]
 *     responses:
 *       200:
 *         description: Bids retrieved successfully
 *       404:
 *         description: Fail to retrieve Bids
 */
bidRoutes.get("", getAllBidsController);

/**
 * @openapi
 * /bids/{id}:
 *   get:
 *     summary: Get bid by id
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid retrieved successfully
 *       404:
 *         description: Fail to retrieve Bid
 */
bidRoutes.get("/:id", getBidController);

/**
 * @openapi
 * /bids/{id}:
 *   delete:
 *     summary: Delete bid by id
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid deleted successfully
 *       404:
 *         description: Fail to delete Bid
 */
bidRoutes.delete("/:id", deleteBidController);

export default bidRoutes;
