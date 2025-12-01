import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all teachers
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("teachers")
      .order("desc")
      .collect();
  },
});

// Get teacher by ID
export const get = query({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get teacher by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("teachers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create teacher
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if email already exists
    const existing = await ctx.db
      .query("teachers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already exists");
    }

    return await ctx.db.insert("teachers", {
      name: args.name,
      email: args.email,
      subject: args.subject,
      department: args.department,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update teacher
export const update = mutation({
  args: {
    id: v.id("teachers"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    subject: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if email is being updated and if it already exists
    if (updates.email) {
      const existing = await ctx.db
        .query("teachers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Email already exists");
      }
    }

    const teacher = await ctx.db.get(id);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete teacher
export const remove = mutation({
  args: { id: v.id("teachers") },
  handler: async (ctx, args) => {
    // Update classes to remove teacher reference
    const classes = await ctx.db
      .query("classes")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.id))
      .collect();
    
    for (const classItem of classes) {
      await ctx.db.patch(classItem._id, { teacherId: undefined });
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

