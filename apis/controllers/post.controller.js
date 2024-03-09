import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

const POST_ALREADY_EXIST_ERROR = "Post is already exist with this title";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    next(errorHandler(400, "Please provide all required fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, POST_ALREADY_EXIST_ERROR));
    } else {
      return next(error);
    }
  }
};
