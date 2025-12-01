import { query } from "./_generated/server";
import { v } from "convex/values";

// Get statistics
export const getStats = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    const teachers = await ctx.db.query("teachers").collect();
    const classes = await ctx.db.query("classes").collect();
    const enrollments = await ctx.db.query("enrollments").collect();
    const users = await ctx.db.query("users").collect();

    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalEnrollments: enrollments.length,
      totalUsers: users.length,
    };
  },
});

// Get enrollments by class
export const getEnrollmentsByClass = query({
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    const enrollments = await ctx.db.query("enrollments").collect();

    return classes.map((classItem) => {
      const classEnrollments = enrollments.filter(
        (e) => e.classId === classItem._id
      );
      return {
        classId: classItem._id,
        className: classItem.name,
        classCode: classItem.code,
        enrollmentCount: classEnrollments.length,
      };
    });
  },
});

// Get students by grade
export const getStudentsByGrade = query({
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    
    const gradeCounts: Record<string, number> = {};
    students.forEach((student) => {
      const grade = student.grade || "Ungraded";
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });

    return Object.entries(gradeCounts).map(([grade, count]) => ({
      grade,
      count,
    }));
  },
});

// Get recent enrollments
export const getRecentEnrollments = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const enrollments = await ctx.db
      .query("enrollments")
      .order("desc")
      .take(limit);

    return await Promise.all(
      enrollments.map(async (enrollment) => {
        const student = await ctx.db.get(enrollment.studentId);
        const classItem = await ctx.db.get(enrollment.classId);
        return {
          ...enrollment,
          student: student ? { name: student.name, email: student.email } : null,
          class: classItem ? { name: classItem.name, code: classItem.code } : null,
        };
      })
    );
  },
});

// Get class capacity
export const getClassCapacity = query({
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    const enrollments = await ctx.db.query("enrollments").collect();

    return classes.map((classItem) => {
      const enrollmentCount = enrollments.filter(
        (e) => e.classId === classItem._id
      ).length;
      return {
        classId: classItem._id,
        className: classItem.name,
        classCode: classItem.code,
        capacity: classItem.capacity || 0,
        enrolled: enrollmentCount,
        available: (classItem.capacity || 0) - enrollmentCount,
      };
    });
  },
});

