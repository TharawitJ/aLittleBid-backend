import express from "express";
import {
  createBidController,
  deleteBidController,
  getAllBidsController,
  getBidController,
  getBidsByUserIdController,
  updateBidController,
} from "../controllers/bid.controller.js";
import authCheck from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { bidIdSchema, createBidSchema, idSchema, updateBidSchema } from "../validations/index.js";

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
bidRoutes.post("", authCheck, validate(createBidSchema, "body"), createBidController);

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
bidRoutes.get("", authCheck, getAllBidsController);

/**
 * @openapi
 * /bids/user/{id}:
 *   get:
 *     summary: Get bids by user id
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User bids retrieved successfully
 *       404:
 *         description: Fail to retrieve Bids
 */
bidRoutes.get("/user/:id", authCheck, validate(idSchema, "params"), getBidsByUserIdController);

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
bidRoutes.get("/:id", authCheck, validate(bidIdSchema, "params"), getBidController);

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
bidRoutes.patch("/:id", authCheck, validate(bidIdSchema, "params"), validate(updateBidSchema, "body"), updateBidController);

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
bidRoutes.delete("/:id", authCheck, validate(bidIdSchema, "params"), deleteBidController);

export default bidRoutes;
