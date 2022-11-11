// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { landingPagesRouter } from "./landingPages";
import { offerPagesRouter } from "./offerPages";
import { campaignsRouter } from "./campaigns";
import { reportsRouter } from "./reports";
import { billingRouter } from "./billing";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("landingPages.", landingPagesRouter)
  .merge("offerPages.", offerPagesRouter)
  .merge("campaigns.", campaignsRouter)
  .merge("reports.", reportsRouter)
  .merge("billing.", billingRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
