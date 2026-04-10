import express from "express";
import { createAddressController, deleteUserController, getAllUsersController, getUserController, updateAddressController } from "../controllers/user.controller.js";

const userRoutes = express.Router();

// TO DO validate data, check auth
userRoutes.get('', getAllUsersController);
userRoutes.get('/:id', getUserController);
userRoutes.delete('/:id', deleteUserController);

userRoutes.patch('/:id/addresses/:addressId', updateAddressController)
userRoutes.post('/:id/addresses/', createAddressController)

export default userRoutes;