import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getReviews = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("reviews"),
    _creationTime: v.number(),
    name: v.string(),
    text: v.string(),
    rating: v.number(),
    date: v.string(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const addReview = mutation({
  args: {
    name: v.string(),
    text: v.string(),
    rating: v.number(),
    date: v.string(),
  },
  returns: v.id("reviews"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const deleteReview = mutation({
  args: { id: v.id("reviews") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
