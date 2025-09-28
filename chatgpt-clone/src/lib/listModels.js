import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);

export async function ListModels() {
  const models = await genAI.listModels();
  console.log("Available Gemini models:", models);
  return models.models;
}