import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  menuItems: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.string(),
    description: v.string(),
    image: v.string(), // Base64 or URL
    isBestSeller: v.optional(v.boolean()),
  }),

  settings: defineTable({
    name: v.string(),
    phone: v.string(),
    altPhone: v.string(),
    email: v.string(),
    location: v.string(),
    openHours: v.string(),
    galleryTitle: v.string(),
    gallerySubtitle: v.string(),
    themeColor: v.string(),
  }),

  gallery: defineTable({
    image: v.string(), // Base64 or URL
    order: v.number(),
  }),

  reviews: defineTable({
    name: v.string(),
    text: v.string(),
    rating: v.number(),
    date: v.string(),
  }),
});
