import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post("", verifyToken, createComment);

commentRoute.get("/post/:postId", getPostComments);

export default commentRoute;
