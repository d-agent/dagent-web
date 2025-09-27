import { useState, useEffect, useCallback } from "react";
import { LLMService, LLMModelCost, LLMProvider } from "@/lib/api/llm.service";

export interface UseLLMOptions {
  autoFetchOnProviderChange?: boolean;
  initialProvider?: string;
}

export interface UseLLMReturn {
  // State
  providers: LLMProvider[];
  models: LLMModelCost[];
  selectedProvider: string | null;
  selectedModel: LLMModelCost | null;
  isLoadingModels: boolean;
  error: string | null;

  // Actions
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  fetchModels: (provider?: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing LLM providers and models
 */
export function useLLM(options: UseLLMOptions = {}): UseLLMReturn {
  const { autoFetchOnProviderChange = true, initialProvider = "" } = options;

  // State
  const [providers] = useState<LLMProvider[]>(LLMService.getProviders());
  const [models, setModels] = useState<LLMModelCost[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(
    initialProvider || null
  );
  const [selectedModel, setSelectedModel] = useState<LLMModelCost | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch models for a provider
   */
  const fetchModels = useCallback(
    async (provider?: string) => {
      const targetProvider = provider || selectedProvider;

      if (!targetProvider || targetProvider === "Custom") {
        setModels([]);
        setSelectedModel(null);
        return;
      }

      setIsLoadingModels(true);
      setError(null);

      try {
        const fetchedModels = await LLMService.fetchModelsForProvider(
          targetProvider
        );
        setModels(fetchedModels);
        setSelectedModel(null); // Clear selected model when provider changes
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load models. Please try again.";
        setError(errorMessage);
        setModels([]);
        setSelectedModel(null);
      } finally {
        setIsLoadingModels(false);
      }
    },
    [selectedProvider]
  );

  /**
   * Set provider and optionally fetch models
   */
  const setProvider = useCallback(
    (provider: string) => {
      setSelectedProvider(provider);
      setSelectedModel(null);

      if (autoFetchOnProviderChange && provider && provider !== "Custom") {
        fetchModels(provider);
      } else {
        setModels([]);
      }
    },
    [autoFetchOnProviderChange, fetchModels]
  );

  /**
   * Set selected model
   */
  const setModel = useCallback(
    (modelName: string) => {
      const model = models.find((m) => m.model === modelName) || null;
      setSelectedModel(model);
    },
    [models]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setSelectedProvider(initialProvider || null);
    setSelectedModel(null);
    setModels([]);
    setError(null);
    setIsLoadingModels(false);
  }, [initialProvider]);

  // Auto-fetch models on mount if initial provider is set
  useEffect(() => {
    if (
      initialProvider &&
      initialProvider !== "Custom" &&
      autoFetchOnProviderChange
    ) {
      fetchModels(initialProvider);
    }
  }, [initialProvider, autoFetchOnProviderChange, fetchModels]);

  return {
    // State
    providers,
    models,
    selectedProvider,
    selectedModel,
    isLoadingModels,
    error,

    // Actions
    setProvider,
    setModel,
    fetchModels,
    clearError,
    reset,
  };
}

export default useLLM;
