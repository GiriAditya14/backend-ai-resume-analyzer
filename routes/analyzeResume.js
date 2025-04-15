// server/routes/analyzeResume.js
import express from "express";
import multer from "multer";
import { analyzeResumeWithGemini } from "../gemini.js";
import { extractTextFromPDF } from "../utils/extractTextFromPDF.js";

import Resume from '../models/resume.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = "";

    // Case 1: Uploaded PDF file
    if (req.file) {
      resumeText = await extractTextFromPDF(req.file.buffer);
    }

    // Case 2: Raw text input (alternative)
    if (req.body.text) {
      resumeText = req.body.text;
    }

    if (!resumeText) {
      return res.status(400).json({ error: "No resume content found." });
    }

    const suggestions = await analyzeResumeWithGemini(resumeText);
    res.json({ suggestions });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume." });
  }
});

export const analyzeResume = async (req, res) => {
    try {
      const { file } = req.files;
      const resumeText = await extractTextFromPDF(file.data);
  
      // Call Gemini API for analysis
      const analysis = await analyzeResumeWithGemini(resumeText);
  
      // Save to MongoDB
      const newResume = new Resume({
        resumeText,
        analysis,
      });
  
      await newResume.save();
  
      res.status(200).json({ suggestions: analysis });
    } catch (error) {
      console.error("Error in resume analysis:", error);
      res.status(500).json({ error: 'Failed to analyze resume' });
    }
  };

export default router;
