import express from "express";
import { deleteUser, signOut, update } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoutes = express.Router();

userRoutes.put("/:userId", verifyToken, update);
userRoutes.delete("/:userId", verifyToken, deleteUser);
userRoutes.post("/signout", signOut);

export default userRoutes;
