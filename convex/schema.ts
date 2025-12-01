import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  students: defineTable({
    name: v.string(),
    email: v.string(),
    age: v.optional(v.number()),
    grade: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

  teachers: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.string()),
    department: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]),

  classes: defineTable({
    name: v.string(),
    code: v.string(),
    description: v.optional(v.string()),
    teacherId: v.optional(v.id("teachers")),
    schedule: v.optional(v.string()),
    capacity: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_teacher", ["teacherId"]),

  enrollments: defineTable({
    studentId: v.id("students"),
    classId: v.id("classes"),
    enrolledAt: v.number(),
  })
    .index("by_student", ["studentId"])
    .index("by_class", ["classId"])
    .index("by_student_class", ["studentId", "classId"]),

  users: defineTable({
    email: v.string(),
    password: v.string(),
    name: v.string(),
    phoneNumber: v.optional(v.string()),
    phoneVerified: v.boolean(),
    role: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phoneNumber"]),

  messages: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_conversation", ["senderId", "receiverId"]),

  schools: defineTable({
    name: v.string(),
    code: v.string(),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    principal: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"]),

  branches: defineTable({
    name: v.string(),
    code: v.string(),
    schoolId: v.id("schools"),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    manager: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_school", ["schoolId"]),
});

