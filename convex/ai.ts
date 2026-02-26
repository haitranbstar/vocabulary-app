import { v } from "convex/values";
import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-3-flash-preview";

export const generateExamples = action({
  args: { word: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

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

// Tạo hội thoại AI theo thì ngữ pháp
export const generateConversation = action({
  args: { tenseName: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Create a short daily conversation (6-10 sentences) using ${args.tenseName} tense.
Topic: Daily routine or common situations.
Use natural spoken English that reflects how native speakers actually talk.
Highlight the verbs in ${args.tenseName} by wrapping them in **bold**.

Return the result as a strictly valid JSON object with this format:
{
  "title": "Conversation title",
  "speakers": ["Speaker A name", "Speaker B name"],
  "lines": [
    {"speaker": "Speaker A name", "text": "Sentence with **highlighted** verbs"},
    {"speaker": "Speaker B name", "text": "Response with **highlighted** verbs"}
  ]
}
Return ONLY the JSON object, no introductory text, no explanations, and no markdown code blocks.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Failed to parse AI conversation response");
    } catch (error) {
      console.error("Gemini Conversation Error:", error);
      return {
        title: "Daily Routine",
        speakers: ["Tom", "Anna"],
        lines: [
          { speaker: "Tom", text: `I **use** ${args.tenseName} in my daily conversations.` },
          { speaker: "Anna", text: "That **sounds** great! Can you give me an example?" },
          { speaker: "Tom", text: "Sure! I **go** to work every day at 8 AM." },
          { speaker: "Anna", text: "I **understand**. That **is** a good example." },
        ],
      };
    }
  },
});

// Tạo bài tập trắc nghiệm cho một thì
export const generateGrammarQuiz = action({
  args: {
    tenseName: v.string(),
    questionCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const count = args.questionCount || 20;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Create ${count} multiple choice questions for ${args.tenseName} tense in English grammar.

Requirements:
- 4 options (A, B, C, D)
- Only one correct answer
- Provide the correct answer letter
- Provide a short explanation in Vietnamese
- Level: Beginner to Intermediate
- Questions should test understanding of when and how to use ${args.tenseName}

Return the result as a strictly valid JSON array with this format:
[
  {
    "question": "Choose the correct sentence:",
    "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
    "correctAnswer": 0,
    "explanation": "Giải thích ngắn gọn bằng tiếng Việt"
  }
]
Return ONLY the JSON array, no introductory text, no explanations, and no markdown code blocks.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Failed to parse AI quiz response");
    } catch (error) {
      console.error("Gemini Quiz Error:", error);
      return [];
    }
  },
});

// Tạo bài tập tổng hợp tất cả các thì
export const generateMixedQuiz = action({
  args: {
    questionCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }

    const count = args.questionCount || 20;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Create ${count} mixed multiple choice questions covering these English tenses:
- Present Simple
- Past Simple
- Present Continuous
- Future Simple (will) & Be going to
- Present Perfect

Requirements:
- 4 options (A, B, C, D)
- Only one correct answer
- Provide the correct answer index (0-3)
- Provide a short explanation in Vietnamese including which tense the question tests
- Random order of tenses
- Level: Beginner to Intermediate

Return the result as a strictly valid JSON array with this format:
[
  {
    "question": "Choose the correct sentence:",
    "options": ["A. Option A", "B. Option B", "C. Option C", "D. Option D"],
    "correctAnswer": 0,
    "explanation": "Giải thích ngắn gọn bằng tiếng Việt",
    "tense": "Present Simple"
  }
]
Return ONLY the JSON array, no introductory text, no explanations, and no markdown code blocks.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Failed to parse AI mixed quiz response");
    } catch (error) {
      console.error("Gemini Mixed Quiz Error:", error);
      return [];
    }
  },
});
