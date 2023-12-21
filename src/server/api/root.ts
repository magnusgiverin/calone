import { createTRPCRouter } from "~/server/api/trpc";
import { programRouter } from "~/server/api/routers/program";
import { studyPlanRouter } from "./routers/studyPlan";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  program: programRouter,
  studyPlan: studyPlanRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;