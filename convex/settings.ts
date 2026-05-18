import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getSettings = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("settings"),
      _creationTime: v.number(),
      name: v.string(),
      phone: v.string(),
      altPhone: v.string(),
      email: v.string(),
      location: v.string(),
      openHours: v.string(),
      galleryTitle: v.string(),
      gallerySubtitle: v.string(),
      themeColor: v.string(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("settings").first();
  },
});

export const updateSettings = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    altPhone: v.optional(v.string()),
    email: v.optional(v.string()),
    location: v.optional(v.string()),
    openHours: v.optional(v.string()),
    galleryTitle: v.optional(v.string()),
    gallerySubtitle: v.optional(v.string()),
    themeColor: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      // Default initial settings if none exist
      await ctx.db.insert("settings", {
        name: args.name ?? "Mars Cafe Gardens",
        phone: args.phone ?? "+256 709 737 688",
        altPhone: args.altPhone ?? "+256 700 000 000",
        email: args.email ?? "info@marscafegardens.com",
        location: args.location ?? "Kyengera, Masaka Road, Kampala, Uganda",
        openHours: args.openHours ?? "Open 24 Hours, 7 Days a week",
        galleryTitle: args.galleryTitle ?? "Our Atmosphere",
        gallerySubtitle: args.gallerySubtitle ?? "The Experience",
        themeColor: args.themeColor ?? "#22c55e",
      });
    }
    return null;
  },
});
