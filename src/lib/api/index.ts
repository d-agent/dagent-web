import axios from "axios";
import { env } from "../config/env";

// API Services
export * from "./llm.service";

// API Types
export * from "./types";

const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Re-export client for custom API calls
export { apiClient };
