"use client";

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useLLM } from '@/hooks/useLLM';
import { useCreateAgent } from '@/hooks/agent';

export default function AddAgentPage() {
    const [cardJsonContent, setCardJsonContent] = useState<string | null>(null);
    const [cardJsonValid, setCardJsonValid] = useState<boolean | null>(null);
    const [cardJsonError, setCardJsonError] = useState<string | null>(null);
    const mutation= useCreateAgent()

// State for the agent card generator dialog
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

    // Reference to the file input element
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Use LLM hook for provider and model management

    const {mutateAsync: CreateAgentMutation } = useCreateAgent();

    const {
        providers,
        models: availableModels,
        selectedProvider,
        selectedModel,
        isLoadingModels,
        error: modelError,
        setProvider,
        setModel,
        clearError,
    } = useLLM({ autoFetchOnProviderChange: true });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            agentCost: "",
            deployedUrl: "",
            llmProvider: "",
            llmModel: "",
            inputCostPer1M: 0,
            outputCostPer1M: 0,
            skills: "",
            is_multiAgentSystem: "false",
            default_agent_name: "",
            framework_used: "",
            can_stream: "false",
        },
    });



    const onSubmit = async (data: any) => {
        try {
            // Convert skills string to array
            const formattedData = {
                ...data,
                skills: data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean),
                is_multiAgentSystem: data.is_multiAgentSystem === "true",
                can_stream: data.can_stream === "true",
                agentCost: data.agentCost,
                inputCostPer1M: Number(data.inputCostPer1M),
                outputCostPer1M: Number(data.outputCostPer1M),
                // Clear default_agent_name if not multi-agent system
                default_agent_name: data.is_multiAgentSystem === "true" ? data.default_agent_name : "",
            };

            console.log("Submitting agent data:", formattedData);
            await CreateAgentMutation(formattedData);
            // Here you would typically send this data to your API
            // await fetch('/api/agents', { method: 'POST', body: JSON.stringify(formattedData) });

            toast.success("Agent added successfully!");
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to add agent. Please try again.");
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
                    <label htmlFor="name" className="text-sm font-medium block">
                        Agent Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="e.g. Document Assistant"
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Agent Description */}
                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium block">
                        Agent Description
                    </label>
                    <textarea
                        id="description"
                        className={`w-full px-4 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-border/30"
                            } bg-background min-h-[120px]`}
                        placeholder="Describe what this agent does and how it can help users"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Agent Cost */}
                <div className="space-y-2">
                    <label htmlFor="agentCost" className="text-sm font-medium block">
                        Agent Cost (ETH)
                    </label>
                    <input
                        id="agentCost"
                        type="number"
                        step="0.0001"
                        className={`w-full px-4 py-2 border rounded-md ${errors.agentCost ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="0.0005"
                        {...register("agentCost")}
                    />
                    {errors.agentCost && (
                        <p className="text-sm text-red-500 mt-1">{errors.agentCost.message}</p>
                    )}
                </div>

                {/* Deployed URL */}
                <div className="space-y-2">
                    <label htmlFor="deployedUrl" className="text-sm font-medium block">
                        Deployed URL
                    </label>
                    <input
                        id="deployedUrl"
                        type="url"
                        className={`w-full px-4 py-2 border rounded-md ${errors.deployedUrl ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="https://your-agent.example.com"
                        {...register("deployedUrl")}
                    />
                    {errors.deployedUrl && (
                        <p className="text-sm text-red-500 mt-1">{errors.deployedUrl.message}</p>
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
                        onChange={(e) => {
                            const value = e.target.value;
                            setValue("llmProvider", value);
                            setProvider(value);
                            setValue("llmModel", "");
                            setValue("inputCostPer1M", 0);
                            setValue("outputCostPer1M", 0);
                            clearError();
                        }}
                    >
                        <option value="">Select LLM Provider</option>
                        {providers.map((provider) => (
                            <option key={provider.value} value={provider.value}>
                                {provider.displayName}
                            </option>
                        ))}
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
                            const modelName = e.target.value;
                            setValue("llmModel", modelName);
                            setModel(modelName);

                            const selectedModelData = availableModels.find(model => model.model === modelName);
                            if (selectedModelData) {
                                setValue("inputCostPer1M", selectedModelData.input_cost_per_1m);
                                setValue("outputCostPer1M", selectedModelData.output_cost_per_1m);
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

                {/* API Cost Data (Read-only) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="inputCostPer1M" className="text-sm font-medium block">
                            Input Cost per 1M (From API)
                        </label>
                        <input
                            id="inputCostPer1M"
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2 border border-border/30 rounded-md bg-muted cursor-not-allowed"
                            disabled
                            {...register("inputCostPer1M")}
                        />
                        {watch("inputCostPer1M") != null && watch("inputCostPer1M")! > 0 && (
                            <p className="text-sm text-muted-foreground">
                                ${watch("inputCostPer1M")!.toFixed(6)} per million tokens
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="outputCostPer1M" className="text-sm font-medium block">
                            Output Cost per 1M (From API)
                        </label>
                        <input
                            id="outputCostPer1M"
                            type="number"
                            step="0.01"
                            className="w-full px-4 py-2 border border-border/30 rounded-md bg-muted cursor-not-allowed"
                            disabled
                            {...register("outputCostPer1M")}
                        />
                        {watch("outputCostPer1M") != null && watch("outputCostPer1M")! > 0 && (
                            <p className="text-sm text-muted-foreground">
                                ${watch("outputCostPer1M")!.toFixed(6)} per million tokens
                            </p>
                        )}
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                    <label htmlFor="skills" className="text-sm font-medium block">
                        Skills (comma-separated)
                    </label>
                    <input
                        id="skills"
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md ${errors.skills ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        placeholder="e.g. Trading, Market Analysis, Risk Management"
                        {...register("skills")}
                    />
                    {errors.skills && (
                        <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
                    )}
                </div>

                {/* Multi-Agent System Toggle */}
                <div className="space-y-2">
                    <label className="text-sm font-medium block">
                        Is Multi-Agent System?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="true"
                                {...register("is_multiAgentSystem")}
                                className="w-4 h-4"
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="false"
                                {...register("is_multiAgentSystem")}
                                className="w-4 h-4"
                            />
                            <span>No</span>
                        </label>
                    </div>
                    {errors.is_multiAgentSystem && (
                        <p className="text-sm text-red-500 mt-1">{errors.is_multiAgentSystem.message}</p>
                    )}
                </div>

                {/* Default Agent Name - only show if multi-agent system is true */}
                {watch("is_multiAgentSystem") === "true" && (
                    <div className="space-y-2">
                        <label htmlFor="default_agent_name" className="text-sm font-medium block">
                            Default Agent Name
                        </label>
                        <input
                            id="default_agent_name"
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md ${errors.default_agent_name ? "border-red-500" : "border-border/30"
                                } bg-background`}
                            placeholder="e.g. Main Coordinator Agent"
                            {...register("default_agent_name")}
                        />
                        {errors.default_agent_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.default_agent_name.message}</p>
                        )}
                    </div>
                )}

                {/* Framework Used */}
                <div className="space-y-2">
                    <label htmlFor="framework_used" className="text-sm font-medium block">
                        Framework Used
                    </label>
                    <select
                        id="framework_used"
                        className={`w-full px-4 py-2 border rounded-md ${errors.framework_used ? "border-red-500" : "border-border/30"
                            } bg-background`}
                        {...register("framework_used")}
                    >
                        <option value="">Select Framework</option>
                        <option value="langgraph">LangGraph</option>
                        <option value="langchain">LangChain</option>
                        <option value="autogen">AutoGen</option>
                        <option value="crewai">CrewAI</option>
                        <option value="custom">Custom</option>
                    </select>
                    {errors.framework_used && (
                        <p className="text-sm text-red-500 mt-1">{errors.framework_used.message}</p>
                    )}
                </div>

                {/* Can Stream Toggle */}
                <div className="space-y-2">
                    <label className="text-sm font-medium block">
                        Can Stream Responses?
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="true"
                                {...register("can_stream")}
                                className="w-4 h-4"
                            />
                            <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                value="false"
                                {...register("can_stream")}
                                className="w-4 h-4"
                            />
                            <span>No</span>
                        </label>
                    </div>
                    {errors.can_stream && (
                        <p className="text-sm text-red-500 mt-1">{errors.can_stream.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Adding..." : "Add Agent"}
                    </button>
                </div>
            </form>
        </div>
    );
}