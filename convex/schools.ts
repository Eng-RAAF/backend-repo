import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all schools
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("schools")
      .order("desc")
      .collect();
  },
});

// Get school by ID
export const get = query({
  args: { id: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get school by code
export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schools")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
  },
});

// Create school
export const create = mutation({
  args: {
    name: v.string(),
    code: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    principal: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if code already exists
    const existing = await ctx.db
      .query("schools")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();
    
    if (existing) {
      throw new Error("School code already exists");
    }

    return await ctx.db.insert("schools", {
      name: args.name,
      code: args.code,
      address: args.address,
      phone: args.phone,
      email: args.email,
      principal: args.principal,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update school
export const update = mutation({
  args: {
    id: v.id("schools"),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    principal: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Check if code is being updated and if it already exists
    if (updates.code) {
      const existing = await ctx.db
        .query("schools")
        .withIndex("by_code", (q) => q.eq("code", updates.code!))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("School code already exists");
      }
    }

    const school = await ctx.db.get(id);
    if (!school) {
      throw new Error("School not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete school
export const remove = mutation({
  args: { id: v.id("schools") },
  handler: async (ctx, args) => {
    // Delete related branches first
    const branches = await ctx.db
      .query("branches")
      .withIndex("by_school", (q) => q.eq("schoolId", args.id))
      .collect();
    
    for (const branch of branches) {
      await ctx.db.delete(branch._id);
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

