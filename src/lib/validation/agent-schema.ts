import { z } from "zod";

// Define the validation schema for agent form
export const agentFormSchema = z.object({
  agentName: z
    .string()
    .min(3, "Agent name must be at least 3 characters")
    .max(50, "Agent name must not exceed 50 characters"),
  agentDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  llmProvider: z.enum(["OpenAI", "Anthropic", "Llama", "Google", "Custom"]),
  llmModel: z.string().min(1, "LLM Model is required"),
  inputCostPer1M: z.number().nonnegative().optional(),
  outputCostPer1M: z.number().nonnegative().optional(),
  costPerToken: z.coerce
    .number()
    .positive("Cost per token must be positive")
    .min(0.0001, "Minimum cost is 0.0001")
    .max(1, "Maximum cost is 1"),
});

// We'll handle the card.json file separately since it's not a simple input field
export type AgentFormValues = z.infer<typeof agentFormSchema> & {
  cardJson?: FileList;
};

// Agent Card JSON schema (partial validation to ensure critical fields exist)
export const agentCardSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  endpoints: z
    .array(
      z.object({
        url: z.string().url(),
        type: z.string(),
      })
    )
    .optional(),
  authentication: z
    .object({
      type: z.string(),
    })
    .optional(),
  features: z.record(z.string(), z.any()).optional(),
});

export type AgentCard = z.infer<typeof agentCardSchema>;
