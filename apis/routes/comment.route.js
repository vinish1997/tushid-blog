import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  createComment,
  deleteComment,
  getComments,
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

commentRoute.get("",verifyToken, getComments); 

export default commentRoute;
