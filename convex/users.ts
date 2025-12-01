import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .collect();
  },
});

// Get user by ID
export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by phone number
export const getByPhone = query({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", args.phoneNumber))
      .first();
  },
});

// Create user
export const create = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already exists");
    }

    // Check if phone number already exists (if provided)
    if (args.phoneNumber) {
      const existingPhone = await ctx.db
        .query("users")
        .withIndex("by_phone", (q) => q.eq("phoneNumber", args.phoneNumber))
        .first();
      
      if (existingPhone) {
        throw new Error("Phone number already exists");
      }
    }

    return await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      name: args.name,
      phoneNumber: args.phoneNumber,
      phoneVerified: args.phoneVerified ?? false,
      role: args.role ?? "student",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update user
export const update = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
    name: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if email is being updated and if it already exists
    if (updates.email) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Email already exists");
      }
    }

    // Check if phone number is being updated and if it already exists
    if (updates.phoneNumber) {
      const existing = await ctx.db
        .query("users")
        .withIndex("by_phone", (q) => q.eq("phoneNumber", updates.phoneNumber!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Phone number already exists");
      }
    }

    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete user
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    // Delete related messages
    const sentMessages = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", args.id))
      .collect();
    
    const receivedMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", args.id))
      .collect();
    
    for (const message of [...sentMessages, ...receivedMessages]) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

