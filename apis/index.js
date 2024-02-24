import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(() => {
    console.log("mongo connected");
})

const app = express();

app.listen(3000, () => {
    console.log("welcome to first express server!!");
});