import { v } from "convex/values";
import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateExamples = action({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate exactly 5 natural, common daily conversation sentences in English using the word "${args.word}". 
    Ensure the sentences reflect how native speakers actually talk in everyday situations.
    Format the output as a strictly valid JSON array of strings. 
    Return ONLY the JSON array, no introductory text, no explanations, and no markdown code blocks. 
    Example: ["That's a great ${args.word}!", "I'll give you my ${args.word} later."]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response text (handling potential markdown formatting)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as string[];
      }
      
      throw new Error("Failed to parse AI response as JSON");
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback in case of error
      return [
        `I use "${args.word}" in my daily work.`,
        `Can you explain what "${args.word}" means?`,
        `This is a great example of "${args.word}".`,
        `We discussed "${args.word}" in the meeting.`,
        `The concept of "${args.word}" is important.`,
      ];
    }
  },
});
