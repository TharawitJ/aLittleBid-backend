import express from "express";
import { getUserController } from "../controllers/user.controller.js";

const userRoutes = express.Router();

// TO DO validate data, check auth
userRoutes.get('/:id', getUserController);
userRoutes.patch('/:id', (re, res) => {})
userRoutes.delete('/:id', (re, res) => {})

export default userRoutes;