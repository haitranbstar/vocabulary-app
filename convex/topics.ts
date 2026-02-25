import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Lấy tất cả topics
export const getTopics = query({
  args: {},
  handler: async (ctx) => {
    const topics = await ctx.db.query("topics").order("desc").collect();
    
    // Lấy số lượng từ vựng cho mỗi topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const count = await ctx.db
          .query("vocabulary")
          .withIndex("by_topic", (q) => q.eq("topicId", topic._id))
          .collect();
        return {
          ...topic,
          vocabularyCount: count.length,
        };
      })
    );
    
    return topicsWithCount;
  },
});

// Query: Lấy một topic theo ID
export const getTopic = query({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.topicId);
  },
});

// Mutation: Tạo topic mới
export const createTopic = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Kiểm tra trùng lặp tên
    const existing = await ctx.db
      .query("topics")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      throw new Error(`Topic "${args.name}" đã tồn tại!`);
    }

    return await ctx.db.insert("topics", {
      name: args.name,
      createdAt: Date.now(),
    });
  },
});

// Mutation: Xóa topic và tất cả vocabulary liên quan
export const deleteTopic = mutation({
  args: { topicId: v.id("topics") },
  handler: async (ctx, args) => {
    // Xóa tất cả vocabulary thuộc topic
    const vocabularies = await ctx.db
      .query("vocabulary")
      .withIndex("by_topic", (q) => q.eq("topicId", args.topicId))
      .collect();

    for (const vocab of vocabularies) {
      await ctx.db.delete(vocab._id);
    }

    // Xóa topic
    await ctx.db.delete(args.topicId);
  },
});
