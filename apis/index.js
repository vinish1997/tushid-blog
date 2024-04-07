import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import path from "path";

dotenv.config();
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(() => {
  console.log("mongo connected");
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("welcome to first express server!!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);
app.use(express.static(path.join(__dirname,"/client/dist")));
app.get("*",(req,res) =>{
  res.sendFile(path.join(__dirname,"client","dist","index.html"));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
