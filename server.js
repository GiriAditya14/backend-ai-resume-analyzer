
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import resumeRoutes from './routes/resumeRoutes.js';
import analyzeResumeRouter from "./routes/analyzeResume.js";

import connectDB from './db.js';
connectDB();

dotenv.config();
const app = express();

// app.use(cors());
app.use(express.json());


app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
  credentials: true,
}));



app.use('/api/resume', resumeRoutes);
app.use("/api/analyze-resume", analyzeResumeRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
