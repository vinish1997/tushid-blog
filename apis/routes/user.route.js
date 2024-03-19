import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  signOut,
  update,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoutes = express.Router();

userRoutes.put("/:userId", verifyToken, update);
userRoutes.delete("/:userId", verifyToken, deleteUser);
userRoutes.post("/signout", signOut);
userRoutes.get("", verifyToken, getUsers);
userRoutes.get("/:userId", getUser);
export default userRoutes;
