import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createComment } from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post("", verifyToken, createComment);

export default commentRoute;
