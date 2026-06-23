import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { messages } from "@db/schema";

export const messagesRouter = createRouter({
  // Public: Submit a contact message
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().max(255),
        phone: z.string().max(50).optional(),
        subject: z.string().max(255).optional(),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(messages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject || null,
        message: input.message,
      });

      const insertedId = Number(result[0].insertId);
      const [msg] = await db.select().from(messages).where(eq(messages.id, insertedId)).limit(1);

      return { success: true, data: msg };
    }),

  // Admin: List all messages
  list: adminQuery
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          isRead: z.enum(["true", "false"]).optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(messages);
      const total = countResult[0]?.count ?? 0;

      const messageList = await db
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        data: {
          messages: messageList,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    }),

  // Admin: Mark message as read/unread
  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        isRead: z.enum(["true", "false"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(messages)
        .set({ isRead: input.isRead })
        .where(eq(messages.id, input.id));

      const [updated] = await db
        .select()
        .from(messages)
        .where(eq(messages.id, input.id))
        .limit(1);

      return { success: true, data: updated };
    }),

  // Admin: Delete a message
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(messages).where(eq(messages.id, input.id));
      return { success: true, message: "Message deleted" };
    }),
});
