import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all branches
export const list = query({
  handler: async (ctx) => {
    const branches = await ctx.db
      .query("branches")
      .order("desc")
      .collect();
    
    // Populate school information
    return await Promise.all(
      branches.map(async (branch) => {
        const school = await ctx.db.get(branch.schoolId);
        return {
          ...branch,
          school: school ? { id: school._id, name: school.name, code: school.code } : null,
        };
      })
    );
  },
});

// Get branch by ID
export const get = query({
  args: { id: v.id("branches") },
  handler: async (ctx, args) => {
    const branch = await ctx.db.get(args.id);
    if (!branch) return null;
    
    const school = await ctx.db.get(branch.schoolId);
    return {
      ...branch,
      school: school ? { id: school._id, name: school.name, code: school.code } : null,
    };
  },
});

// Get branches by school
export const getBySchool = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("branches")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();
  },
});

// Get branch by code
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("branches")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
  },
});

// Create branch
export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    schoolId: v.id("schools"),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    manager: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if code already exists
    const existing = await ctx.db
      .query("branches")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    
    if (existing) {
      throw new Error("Branch code already exists");
    }

    // Verify school exists
    const school = await ctx.db.get(args.schoolId);
    if (!school) {
      throw new Error("School not found");
    }

    return await ctx.db.insert("branches", {
      name: args.name,
      code: args.code,
      schoolId: args.schoolId,
      address: args.address,
      phone: args.phone,
      email: args.email,
      manager: args.manager,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update branch
export const update = mutation({
  args: {
    id: v.id("branches"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    schoolId: v.optional(v.id("schools")),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    manager: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if code is being updated and if it already exists
    if (updates.code) {
      const existing = await ctx.db
        .query("branches")
        .withIndex("by_code", (q) => q.eq("code", updates.code!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Branch code already exists");
      }
    }

    // Verify school exists if provided
    if (updates.schoolId) {
      const school = await ctx.db.get(updates.schoolId);
      if (!school) {
        throw new Error("School not found");
      }
    }

    const branch = await ctx.db.get(id);
    if (!branch) {
      throw new Error("Branch not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete branch
export const remove = mutation({
  args: { id: v.id("branches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

