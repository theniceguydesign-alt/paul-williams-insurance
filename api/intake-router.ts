import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { intakeSubmissions } from "@db/schema";

export const intakeRouter = createRouter({
  // Public: Submit a new intake form
  create: publicQuery
    .input(
      z.object({
        primaryNamedInsured: z.string().min(1).max(255),
        dob: z.string().max(50).optional(),
        primaryAddress: z.string().optional(),
        riskAddress: z.string().optional(),
        email: z.string().email().max(255),
        phone: z.string().min(1).max(50),
        occupation: z.string().max(255).optional(),
        riskState: z.string().max(50).optional(),
        linesIncluded: z.string().max(255).optional(),
        formType: z.enum(["internal", "personal_lines"]).default("personal_lines"),
        priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
        formData: z.object({}).passthrough().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(intakeSubmissions).values({
        primaryNamedInsured: input.primaryNamedInsured,
        dob: input.dob || null,
        primaryAddress: input.primaryAddress || null,
        riskAddress: input.riskAddress || null,
        email: input.email,
        phone: input.phone,
        occupation: input.occupation || null,
        riskState: input.riskState || null,
        linesIncluded: input.linesIncluded || null,
        formType: input.formType,
        priority: input.priority,
        status: "new",
        formData: input.formData || {},
      });

      const insertedId = Number(result[0].insertId);
      const [submission] = await db
        .select()
        .from(intakeSubmissions)
        .where(eq(intakeSubmissions.id, insertedId))
        .limit(1);

      return { success: true, data: submission };
    }),

  // Admin: List all intake submissions
  list: adminQuery
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          status: z
            .enum(["new", "in_review", "submitted_to_carrier", "quoted", "bound", "declined"])
            .optional(),
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
        .from(intakeSubmissions);
      const total = countResult[0]?.count ?? 0;

      const submissions = await db
        .select()
        .from(intakeSubmissions)
        .orderBy(desc(intakeSubmissions.createdAt))
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        data: {
          submissions,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    }),

  // Admin: Get single submission
  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [submission] = await db
        .select()
        .from(intakeSubmissions)
        .where(eq(intakeSubmissions.id, input.id))
        .limit(1);

      if (!submission) throw new Error("Submission not found");
      return { success: true, data: submission };
    }),

  // Admin: Update status
  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "in_review", "submitted_to_carrier", "quoted", "bound", "declined"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(intakeSubmissions)
        .set({ status: input.status })
        .where(eq(intakeSubmissions.id, input.id));

      const [updated] = await db
        .select()
        .from(intakeSubmissions)
        .where(eq(intakeSubmissions.id, input.id))
        .limit(1);

      return { success: true, data: updated };
    }),

  // Admin: Add internal notes
  addNotes: adminQuery
    .input(z.object({ id: z.number(), notes: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(intakeSubmissions)
        .set({ internalNotes: input.notes })
        .where(eq(intakeSubmissions.id, input.id));

      const [updated] = await db
        .select()
        .from(intakeSubmissions)
        .where(eq(intakeSubmissions.id, input.id))
        .limit(1);

      return { success: true, data: updated };
    }),

  // Admin: Delete submission
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(intakeSubmissions).where(eq(intakeSubmissions.id, input.id));
      return { success: true, message: "Submission deleted" };
    }),

  // Admin: Get intake stats
  stats: adminQuery.query(async () => {
    const db = getDb();

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(intakeSubmissions);
    const total = totalResult[0]?.count ?? 0;

    const statusCounts = await db
      .select({
        status: intakeSubmissions.status,
        count: sql<number>`count(*)`,
      })
      .from(intakeSubmissions)
      .groupBy(intakeSubmissions.status);

    const statusMap: Record<string, number> = {};
    for (const row of statusCounts) {
      statusMap[row.status] = row.count;
    }

    const weekResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(intakeSubmissions)
      .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);

    return {
      success: true,
      data: {
        total,
        new: statusMap["new"] ?? 0,
        inReview: statusMap["in_review"] ?? 0,
        submittedToCarrier: statusMap["submitted_to_carrier"] ?? 0,
        quoted: statusMap["quoted"] ?? 0,
        bound: statusMap["bound"] ?? 0,
        declined: statusMap["declined"] ?? 0,
        thisWeek: weekResult[0]?.count ?? 0,
      },
    };
  }),
});
