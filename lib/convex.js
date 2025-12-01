import { ConvexHttpClient } from "convex/browser";
// Note: For server-side usage, you can also use ConvexHttpClient from "convex/browser"
// or install @convex-dev/server-client for Node.js specific features

// Initialize Convex client
let convexClient = null;

const getConvexClient = () => {
  if (!convexClient) {
    const convexUrl = process.env.CONVEX_URL;
    if (!convexUrl) {
      throw new Error(
        "CONVEX_URL environment variable is not set. Please configure it in your environment variables."
      );
    }
    convexClient = new ConvexHttpClient(convexUrl);
  }
  return convexClient;
};

// Helper to convert Convex ID to string for compatibility
const convertId = (id) => {
  if (typeof id === "string") {
    return id;
  }
  return id?.toString() || id;
};

// Students
export const convexStudents = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("students:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("students:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("students:create", data);
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("students:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("students:remove", { id });
    return { success: true };
  },
};

// Teachers
export const convexTeachers = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("teachers:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("teachers:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("teachers:create", data);
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("teachers:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("teachers:remove", { id });
    return { success: true };
  },
};

// Classes
export const convexClasses = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("classes:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      teacherId: item.teacherId ? convertId(item.teacherId) : null,
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("classes:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      teacherId: result.teacherId ? convertId(result.teacherId) : null,
      _id: undefined,
    };
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("classes:create", data);
    return {
      ...result,
      id: convertId(result._id),
      teacherId: result.teacherId ? convertId(result.teacherId) : null,
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("classes:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      teacherId: result.teacherId ? convertId(result.teacherId) : null,
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("classes:remove", { id });
    return { success: true };
  },
};

// Enrollments
export const convexEnrollments = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("enrollments:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      studentId: convertId(item.studentId),
      classId: convertId(item.classId),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("enrollments:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      studentId: convertId(result.studentId),
      classId: convertId(result.classId),
      _id: undefined,
    };
  },

  getByStudent: async (studentId) => {
    const client = getConvexClient();
    const results = await client.query("enrollments:getByStudent", { studentId });
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      studentId: convertId(item.studentId),
      classId: convertId(item.classId),
      _id: undefined,
    }));
  },

  getByClass: async (classId) => {
    const client = getConvexClient();
    const results = await client.query("enrollments:getByClass", { classId });
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      studentId: convertId(item.studentId),
      classId: convertId(item.classId),
      _id: undefined,
    }));
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("enrollments:create", data);
    return {
      ...result,
      id: convertId(result._id),
      studentId: convertId(result.studentId),
      classId: convertId(result.classId),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("enrollments:remove", { id });
    return { success: true };
  },

  unenroll: async (studentId, classId) => {
    const client = getConvexClient();
    await client.mutation("enrollments:unenroll", { studentId, classId });
    return { success: true };
  },
};

// Users
export const convexUsers = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("users:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("users:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  getByEmail: async (email) => {
    const client = getConvexClient();
    const result = await client.query("users:getByEmail", { email });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("users:create", data);
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("users:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("users:remove", { id });
    return { success: true };
  },
};

// Messages
export const convexMessages = {
  getAll: async (userId) => {
    const client = getConvexClient();
    const results = await client.query("messages:list", { userId });
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      senderId: convertId(item.senderId),
      receiverId: convertId(item.receiverId),
      _id: undefined,
    }));
  },

  getConversation: async (userId1, userId2) => {
    const client = getConvexClient();
    const results = await client.query("messages:getConversation", {
      userId1,
      userId2,
    });
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      senderId: convertId(item.senderId),
      receiverId: convertId(item.receiverId),
      _id: undefined,
    }));
  },

  getUnreadCount: async (userId) => {
    const client = getConvexClient();
    return await client.query("messages:getUnreadCount", { userId });
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("messages:create", data);
    return {
      ...result,
      id: convertId(result._id),
      senderId: convertId(result.senderId),
      receiverId: convertId(result.receiverId),
      _id: undefined,
    };
  },

  markAsRead: async (id) => {
    const client = getConvexClient();
    const result = await client.mutation("messages:markAsRead", { id });
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("messages:remove", { id });
    return { success: true };
  },
};

// Schools
export const convexSchools = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("schools:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("schools:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("schools:create", data);
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("schools:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("schools:remove", { id });
    return { success: true };
  },
};

// Branches
export const convexBranches = {
  getAll: async () => {
    const client = getConvexClient();
    const results = await client.query("branches:list");
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      schoolId: convertId(item.schoolId),
      _id: undefined,
    }));
  },

  getById: async (id) => {
    const client = getConvexClient();
    const result = await client.query("branches:get", { id });
    if (!result) return null;
    return {
      ...result,
      id: convertId(result._id),
      schoolId: convertId(result.schoolId),
      _id: undefined,
    };
  },

  getBySchool: async (schoolId) => {
    const client = getConvexClient();
    const results = await client.query("branches:getBySchool", { schoolId });
    return results.map((item) => ({
      ...item,
      id: convertId(item._id),
      schoolId: convertId(item.schoolId),
      _id: undefined,
    }));
  },

  create: async (data) => {
    const client = getConvexClient();
    const result = await client.mutation("branches:create", data);
    return {
      ...result,
      id: convertId(result._id),
      schoolId: convertId(result.schoolId),
      _id: undefined,
    };
  },

  update: async (id, data) => {
    const client = getConvexClient();
    const result = await client.mutation("branches:update", { id, ...data });
    return {
      ...result,
      id: convertId(result._id),
      schoolId: result.schoolId ? convertId(result.schoolId) : null,
      _id: undefined,
    };
  },

  delete: async (id) => {
    const client = getConvexClient();
    await client.mutation("branches:remove", { id });
    return { success: true };
  },
};

// Analytics
export const convexAnalytics = {
  getStats: async () => {
    const client = getConvexClient();
    return await client.query("analytics:getStats");
  },

  getEnrollmentsByClass: async () => {
    const client = getConvexClient();
    return await client.query("analytics:getEnrollmentsByClass");
  },

  getStudentsByGrade: async () => {
    const client = getConvexClient();
    return await client.query("analytics:getStudentsByGrade");
  },

  getRecentEnrollments: async (limit = 10) => {
    const client = getConvexClient();
    return await client.query("analytics:getRecentEnrollments", { limit });
  },

  getClassCapacity: async () => {
    const client = getConvexClient();
    return await client.query("analytics:getClassCapacity");
  },
};

export default {
  students: convexStudents,
  teachers: convexTeachers,
  classes: convexClasses,
  enrollments: convexEnrollments,
  users: convexUsers,
  messages: convexMessages,
  schools: convexSchools,
  branches: convexBranches,
  analytics: convexAnalytics,
};

