// // server/controllers/resumeController.js
// import fs from 'fs';
// // import pdfParse from 'pdf-parse';
// import mammoth from 'mammoth';
// import { analyzeResume } from '../openai.js';

// export const uploadResumeAndAnalyze = async (req, res) => {

//     const pdfParse = (await import('pdf-parse')).default;       // Fixed
//   try {
//     const file = req.file;

//     if (!file) return res.status(400).json({ message: 'No file uploaded' });

//     let extractedText = '';

//     if (file.mimetype === 'application/pdf') {
//       const dataBuffer = fs.readFileSync(file.path);
//       const pdfData = await pdfParse(dataBuffer);
//       extractedText = pdfData.text;
//     } else if (
//       file.mimetype ===
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) {
//       const result = await mammoth.extractRawText({ path: file.path });
//       extractedText = result.value;
//     } else {
//       return res.status(400).json({ message: 'Unsupported file type' });
//     }

//     fs.unlinkSync(file.path); // Cleanup uploaded file

//     const suggestions = await analyzeResume(extractedText);

//     return res.status(200).json({
//       extractedText,
//       suggestions,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error processing resume' });
//   }
// };


// import fs from 'fs';
// import mammoth from 'mammoth';
// import { analyzeResume } from '../openai.js';

// export const uploadResumeAndAnalyze = async (req, res) => {
//   try {
//     const { file } = req;
//     if (!file) return res.status(400).json({ message: 'No file uploaded' });

//     let extractedText = '';

//     if (file.mimetype === 'application/pdf') {
//       const pdfParse = (await import('pdf-parse')).default; // ✅ Fixed import
//       const dataBuffer = fs.readFileSync(file.path);
//       const pdfData = await pdfParse(dataBuffer);
//       extractedText = pdfData.text;
//     } else if (
//       file.mimetype ===
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ) {
//       const result = await mammoth.extractRawText({ path: file.path });
//       extractedText = result.value;
//     } else {
//       return res.status(400).json({ message: 'Unsupported file type' });
//     }

//     // Optionally delete the uploaded file
//     fs.unlinkSync(file.path);

//     const suggestions = await analyzeResume(extractedText);

//     return res.status(200).json({
//       extractedText,
//       suggestions,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error processing resume' });
//   }
// };



import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
// import { getDocument } from 'pdfjs-dist/legacy/build/pdf.js';
// import { getDocument } from 'pdfjs-dist';

import pdfPkg  from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pdfPkg ;

import { analyzeResumeWithGemini } from "../gemini.js";

// import { analyzeResume } from '../openai.js';

// import { DOMMatrix } from 'dommatrix';
// globalThis.DOMMatrix = DOMMatrix; // Polyfill DOMMatrix for Node.js

import pkg from 'dommatrix';
const { DOMMatrix } = pkg;
globalThis.DOMMatrix = DOMMatrix; // Polyfill DOMMatrix for Node.js



export const uploadResumeAndAnalyze = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const pdf = await getDocument({ data: dataBuffer }).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str).join(' ');
        extractedText += strings + '\n';
      }
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value;
    } else {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    fs.unlinkSync(file.path); // delete after parsing

    const suggestions = await analyzeResumeWithGemini(extractedText);

    return res.status(200).json({
      extractedText,
      suggestions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing resume' });
  }
};

