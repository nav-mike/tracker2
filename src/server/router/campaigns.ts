import { z } from "zod";

const CreateCampaignDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  path: z.object({
    landingPageId: z.string(),
    offerPageId: z.string(),
  }),
});
