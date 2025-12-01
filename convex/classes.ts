import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all classes
export const list = query({
  handler: async (ctx) => {
    const classes = await ctx.db
      .query("classes")
      .order("desc")
      .collect();
    
    // Populate teacher information
    return await Promise.all(
      classes.map(async (classItem) => {
        const teacher = classItem.teacherId
          ? await ctx.db.get(classItem.teacherId)
          : null;
        return {
          ...classItem,
          teacher: teacher ? { id: teacher._id, name: teacher.name, email: teacher.email } : null,
        };
      })
    );
  },
});

// Get class by ID
export const get = query({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    const classItem = await ctx.db.get(args.id);
    if (!classItem) return null;
    
    const teacher = classItem.teacherId
      ? await ctx.db.get(classItem.teacherId)
      : null;
    
    return {
      ...classItem,
      teacher: teacher ? { id: teacher._id, name: teacher.name, email: teacher.email } : null,
    };
  },
});

// Get class by code
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("classes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
  },
});

// Create class
export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    teacherId: v.optional(v.id("teachers")),
    schedule: v.optional(v.string()),
    capacity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if code already exists
    const existing = await ctx.db
      .query("classes")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    
    if (existing) {
      throw new Error("Class code already exists");
    }

    // Verify teacher exists if provided
    if (args.teacherId) {
      const teacher = await ctx.db.get(args.teacherId);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    return await ctx.db.insert("classes", {
      name: args.name,
      code: args.code,
      description: args.description,
      teacherId: args.teacherId,
      schedule: args.schedule,
      capacity: args.capacity,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update class
export const update = mutation({
  args: {
    id: v.id("classes"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    teacherId: v.optional(v.id("teachers")),
    schedule: v.optional(v.string()),
    capacity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if code is being updated and if it already exists
    if (updates.code) {
      const existing = await ctx.db
        .query("classes")
        .withIndex("by_code", (q) => q.eq("code", updates.code!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Class code already exists");
      }
    }

    // Verify teacher exists if provided
    if (updates.teacherId) {
      const teacher = await ctx.db.get(updates.teacherId);
      if (!teacher) {
        throw new Error("Teacher not found");
      }
    }

    const classItem = await ctx.db.get(id);
    if (!classItem) {
      throw new Error("Class not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete class
export const remove = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    // Delete related enrollments first
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_class", (q) => q.eq("classId", args.id))
      .collect();
    
    for (const enrollment of enrollments) {
      await ctx.db.delete(enrollment._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

