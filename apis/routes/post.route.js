import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { createPost } from "../controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("", verifyToken, createPost);

export default postRoute;