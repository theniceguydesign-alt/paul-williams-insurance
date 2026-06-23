import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { leads } from "@db/schema";

export const leadsRouter = createRouter({
  // Public: Submit a new lead (quote request)
  create: publicQuery
    .input(
      z.object({
        fullName: z.string().min(2).max(255),
        email: z.string().email().max(255),
        phone: z.string().min(1).max(50),
        insuranceType: z.enum([
          "Auto",
          "Home",
          "Renters",
          "Life",
          "Business",
          "Boat/Recreational",
          "Other",
        ]),
        message: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(leads).values({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        insuranceType: input.insuranceType,
        message: input.message || null,
        status: "new",
        source: "website",
      });

      const insertedId = Number(result[0].insertId);
      const [lead] = await db.select().from(leads).where(eq(leads.id, insertedId)).limit(1);

      return { success: true, data: lead };
    }),

  // Admin: List all leads with pagination, filtering, sorting
  list: adminQuery
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          status: z
            .enum(["new", "contacted", "quoted", "bound", "lost"])
            .optional(),
          insuranceType: z.string().optional(),
          sort: z.enum(["newest", "oldest"]).default("newest"),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      // Get total count
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(leads);
      const total = countResult[0]?.count ?? 0;

      // Get leads
      const orderBy = input?.sort === "oldest" ? leads.createdAt : desc(leads.createdAt);

      const leadList = await db
        .select()
        .from(leads)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      return {
        success: true,
        data: {
          leads: leadList,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      };
    }),

  // Admin: Get a single lead
  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [lead] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.id))
        .limit(1);

      if (!lead) {
        throw new Error("Lead not found");
      }

      return { success: true, data: lead };
    }),

  // Admin: Update lead status
  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "quoted", "bound", "lost"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(leads)
        .set({ status: input.status })
        .where(eq(leads.id, input.id));

      const [updated] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, input.id))
        .limit(1);

      return { success: true, data: updated };
    }),

  // Admin: Delete a lead
  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(leads).where(eq(leads.id, input.id));
      return { success: true, message: "Lead deleted" };
    }),
});
