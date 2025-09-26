"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { agentFormSchema, type AgentFormValues, agentCardSchema } from '@/lib/validation/agent-schema';
import { AgentCardGenerator } from '@/components/agent-card-generator';
import { toast } from 'sonner';

// Interface for LLM model cost data
interface LLMModelCost {
    provider: string;
    model: string;
    operator: string;
    input_cost_per_1m: number;
    output_cost_per_1m: number;
    prompt_cache_read_per_1m?: number;
    show_in_playground?: boolean;
}

// Interface for the Helicone API response
interface HeliconeCostResponse {
    metadata: {
        total_models: number;
        note: string;
        operators_explained: {
            equals: string;
            startsWith: string;
            includes: string;
        }
    };
    data: LLMModelCost[];
}

export default function AddAgentPage() {
    // Track the JSON content from the uploaded file
    const [cardJsonContent, setCardJsonContent] = useState<string | null>(null);
    const [cardJsonValid, setCardJsonValid] = useState<boolean | null>(null);
    const [cardJsonError, setCardJsonError] = useState<string | null>(null);

    // State for the agent card generator dialog
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    // Reference to the file input element
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // State for LLM provider models
    const [availableModels, setAvailableModels] = useState<LLMModelCost[]>([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [modelError, setModelError] = useState<string | null>(null); const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<AgentFormValues>({
        resolver: zodResolver(agentFormSchema) as any, // Type casting to avoid TypeScript errors
        defaultValues: {
            agentName: "",
            agentDescription: "",
            costPerToken: 0.0005,
            llmProvider: undefined,
            llmModel: "",
            inputCostPer1M: 0,
            outputCostPer1M: 0,
        },
    });

    // Watch the llmProvider value to fetch models when it changes
    const selectedProvider = watch("llmProvider");

    // Function to fetch models from Helicone API
    const fetchModelsForProvider = async (provider: string) => {
        if (!provider) return;

        setIsLoadingModels(true);
        setModelError(null);

        try {
            const response = await fetch(`https://www.helicone.ai/api/llm-costs?provider=${provider.toLowerCase()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
            }

            const data: HeliconeCostResponse = await response.json();

            // Filter models to only include those that are shown in playground for better selection
            const filteredModels = data.data
                .filter(model => model.show_in_playground === true || model.provider.toUpperCase() === provider.toUpperCase())
                .sort((a, b) => a.model.localeCompare(b.model));

            setAvailableModels(filteredModels);

            // Clear any previously selected model
            setValue("llmModel", "");
            setValue("inputCostPer1M", 0);
            setValue("outputCostPer1M", 0);
        } catch (error) {
            console.error("Error fetching models:", error);
            setModelError("Failed to load models. Please try again.");
            setAvailableModels([]);
        } finally {
            setIsLoadingModels(false);
        }
    };

    // Update models when provider changes
    useEffect(() => {
        if (selectedProvider) {
            fetchModelsForProvider(selectedProvider);
        } else {
            setAvailableModels([]);
            setValue("llmModel", "");
            setValue("inputCostPer1M", 0);
            setValue("outputCostPer1M", 0);
        }
    }, [selectedProvider, setValue]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setCardJsonContent(null);
            setCardJsonValid(null);
            setCardJsonError(null);
            return;
        }

        // Ensure it's a JSON file
        if (file.type !== "application/json" && !file.name.endsWith('.json')) {
            setCardJsonError("Please upload a valid JSON file");
            setCardJsonValid(false);
            setCardJsonContent(null);
            return;
        }

        // Read and parse the JSON file
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                // Parse and validate against our schema
                const jsonData = JSON.parse(content);

                // Use Zod to validate the card structure
                const result = agentCardSchema.safeParse(jsonData);

                if (result.success) {
                    setCardJsonContent(content);
                    setCardJsonValid(true);
                    setCardJsonError(null);
                } else {
                    // Format Zod error messages
                    const formattedErrors = result.error.issues.map(err =>
                        `${err.path.join('.')}: ${err.message}`
                    ).join('; ');

                    setCardJsonError(`Invalid agent card format: ${formattedErrors}`);
                    setCardJsonValid(false);
                    setCardJsonContent(content); // Still show the content for reference
                }
            } catch (error) {
                setCardJsonError("Invalid JSON format");
                setCardJsonValid(false);
                setCardJsonContent(null);
            }
        };
        reader.readAsText(file);
    };

    // Handle the generated JSON from the dialog
    const handleGeneratedJson = (jsonContent: string, jsonFile: File) => {
        // Set the JSON content and validity
        setCardJsonContent(jsonContent);
        setCardJsonValid(true);
        setCardJsonError(null);

        // Close the dialog
        setIsGeneratorOpen(false);

        try {
            // Create a DataTransfer object to simulate a file upload
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(jsonFile);

            // Update the file input with the generated file
            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
            }
        } catch (error) {
            // DataTransfer might not be available in some browsers
            console.error("Couldn't set file input value:", error);
            // We still have the JSON content, so the form will work
        }
    };

    const onSubmit = async (data: AgentFormValues) => {
        // Make sure we have valid JSON
        if (!cardJsonContent || !cardJsonValid) {
            setCardJsonError("Valid agent card.json is required");
            return;
        }

        try {
            // Combine form data and parsed JSON
            const agentData = {
                ...data,
                agentCard: JSON.parse(cardJsonContent),
            };

            console.log("Submitting agent data:", agentData);

            // Here you would typically send this data to your API
            // await fetch('/api/agents', { method: 'POST', body: JSON.stringify(agentData) });

            toast.success("Agent added successfully!");
            reset();
            setCardJsonContent(null);
            setCardJsonValid(null);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Add New Agent</h1>
                <p className="text-muted-foreground mb-4">
                    Complete the form below to add a new agent to the marketplace.
                </p>

                <div className="bg-secondary/5 border border-secondary/10 rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        What is an Agent Card?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        An Agent Card is a JSON metadata document that describes your agent&apos;s capabilities and interface.
                        It includes details about identity, endpoints, authentication, supported features, and response schema.
                        This standard format allows clients to discover and interact with your agent securely.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Agent Name */}
                <div className="space-y-2">
                    <label htmlFor="agentName" className="text-sm font-medium block">
                        Agent Name
                    </label>
                    <input
                        id="agentName"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md ${errors.agentName ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="e.g. Document Assistant"
                        {...register("agentName")}
                    />
                    {errors.agentName && (
                        <p className="text-sm text-red-500 mt-1">{errors.agentName.message}</p>
                    )}
                </div>

                {/* Agent Description */}
                <div className="space-y-2">
                    <label htmlFor="agentDescription" className="text-sm font-medium block">
                        Agent Description
                    </label>
                    <textarea
                        id="agentDescription"
                        className={`w-full px-4 py-2 border rounded-md ${errors.agentDescription ? "border-red-500" : "border-border/30"
                            } bg-background min-h-[120px]`}
                        placeholder="Describe what this agent does and how it can help users"
                        {...register("agentDescription")}
                    />
                    {errors.agentDescription && (
                        <p className="text-sm text-red-500 mt-1">{errors.agentDescription.message}</p>
                    )}
                </div>

                {/* LLM Provider */}
                <div className="space-y-2">
                    <label htmlFor="llmProvider" className="text-sm font-medium block">
                        LLM Provider
                    </label>
                    <select
                        id="llmProvider"
                        className={`w-full px-4 py-2 border rounded-md ${errors.llmProvider ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        {...register("llmProvider")}
                    >
                        <option value="">Select LLM Provider</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Anthropic">Anthropic</option>
                        <option value="Llama">Llama</option>
                        <option value="Google">Gemini</option>
                        <option value="Custom">Custom</option>
                    </select>
                    {errors.llmProvider && (
                        <p className="text-sm text-red-500 mt-1">{errors.llmProvider.message}</p>
                    )}
                </div>

                {/* LLM Model */}
                <div className="space-y-2">
                    <label htmlFor="llmModel" className="text-sm font-medium block">
                        LLM Model
                    </label>
                    <select
                        id="llmModel"
                        className={`w-full px-4 py-2 border rounded-md ${errors.llmModel ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        {...register("llmModel")}
                        disabled={!selectedProvider || isLoadingModels}
                        onChange={(e) => {
                            const selectedModel = availableModels.find(model => model.model === e.target.value);
                            if (selectedModel) {
                                setValue("inputCostPer1M", selectedModel.input_cost_per_1m);
                                setValue("outputCostPer1M", selectedModel.output_cost_per_1m);
                            } else {
                                setValue("inputCostPer1M", 0);
                                setValue("outputCostPer1M", 0);
                            }
                        }}
                    >
                        <option value="">Select LLM Model</option>
                        {availableModels.map((model) => (
                            <option key={model.model} value={model.model}>
                                {model.model}
                            </option>
                        ))}
                    </select>
                    {isLoadingModels && (
                        <p className="text-sm text-muted-foreground mt-1">Loading models...</p>
                    )}
                    {modelError && (
                        <p className="text-sm text-red-500 mt-1">{modelError}</p>
                    )}
                    {errors.llmModel && (
                        <p className="text-sm text-red-500 mt-1">{errors.llmModel.message}</p>
                    )}
                    {watch("llmModel") && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            <p>Input cost: ${watch("inputCostPer1M")!.toFixed(6)} per million tokens</p>
                            <p>Output cost: ${watch("outputCostPer1M")!.toFixed(6)} per million tokens</p>
                        </div>
                    )}
                </div>

                {/* Cost Per Token */}
                <div className="space-y-2">
                    <label htmlFor="costPerToken" className="text-sm font-medium block">
                        Cost Per Token (ETH)
                    </label>
                    <input
                        id="costPerToken"
                        type="number"
                        step="0.0001"
                        className={`w-full px-4 py-2 border rounded-md ${errors.costPerToken ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="0.0005"
                        {...register("costPerToken")}
                    />
                    {errors.costPerToken && (
                        <p className="text-sm text-red-500 mt-1">{errors.costPerToken.message}</p>
                    )}
                </div>

                {/* Agent Card JSON Upload */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor="cardJson" className="text-sm font-medium block">
                            Agent Card JSON
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsGeneratorOpen(true)}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                                Generate JSON
                            </button>
                            <a
                                href="/sample-agent-card.json"
                                download
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Sample
                            </a>
                        </div>
                    </div>
                    <div className={`border ${cardJsonValid === false ? "border-red-500" : cardJsonValid ? "border-green-500" : "border-border/30"} rounded-md p-4 bg-background`}>
                        <input
                            id="cardJson"
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileChange}
                            className="w-full"
                            ref={fileInputRef}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Upload the agent card.json file containing metadata, endpoints, and authentication details
                        </p>
                    </div>
                    {cardJsonError && (
                        <p className="text-sm text-red-500 mt-1">{cardJsonError}</p>
                    )}
                    {cardJsonValid && (
                        <p className="text-sm text-green-500 mt-1">JSON format validated</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        The agent card describes your agent&apos;s identity, service endpoints, supported features,
                        authentication requirements, and response schema. Clients use this to discover and interact with your agent.
                    </p>
                </div>

                {/* Agent Card Generator Dialog */}
                <AgentCardGenerator
                    isOpen={isGeneratorOpen}
                    onClose={() => setIsGeneratorOpen(false)}
                    onGenerate={handleGeneratedJson}
                />

                {/* JSON Preview */}
                {cardJsonContent && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Card JSON Preview</h3>
                        <div className="bg-secondary/10 rounded-md p-4 max-h-[200px] overflow-auto">
                            <pre className="text-xs whitespace-pre-wrap">{cardJsonContent}</pre>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !cardJsonValid}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Adding..." : "Add Agent"}
                    </button>
                </div>
            </form>
        </div>
    );
}