// server/utils/extractTextFromPDF.js
// import pdf from "pdf-parse";

// import pkg from "pdf-parse";
// const pdf = pkg;

// import pdf from 'pdfjs-dist/legacy/build/pdf.js';
// const { getDocument } = pdf ;

// export const extractTextFromPDF = async (buffer) => {
//   try {
//     const data = await pdf(buffer);
//     return data.text;
//   } catch (error) {
//     console.error("PDF extraction error:", error);
//     return "";
//   }
// };


// server/utils/extractTextFromPDF.js
import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

export const extractTextFromPDF = async (buffer) => {
  try {
    // Loading the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdfDocument = await loadingTask.promise;
    
    let textContent = '';
    // Loop through each page of the document to extract text
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      textContent += pageText + '\n'; // Append text from each page
    }
    
    return textContent;
  } catch (error) {
    console.error("PDF extraction error:", error);
    return ""; // Return empty string if there's an error
  }
};

