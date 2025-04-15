// // server/gemini.js
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const analyzeResumeWithGemini = async (resumeText) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `You're an AI resume analyzer. Read the following resume text and provide recommendations, skill gaps, and formatting suggestions:\n\n${resumeText}`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return text;
//   } catch (error) {
//     console.error("Gemini API error:", error);
//     throw error;
//   }
// };


// server/gemini.js
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export const analyzeResumeWithGemini = async (resumeText) => {
    const endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent";


  try {
    const res = await fetch(`${endpoint}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI resume analyzer. Read the following resume and provide improvement suggestions, missing skills, and formatting advice:\n\n${resumeText}`
          }]
        }]
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API returned ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};
