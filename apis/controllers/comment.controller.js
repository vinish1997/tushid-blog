import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { comment, postId, userId } = req.body;

    if (userId !== req.user.id) {
      next(errorHandler(403, "You are not allowed to create a comment"));
    }
    const newComment = new Comment({
      content: comment,
      postId,
      userId,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
