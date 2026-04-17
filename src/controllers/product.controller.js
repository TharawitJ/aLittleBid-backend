import { deleteProductById, getAllCategories, getAllProducts, getProductById, updateProduct } from "../services/product.service.js";


export async function getAllProductsController(req, res, next) {

  try {
    const responses = await getAllProducts();
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
  try {
    const responses = await deleteProductById(id);
    res.status(201).json({
      message: "Deleted product successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  // const { id } = req.user;
  
  try {
    const responses = await createProduct(id, req.body);
    res.status(201).json({
      message: "Product created successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductController(req, res, next) {
  // const { id } = req.user;
  
  try {
    const responses = await updateProduct(id, req.body);
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
