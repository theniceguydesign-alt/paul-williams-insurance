import { authRouter } from "./auth-router";
import { leadsRouter } from "./leads-router";
import { messagesRouter } from "./messages-router";
import { statsRouter } from "./stats-router";
import { intakeRouter } from "./intake-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  leads: leadsRouter,
  messages: messagesRouter,
  stats: statsRouter,
  intake: intakeRouter,
});

export type AppRouter = typeof appRouter;
