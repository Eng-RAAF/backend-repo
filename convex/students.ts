import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all students
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("students")
      .order("desc")
      .collect();
  },
});

// Get student by ID
export const get = query({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get student by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("students")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Create student
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    age: v.optional(v.number()),
    grade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if email already exists
    const existing = await ctx.db
      .query("students")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("Email already exists");
    }

    return await ctx.db.insert("students", {
      name: args.name,
      email: args.email,
      age: args.age,
      grade: args.grade,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update student
export const update = mutation({
  args: {
    id: v.id("students"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    age: v.optional(v.number()),
    grade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if email is being updated and if it already exists
    if (updates.email) {
      const existing = await ctx.db
        .query("students")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Email already exists");
      }
    }

    const student = await ctx.db.get(id);
    if (!student) {
      throw new Error("Student not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete student
export const remove = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    // Delete related enrollments first
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", args.id))
      .collect();
    
    for (const enrollment of enrollments) {
      await ctx.db.delete(enrollment._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

