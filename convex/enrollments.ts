import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all enrollments
export const list = query({
  handler: async (ctx) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .order("desc")
      .collect();
    
    // Populate student and class information
    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await ctx.db.get(enrollment.studentId);
        const classItem = await ctx.db.get(enrollment.classId);
        return {
          ...enrollment,
          student: student ? {
            id: student._id,
            name: student.name,
            email: student.email,
            age: student.age,
            grade: student.grade,
          } : null,
          class: classItem ? {
            id: classItem._id,
            name: classItem.name,
            code: classItem.code,
            description: classItem.description,
          } : null,
        };
      })
    );
  },
});

// Get enrollment by ID
export const get = query({
  args: { id: v.id("enrollments") },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db.get(args.id);
    if (!enrollment) return null;
    
    const student = await ctx.db.get(enrollment.studentId);
    const classItem = await ctx.db.get(enrollment.classId);
    
    return {
      ...enrollment,
      student: student ? {
        id: student._id,
        name: student.name,
        email: student.email,
      } : null,
      class: classItem ? {
        id: classItem._id,
        name: classItem.name,
        code: classItem.code,
      } : null,
    };
  },
});

// Get enrollments by student
export const getByStudent = query({
  args: { studentId: v.id("students") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .collect();
    
    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const classItem = await ctx.db.get(enrollment.classId);
        return {
          ...enrollment,
          class: classItem ? {
            id: classItem._id,
            name: classItem.name,
            code: classItem.code,
          } : null,
        };
      })
    );
  },
});

// Get enrollments by class
export const getByClass = query({
  args: { classId: v.id("classes") },
  handler: async (ctx, args) => {
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_class", (q) => q.eq("classId", args.classId))
      .collect();
    
    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await ctx.db.get(enrollment.studentId);
        return {
          ...enrollment,
          student: student ? {
            id: student._id,
            name: student.name,
            email: student.email,
          } : null,
        };
      })
    );
  },
});

// Create enrollment
export const create = mutation({
  args: {
    studentId: v.id("students"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    // Check if enrollment already exists
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_student_class", (q) =>
        q.eq("studentId", args.studentId).eq("classId", args.classId)
      )
      .first();
    
    if (existing) {
      throw new Error("Student is already enrolled in this class");
    }

    // Verify student and class exist
    const student = await ctx.db.get(args.studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const classItem = await ctx.db.get(args.classId);
    if (!classItem) {
      throw new Error("Class not found");
    }

    return await ctx.db.insert("enrollments", {
      studentId: args.studentId,
      classId: args.classId,
      enrolledAt: Date.now(),
    });
  },
});

// Delete enrollment
export const remove = mutation({
  args: { id: v.id("enrollments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Unenroll student from class
export const unenroll = mutation({
  args: {
    studentId: v.id("students"),
    classId: v.id("classes"),
  },
  handler: async (ctx, args) => {
    const enrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_student_class", (q) =>
        q.eq("studentId", args.studentId).eq("classId", args.classId)
      )
      .first();
    
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }

    await ctx.db.delete(enrollment._id);
    return { success: true };
  },
});

