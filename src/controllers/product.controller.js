import { getAllProducts } from "../services/product.service";


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

// export async function getUserController(req, res, next) {
//     const id = Number(req.params.id);
//   try {
//     const responses = await getUserById(id);
//     res.status(201).json({
//       message: "User retrieved successfully",
//       responses,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
