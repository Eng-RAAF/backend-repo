import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all messages for a user
export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sent = await ctx.db
      .query("messages")
      .withIndex("by_sender", (q) => q.eq("senderId", args.userId))
      .collect();
    
    const received = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
      .collect();
    
    const allMessages = [...sent, ...received];
    
    // Populate sender and receiver information
    return await Promise.all(
      allMessages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        const receiver = await ctx.db.get(message.receiverId);
        return {
          ...message,
          sender: sender ? { id: sender._id, name: sender.name, email: sender.email } : null,
          receiver: receiver ? { id: receiver._id, name: receiver.name, email: receiver.email } : null,
        };
      })
    );
  },
});

// Get conversation between two users
export const getConversation = query({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId1).eq("receiverId", args.userId2)
      )
      .collect();
    
    const reverseMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.userId2).eq("receiverId", args.userId1)
      )
      .collect();
    
    const allMessages = [...messages, ...reverseMessages].sort(
      (a, b) => a.createdAt - b.createdAt
    );
    
    return await Promise.all(
      allMessages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        const receiver = await ctx.db.get(message.receiverId);
        return {
          ...message,
          sender: sender ? { id: sender._id, name: sender.name } : null,
          receiver: receiver ? { id: receiver._id, name: receiver.name } : null,
        };
      })
    );
  },
});

// Get unread message count
export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    
    return unreadMessages.length;
  },
});

// Create message
export const create = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Verify sender and receiver exist
    const sender = await ctx.db.get(args.senderId);
    if (!sender) {
      throw new Error("Sender not found");
    }

    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) {
      throw new Error("Receiver not found");
    }

    return await ctx.db.insert("messages", {
      senderId: args.senderId,
      receiverId: args.receiverId,
      content: args.content,
      read: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mark message as read
export const markAsRead = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new Error("Message not found");
    }

    return await ctx.db.patch(args.id, {
      read: true,
      updatedAt: Date.now(),
    });
  },
});

// Delete message
export const remove = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

