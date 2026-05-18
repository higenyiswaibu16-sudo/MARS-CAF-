import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    if (!settings) {
      await ctx.db.insert("settings", {
        name: "Mars Cafe Gardens",
        phone: "+256 709 737 688",
        altPhone: "+256 700 000 000",
        email: "info@marscafegardens.com",
        location: "Kyengera, Masaka Road, Kampala, Uganda",
        openHours: "Open 24 Hours, 7 Days a week",
        galleryTitle: "Our Atmosphere",
        gallerySubtitle: "The Experience",
        themeColor: "#22c55e",
      });
    }

    const menu = await ctx.db.query("menuItems").first();
    if (!menu) {
      const items = [
        {
          name: "Special Rolex",
          price: 5000,
          category: "Breakfast",
          description: "The legendary Ugandan street food - 2 eggs, veggies, and a soft chapati.",
          image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop",
          isBestSeller: true
        },
        {
          name: "Chips & Chicken",
          price: 20000,
          category: "Fast Food",
          description: "Crispy golden fries served with perfectly seasoned deep-fried chicken.",
          image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop",
          isBestSeller: true
        },
        {
          name: "Beef Pilau",
          price: 12000,
          category: "Local Dishes",
          description: "Aromatic spiced rice cooked with tender beef chunks and kachumbari.",
          image: "https://images.unsplash.com/photo-1512058560366-cd242d458530?q=80&w=800&auto=format&fit=crop"
        }
      ];
      for (const item of items) {
        await ctx.db.insert("menuItems", item);
      }
    }
    return null;
  },
});
