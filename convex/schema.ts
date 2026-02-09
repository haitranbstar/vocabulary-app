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
});
