import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getMenuItems = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("menuItems"),
    _creationTime: v.number(),
    name: v.string(),
    price: v.number(),
    category: v.string(),
    description: v.string(),
    image: v.string(),
    isBestSeller: v.optional(v.boolean()),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

export const addMenuItem = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    category: v.string(),
    description: v.string(),
    image: v.string(),
    isBestSeller: v.optional(v.boolean()),
  },
  returns: v.id("menuItems"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", args);
  },
});

export const updateMenuItem = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isBestSeller: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
    return null;
  },
});

export const deleteMenuItem = mutation({
  args: { id: v.id("menuItems") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});
