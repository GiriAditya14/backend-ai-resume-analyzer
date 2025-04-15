// import { Configuration, OpenAIApi } from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export const analyzeResume = async (resumeText) => {
//   const prompt = `
// You are a professional resume reviewer.
// Analyze the following resume and suggest improvements in:
// - Grammar and spelling
// - Clarity and impact of language
// - Formatting issues
// - Missing keywords or skills
// - Tailoring to target roles

// Resume:
// ${resumeText}
// `;

//   const response = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo',
//     messages: [{ role: 'user', content: prompt }],
//     temperature: 0.7,
//     max_tokens: 800,
//   });

//   return response.data.choices[0].message.content;
// };


// server/openai.js
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are a professional resume reviewer.
Analyze the following resume and suggest improvements in:
- Grammar and spelling
- Clarity and impact of language
- Formatting issues
- Missing keywords or skills
- Tailoring to target roles

Resume:
${resumeText}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 800,
  });

  return response.choices[0].message.content;
};
