import express from "express";
import { signup, signin , googleAuth} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/signin", signin);

authRoutes.post("/google", googleAuth);

export default authRoutes;
