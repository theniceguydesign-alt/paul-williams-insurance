import { sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { leads, messages } from "@db/schema";

export const statsRouter = createRouter({
  // Admin: Get dashboard statistics
  get: adminQuery.query(async () => {
    const db = getDb();

    // Lead counts by status
    const leadStatusCounts = await db
      .select({
        status: leads.status,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .groupBy(leads.status);

    const statusMap: Record<string, number> = {};
    for (const row of leadStatusCounts) {
      statusMap[row.status] = row.count;
    }

    // Total leads
    const totalLeadsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads);
    const totalLeads = totalLeadsResult[0]?.count ?? 0;

    // Total messages
    const totalMessagesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages);
    const totalMessages = totalMessagesResult[0]?.count ?? 0;

    // Unread messages
    const unreadMessagesResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(messages)
      .where(sql`isRead = 'false'`);
    const unreadMessages = unreadMessagesResult[0]?.count ?? 0;

    // Leads by insurance type
    const leadsByType = await db
      .select({
        insuranceType: leads.insuranceType,
        count: sql<number>`count(*)`,
      })
      .from(leads)
      .groupBy(leads.insuranceType);

    const typeMap: Record<string, number> = {};
    for (const row of leadsByType) {
      typeMap[row.insuranceType] = row.count;
    }

    // Recent leads (last 7 days)
    const weekLeadsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);
    const leadsThisWeek = weekLeadsResult[0]?.count ?? 0;

    // Recent leads (last 30 days)
    const monthLeadsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
    const leadsThisMonth = monthLeadsResult[0]?.count ?? 0;

    return {
      success: true,
      data: {
        totalLeads,
        newLeads: statusMap["new"] ?? 0,
        contactedLeads: statusMap["contacted"] ?? 0,
        quotedLeads: statusMap["quoted"] ?? 0,
        boundLeads: statusMap["bound"] ?? 0,
        lostLeads: statusMap["lost"] ?? 0,
        totalMessages,
        unreadMessages,
        leadsThisWeek,
        leadsThisMonth,
        leadsByType: typeMap,
      },
    };
  }),
});
