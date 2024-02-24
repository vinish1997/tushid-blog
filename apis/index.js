import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';

dotenv.config();
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(() => {
    console.log("mongo connected");
})

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("welcome to first express server!!");
});

app.use("/api/v1/auth", authRoutes);

app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});