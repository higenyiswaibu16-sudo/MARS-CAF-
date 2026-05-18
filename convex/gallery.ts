import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getGallery = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("gallery"),
    _creationTime: v.number(),
    image: v.string(),
    order: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("gallery").order("asc").collect();
  },
});

export const addToGallery = mutation({
  args: { images: v.array(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("gallery").collect();
    let nextOrder = existing.length;
    for (const image of args.images) {
      await ctx.db.insert("gallery", { image, order: nextOrder++ });
    }
    return null;
  },
});

export const removeFromGallery = mutation({
  args: { id: v.id("gallery") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
