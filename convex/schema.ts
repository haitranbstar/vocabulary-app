import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  topics: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  vocabulary: defineTable({
    topicId: v.id("topics"),
    englishWord: v.string(),
    vietnameseMeaning: v.string(),
    ipa: v.string(),
    example: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_topic", ["topicId"]),

  ai_cache: defineTable({
    type: v.string(), // "conversation" | "grammar_quiz" | "mixed_quiz"
    key: v.string(), // tenseName hoặc "mixed"
    data: v.any(), // JSON data từ AI
    createdAt: v.number(),
  }).index("by_type_key", ["type", "key"]),
});
