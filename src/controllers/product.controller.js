import { createImage, createSellerProduct, deleteImageById, deleteUserProduct, getAllCategories, getAllImages, getAllProducts, getImageById, getProductById, updateProduct, updateUserProduct } from "../services/product.service.js";


export async function getAllProductsController(req, res, next) {
  // console.log('req.query', req.query);

  try {
    const responses = await getAllProducts(req.query);
    res.status(201).json({
      message: "All products retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductController(req, res, next) {
    const id = Number(req.params.id);
  try {
    const responses = await getProductById(id);
    res.status(201).json({
      message: "Product retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductController(req, res, next) {
    const id = Number(req.params.id);
    const userId = req.user.id;

  try {
    const responses = await deleteUserProduct(id, userId);
    res.status(201).json({
      message: "Deleted product successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  const id = req.user.id;

  try {
    const responses = await createSellerProduct(id, req.body);
    res.status(201).json({
      message: "Product created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductController(req, res, next) {
  const id = Number(req.params.id);
  const userId = req.user.id;

  try {
    const responses = await updateUserProduct(id, userId, req.body);
    res.status(201).json({
      message: "Product updated successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllCategoriesController(req, res, next) {

  try {
    const responses = await getAllCategories();
    res.status(201).json({
      message: "All categories retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createImageController(req, res, next) {

  try {
    const responses = await createImage(req.body);
    res.status(201).json({
      message: "Image created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getImageByIdController(req, res, next) {
  const id = req.params.id;

  try {
    const responses = await getImageById(id);
    res.status(201).json({
      message: "Image created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllImagesController(req, res, next) {

  try {
    const responses = await getAllImages();
    res.status(201).json({
      message: "Image retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteImageByIdController(req, res, next) {
  const id = req.params.id;

  try {
    const responses = await deleteImageById(id);
    res.status(201).json({
      message: "Image deleted successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}


