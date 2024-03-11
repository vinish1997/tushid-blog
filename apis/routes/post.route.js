import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createPost, deletePost, getPosts } from "../controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("", verifyToken, createPost);

postRoute.get("",getPosts);

postRoute.delete("/:postId/:userId", verifyToken, deletePost);

export default postRoute;