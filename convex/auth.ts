import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Login (verify credentials)
export const login = query({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Note: In a real implementation, you should hash and compare passwords
    // This is a simplified version - you should use bcrypt or similar
    if (user.password !== args.password) {
      throw new Error("Invalid email or password");
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Verify user token (placeholder - implement JWT verification if needed)
export const verify = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

