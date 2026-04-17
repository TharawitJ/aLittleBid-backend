import { createUserAuction, deleteAuctionById, getAllAuctions, getAuctionById, updateUserAuction } from "../services/auction.service.js";

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

export async function deleteAuctionController(req, res, next) {
    const id = Number(req.params.id);
  try {
    const responses = await deleteAuctionById(id);
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
    // const { id } = req.user;
    // CHANGE HERE AFTER AUTH
  const userId = 21;

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
    // const { id } = req.user;
    // CHANGE HERE AFTER AUTH
  const userId = 21;

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