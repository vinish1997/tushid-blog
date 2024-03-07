import express from "express";
import { update } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const userRoutes = express.Router();

userRoutes.put("/:userId", verifyToken, update);

export default userRoutes;
