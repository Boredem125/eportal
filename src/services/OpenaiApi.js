// src/services/openaiApi.js
import axios from 'axios';
import OpenAI from "openai";

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
  
});
export const generateQuiz = async (topic, difficulty = 'medium', count = 5) => {
  try {
    const prompt = `Create a ${difficulty} difficulty quiz about ${topic} with ${count} multiple-choice questions. Each question should have 4 options (A, B, C, D) with one correct answer. Format the response as a JSON array with the following structure for each question:
    {
      "question": "Question text here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": "The correct option text here"
    }`;

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
    messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    })

   
    console.log(response);
    

    // Extract and parse the response
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[\s*\{.*\}\s*\]/s);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse quiz data from response');
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
