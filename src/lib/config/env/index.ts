import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_PROVIDER_ADDRESS: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_PROVIDER_ADDRESS: process.env.NEXT_PUBLIC_PROVIDER_ADDRESS,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
