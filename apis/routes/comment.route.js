import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  deleteComment,
  getPostComments,
  likeComment,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRoute = express.Router();

commentRoute.post("", verifyToken, createComment);

commentRoute.get("/post/:postId", getPostComments);

commentRoute.put("/like/:commentId", verifyToken, likeComment);

commentRoute.put("/:commentId", verifyToken, updateComment);

commentRoute.delete("/:commentId", verifyToken, deleteComment);

export default commentRoute;
