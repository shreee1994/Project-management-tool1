import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js'; // Adjust the path based on your folder structure

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on PORT= ${PORT}`));
