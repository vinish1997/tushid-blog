import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

const MIN_PASSWORD_LENGTH_ERROR = "Password must be atleast 6 characters";
const USERNAME_LENGTH_ERROR = "Username must be between 7 and 20 characters";
const USERNAME_SPECIAL_CHARACTER_ERROR =
  "Username can only contain letters and numbers";
const USERNAME_SPACE_ERROR = "Username cannot contains spaces";
const USERNAME_UPPERCASE_ERROR = "Username must be only lower case";
const USER_DELETE_MESSAGE = "User has been deleted";

export const update = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Unauthorized"));
  }
  console.log("auth pass");
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, MIN_PASSWORD_LENGTH_ERROR));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    console.log(req.body.username);
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, USERNAME_LENGTH_ERROR));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, USERNAME_SPACE_ERROR));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, USERNAME_UPPERCASE_ERROR));
    }
    if (!req.body.username.match(/^[a-zA-z0-9]+$/)) {
      return next(errorHandler(400, USERNAME_SPECIAL_CHARACTER_ERROR));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Unauthorized"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({message: USER_DELETE_MESSAGE});
  } catch (error) {
    next(error)
  }
};
