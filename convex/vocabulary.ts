import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Lấy vocabulary theo topic
export const getVocabularyByTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("vocabulary")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();
  },
});

// Query: Lấy chi tiết một từ vựng
export const getVocabulary = query({
  args: { vocabularyId: v.id("vocabulary") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.vocabularyId);
  },
});

// Mutation: Thêm một từ vựng
export const createVocabulary = mutation({
  args: {
    topicId: v.id("topics"),
    englishWord: v.string(),
    vietnameseMeaning: v.string(),
    ipa: v.string(),
    example: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vocabulary", {
      topicId: args.topicId,
      englishWord: args.englishWord,
      vietnameseMeaning: args.vietnameseMeaning,
      ipa: args.ipa,
      example: args.example,
      createdAt: Date.now(),
    });
  },
});

// Mutation: Thêm nhiều từ vựng cùng lúc (từ Excel)
export const bulkCreateVocabulary = mutation({
  args: {
    topicId: v.id("topics"),
    words: v.array(
      v.object({
        englishWord: v.string(),
        vietnameseMeaning: v.string(),
        ipa: v.string(),
        example: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const insertedIds = [];
    for (const word of args.words) {
      const id = await ctx.db.insert("vocabulary", {
        topicId: args.topicId,
        englishWord: word.englishWord,
        vietnameseMeaning: word.vietnameseMeaning,
        ipa: word.ipa,
        example: word.example,
        createdAt: Date.now(),
      });
      insertedIds.push(id);
    }
    return insertedIds;
  },
});

// Mutation: Cập nhật từ vựng
export const updateVocabulary = mutation({
  args: {
    vocabularyId: v.id("vocabulary"),
    englishWord: v.optional(v.string()),
    vietnameseMeaning: v.optional(v.string()),
    ipa: v.optional(v.string()),
    example: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { vocabularyId, ...updates } = args;
    
    // Lọc bỏ các field undefined
    const filteredUpdates: Record<string, string> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }

    await ctx.db.patch(vocabularyId, filteredUpdates);
    return vocabularyId;
  },
});

// Mutation: Xóa từ vựng
export const deleteVocabulary = mutation({
  args: { vocabularyId: v.id("vocabulary") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.vocabularyId);
  },
});
