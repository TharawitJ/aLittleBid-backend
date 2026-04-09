import { getUserById } from "../services/user.service.js";

export async function getUserController(req, res, next) {
    const {id} = req.user;
  try {
    const responses = await getUserById(id);
    res.status(201).json({
      message: "User retrieved successfully",
      responses,
    });
  } catch (error) {
    next(error);
  }
}