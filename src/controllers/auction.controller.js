import { createUserAuction, deleteUserAuction, getAllAuctions, getAuctionById, getAuctionByProductId, getPopularAuctions, updateUserAuction } from "../services/auction.service.js";

export async function getAllAuctionsController(req, res, next) {
  try {
    const responses = await getAllAuctions();
    res.status(201).json({
      message: "All Auctions retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPopularAuctionsController(req, res, next) {
  const limit = Number(req.params.limit);
  try {
    const responses = await getPopularAuctions(limit);
    res.status(201).json({
      message: "All Auctions retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuctionController(req, res, next) {
    const id = Number(req.params.id);

  try {
    const responses = await getAuctionById(id);
    res.status(201).json({
      message: "Auction retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuctionByProductIdController(req, res, next) {
    const id = Number(req.params.id);

  try {
    const responses = await getAuctionByProductId(id);
    res.status(201).json({
      message: "Auction retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAuctionController(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;

  try {
    const responses = await deleteUserAuction(id, userId);
    res.status(201).json({
      message: "Deleted Auction successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAuctionController(req, res, next) {
  const productId = req.body.productId;
  const userId = req.user.id;

  try {
    const responses = await createUserAuction(userId, productId, req.body);
    res.status(201).json({
      message: "Auction created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAuctionController(req, res, next) {
   const id = Number(req.params.id);
   const userId = req.user.id;

  try {
    const responses = await updateUserAuction(id, userId, req.body);
    res.status(201).json({
      message: "Auction updated successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}