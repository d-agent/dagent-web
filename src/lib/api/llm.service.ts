import { externalApiClient } from "./client";

// Types for LLM API
export interface LLMModelCost {
  provider: string;
  model: string;
  operator: string;
  input_cost_per_1m: number;
  output_cost_per_1m: number;
  prompt_cache_read_per_1m?: number;
  show_in_playground?: boolean;
}

export interface HeliconeCostResponse {
  metadata: {
    total_models: number;
    note: string;
    operators_explained: {
      equals: string;
      startsWith: string;
      includes: string;
    };
  };
  data: LLMModelCost[];
}

export interface LLMProvider {
  name: string;
  value: string;
  displayName: string;
}

// LLM Service
export class LLMService {
  private static readonly HELICONE_BASE_URL = "https://www.helicone.ai/api";

  // Available providers
  static readonly PROVIDERS: LLMProvider[] = [
    { name: "OpenAI", value: "OpenAI", displayName: "OpenAI" },
    { name: "Anthropic", value: "Anthropic", displayName: "Anthropic" },
    { name: "Llama", value: "Llama", displayName: "Llama" },
    { name: "Google", value: "Google", displayName: "Google (Gemini)" },
    { name: "Custom", value: "Custom", displayName: "Custom" },
  ];

  /**
   * Fetch models for a specific LLM provider
   */
  static async fetchModelsForProvider(
    provider: string
  ): Promise<LLMModelCost[]> {
    if (!provider || provider === "Custom") {
      return [];
    }

    try {
      // Use fetch API as fallback until axios is installed
      const url = `${
        this.HELICONE_BASE_URL
      }/llm-costs?provider=${provider.toLowerCase()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch models: ${response.status} ${response.statusText}`
        );
      }

      const data: HeliconeCostResponse = await response.json();

      // Filter models to only include those that are shown in playground for better selection
      const filteredModels = data.data
        .filter(
          (model) =>
            model.show_in_playground === true ||
            model.provider.toUpperCase() === provider.toUpperCase()
        )
        .sort((a, b) => a.model.localeCompare(b.model));

      return filteredModels;
    } catch (error) {
      console.error(`Error fetching models for provider ${provider}:`, error);
      throw new Error(`Failed to fetch models for ${provider}`);
    }
  }

  /**
   * Get all available providers
   */
  static getProviders(): LLMProvider[] {
    return this.PROVIDERS;
  }

  /**
   * Get provider by value
   */
  static getProviderByValue(value: string): LLMProvider | undefined {
    return this.PROVIDERS.find((provider) => provider.value === value);
  }

  /**
   * Validate if a provider exists
   */
  static isValidProvider(provider: string): boolean {
    return this.PROVIDERS.some((p) => p.value === provider);
  }
}

export default LLMService;
