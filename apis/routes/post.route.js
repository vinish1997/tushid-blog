import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("", verifyToken, createPost);

postRoute.get("",getPosts);

postRoute.delete("/:postId/:userId", verifyToken, deletePost);

postRoute.put("/:postId/:userId", verifyToken, updatePost);

export default postRoute;