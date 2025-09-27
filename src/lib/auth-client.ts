import { createAuthClient } from "better-auth/client";
import { siweClient, apiKeyClient } from "better-auth/client/plugins";
import { env } from "./config/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  plugins: [siweClient(), apiKeyClient()],
  fetchOptions: {
    credentials: "include",
  },
});
