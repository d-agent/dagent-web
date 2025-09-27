"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLLM } from "@/hooks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Define the schema for the agent card generator form
const agentCardGeneratorSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    version: z.string().min(1, "Version is required"),
    llmProvider: z.string().min(1, "LLM Provider is required"),
    llmModel: z.string().min(1, "LLM Model is required"),
    costPerToken: z.coerce.number().positive("Cost per token must be positive"),
    inputCostPer1M: z.coerce.number().nonnegative().optional(),
    outputCostPer1M: z.coerce.number().nonnegative().optional(),
    endpoint1Url: z.string().url("Must be a valid URL"),
    endpoint1Type: z.string().min(1, "Endpoint type is required"),
    endpoint2Url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    endpoint2Type: z.string().optional().or(z.literal("")),
    authType: z.string().min(1, "Authentication type is required"),
    authFlow: z.string().optional().or(z.literal("")),
    streamingSupport: z.boolean().default(false),
    supportsStreaming: z.boolean().default(false),
    supportsMultiAgent: z.boolean().default(false),
    maxTotalAgentCost: z.coerce.number().nonnegative().optional(),
    pushNotifications: z.boolean().default(false),
    fileUploadSupport: z.boolean().default(false),
    skills: z.string().optional(),
    defaultInputMethod: z.string().min(1, "Default input method is required"),
    supportedInputMethods: z.string().min(1, "Supported input methods are required"),
});

type AgentCardGeneratorValues = z.infer<typeof agentCardGeneratorSchema>;

interface AgentCardGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (jsonContent: string, jsonFile: File) => void;
}

export function AgentCardGenerator({
    isOpen,
    onClose,
    onGenerate,
}: AgentCardGeneratorProps) {
    const [generatedJson, setGeneratedJson] = useState<string | null>(null);

    // Use LLM hook for provider and model management
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
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<AgentCardGeneratorValues>({
        resolver: zodResolver(agentCardGeneratorSchema) as any, // Type casting to avoid TypeScript errors
        defaultValues: {
            version: "1.0.0",
            llmProvider: "",
            llmModel: "",
            costPerToken: 0.0005,
            inputCostPer1M: 0,
            outputCostPer1M: 0,
            streamingSupport: true,
            supportsStreaming: true,
            supportsMultiAgent: false,
            maxTotalAgentCost: 1.0,
            pushNotifications: false,
            fileUploadSupport: false,
            defaultInputMethod: "text",
            supportedInputMethods: "text,file",
            authType: "oauth2",
            authFlow: "client_credentials",
        },
    });

    // Watch the current form values
    const currentInputCost = watch("inputCostPer1M");
    const currentOutputCost = watch("outputCostPer1M");

    const generateCardJson = (data: AgentCardGeneratorValues) => {
        // Parse skills from comma-separated string to array
        const skillsArray = data.skills
            ? data.skills.split(",").map((skill) => skill.trim())
            : [];

        // Parse supported input methods
        const supportedInputArray = data.supportedInputMethods
            .split(",")
            .map((method) => method.trim());

        // Create endpoints array
        const endpoints = [
            {
                url: data.endpoint1Url,
                type: data.endpoint1Type,
            },
        ];

        // Add second endpoint if provided
        if (data.endpoint2Url && data.endpoint2Type) {
            endpoints.push({
                url: data.endpoint2Url,
                type: data.endpoint2Type,
            });
        }

        // Build the agent card object
        const agentCard = {
            name: data.name,
            description: data.description,
            version: data.version,
            llmProvider: data.llmProvider,
            llmModel: data.llmModel,
            costPerToken: data.costPerToken,
            inputCostPer1M: data.inputCostPer1M,
            outputCostPer1M: data.outputCostPer1M,
            skills: skillsArray,
            supportsStreaming: data.supportsStreaming,
            supportsMultiAgent: data.supportsMultiAgent,
            maxTotalAgentCost: data.maxTotalAgentCost,
            endpoints,
            authentication: {
                type: data.authType,
                ...(data.authFlow && { flow: data.authFlow }),
            },
            features: {
                streaming: data.streamingSupport,
                push_notifications: data.pushNotifications,
                file_upload: data.fileUploadSupport,
            },
            input_methods: {
                default: data.defaultInputMethod,
                supported: supportedInputArray,
            },
            output_schema: {
                type: "object",
                properties: {
                    result: { type: "string" },
                    confidence: { type: "number" },
                    extracted_data: { type: "object" },
                },
            },
        };

        // Convert to pretty JSON
        const jsonContent = JSON.stringify(agentCard, null, 2);
        setGeneratedJson(jsonContent);

        // Create a file object for the JSON
        const jsonBlob = new Blob([jsonContent], { type: "application/json" });
        const fileName = `${data.name.toLowerCase().replace(/\s+/g, "-")}-agent-card.json`;
        const jsonFile = new File([jsonBlob], fileName, {
            type: "application/json",
        });

        // Call the callback with generated JSON
        onGenerate(jsonContent, jsonFile);

        // Close the dialog
        reset();
    };

    const handleClose = () => {
        reset();
        setGeneratedJson(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="min-w-[80vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Generate Agent Card JSON</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to generate an agent card JSON file.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(generateCardJson as any)} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Basic Information</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Agent Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    placeholder="e.g. Document Assistant"
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="version" className="text-sm font-medium">
                                    Version
                                </label>
                                <input
                                    id="version"
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.version ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    placeholder="e.g. 1.0.0"
                                    {...register("version")}
                                />
                                {errors.version && (
                                    <p className="text-xs text-red-500">{errors.version.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className={`w-full px-3 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-border/30"
                                    } bg-background min-h-[80px]`}
                                placeholder="Describe what your agent does"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">LLM Configuration</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="llmProvider" className="text-sm font-medium">
                                    LLM Provider
                                </label>
                                <select
                                    id="llmProvider"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.llmProvider ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    {...register("llmProvider")}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setValue("llmProvider", value);
                                        setProvider(value);
                                        clearError();
                                        // Reset model and costs when provider changes
                                        setValue("llmModel", "");
                                        setValue("inputCostPer1M", 0);
                                        setValue("outputCostPer1M", 0);
                                    }}
                                >
                                    <option value="">Select Provider</option>
                                    {providers.map((provider) => (
                                        <option key={provider.value} value={provider.value}>
                                            {provider.displayName}
                                        </option>
                                    ))}
                                </select>
                                {errors.llmProvider && (
                                    <p className="text-xs text-red-500">{errors.llmProvider.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="llmModel" className="text-sm font-medium">
                                    LLM Model
                                </label>
                                <select
                                    id="llmModel"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.llmModel ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    {...register("llmModel")}
                                    disabled={!selectedProvider || isLoadingModels || selectedProvider === 'Custom'}
                                    onChange={(e) => {
                                        const modelName = e.target.value;
                                        setValue("llmModel", modelName);
                                        setModel(modelName);

                                        const selectedModelData = availableModels.find(model => model.model === modelName);
                                        if (selectedModelData) {
                                            // Auto-fill cost data from API
                                            setValue("inputCostPer1M", selectedModelData.input_cost_per_1m);
                                            setValue("outputCostPer1M", selectedModelData.output_cost_per_1m);

                                            // Calculate cost per token (using the higher of input/output cost as base)
                                            const costPerToken = Math.max(selectedModelData.input_cost_per_1m, selectedModelData.output_cost_per_1m) / 1000000;
                                            setValue("costPerToken", Number(costPerToken.toFixed(8)));
                                        } else {
                                            // Reset costs if no model selected
                                            setValue("inputCostPer1M", 0);
                                            setValue("outputCostPer1M", 0);
                                        }
                                    }}
                                >
                                    <option value="">Select Model</option>
                                    {availableModels.map((model) => (
                                        <option key={model.model} value={model.model}>
                                            {model.model}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingModels && (
                                    <p className="text-xs text-muted-foreground mt-1">Loading models...</p>
                                )}
                                {modelError && (
                                    <p className="text-xs text-red-500 mt-1">{modelError}</p>
                                )}
                                {selectedProvider === 'Custom' && (
                                    <p className="text-xs text-muted-foreground mt-1">Enter custom model name manually after generation</p>
                                )}
                                {selectedModel && (
                                    <div className="mt-2 p-2 bg-secondary/10 rounded text-xs">
                                        <p className="font-medium">Model Costs (per 1M tokens):</p>
                                        <p>Input: ${selectedModel.input_cost_per_1m.toFixed(6)}</p>
                                        <p>Output: ${selectedModel.output_cost_per_1m.toFixed(6)}</p>
                                        {selectedModel.prompt_cache_read_per_1m && (
                                            <p>Cached: ${selectedModel.prompt_cache_read_per_1m.toFixed(6)}</p>
                                        )}
                                    </div>
                                )}
                                {errors.llmModel && (
                                    <p className="text-xs text-red-500">{errors.llmModel.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="costPerToken" className="text-sm font-medium">
                                    Cost Per Token (ETH)
                                </label>
                                <input
                                    id="costPerToken"
                                    type="number"
                                    step="0.0001"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.costPerToken ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    placeholder="0.0005"
                                    {...register("costPerToken")}
                                />
                                {errors.costPerToken && (
                                    <p className="text-xs text-red-500">{errors.costPerToken.message}</p>
                                )}
                                {selectedModel && currentInputCost != null && currentOutputCost != null && (currentInputCost > 0 || currentOutputCost > 0) && (
                                    <p className="text-xs text-muted-foreground">
                                        Auto-calculated from model's higher cost (Input: ${currentInputCost.toFixed(6)}, Output: ${currentOutputCost.toFixed(6)})
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="inputCostPer1M" className="text-sm font-medium">
                                    Input Cost per 1M (From API)
                                </label>
                                <input
                                    id="inputCostPer1M"
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-border/30 rounded-md bg-muted cursor-not-allowed"
                                    placeholder="0"
                                    disabled
                                    {...register("inputCostPer1M")}
                                />
                                {selectedModel && currentInputCost != null && currentInputCost > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        ${currentInputCost.toFixed(6)} per 1M tokens
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="outputCostPer1M" className="text-sm font-medium">
                                    Output Cost per 1M (From API)
                                </label>
                                <input
                                    id="outputCostPer1M"
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-border/30 rounded-md bg-muted cursor-not-allowed"
                                    placeholder="0"
                                    disabled
                                    {...register("outputCostPer1M")}
                                />
                                {selectedModel && currentOutputCost != null && currentOutputCost > 0 && (
                                    <p className="text-xs text-muted-foreground">
                                        ${currentOutputCost.toFixed(6)} per 1M tokens
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Endpoints</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="endpoint1Url" className="text-sm font-medium">
                                        Primary Endpoint URL
                                    </label>
                                    <input
                                        id="endpoint1Url"
                                        type="text"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.endpoint1Url ? "border-red-500" : "border-border/30"
                                            } bg-background`}
                                        placeholder="https://api.example.com/agent/endpoint"
                                        {...register("endpoint1Url")}
                                    />
                                    {errors.endpoint1Url && (
                                        <p className="text-xs text-red-500">{errors.endpoint1Url.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="endpoint1Type" className="text-sm font-medium">
                                        Primary Endpoint Type
                                    </label>
                                    <input
                                        id="endpoint1Type"
                                        type="text"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.endpoint1Type ? "border-red-500" : "border-border/30"
                                            } bg-background`}
                                        placeholder="e.g. chat"
                                        {...register("endpoint1Type")}
                                    />
                                    {errors.endpoint1Type && (
                                        <p className="text-xs text-red-500">{errors.endpoint1Type.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="endpoint2Url" className="text-sm font-medium">
                                        Secondary Endpoint URL (Optional)
                                    </label>
                                    <input
                                        id="endpoint2Url"
                                        type="text"
                                        className="w-full px-3 py-2 border border-border/30 rounded-md bg-background"
                                        placeholder="https://api.example.com/agent/endpoint2"
                                        {...register("endpoint2Url")}
                                    />
                                    {errors.endpoint2Url && (
                                        <p className="text-xs text-red-500">{errors.endpoint2Url.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="endpoint2Type" className="text-sm font-medium">
                                        Secondary Endpoint Type (Optional)
                                    </label>
                                    <input
                                        id="endpoint2Type"
                                        type="text"
                                        className="w-full px-3 py-2 border border-border/30 rounded-md bg-background"
                                        placeholder="e.g. analyze"
                                        {...register("endpoint2Type")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Authentication</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="authType" className="text-sm font-medium">
                                    Authentication Type
                                </label>
                                <select
                                    id="authType"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.authType ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    {...register("authType")}
                                >
                                    <option value="oauth2">OAuth 2.0</option>
                                    <option value="api_key">API Key</option>
                                    <option value="bearer">Bearer Token</option>
                                    <option value="basic">Basic Auth</option>
                                    <option value="none">None</option>
                                </select>
                                {errors.authType && (
                                    <p className="text-xs text-red-500">{errors.authType.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="authFlow" className="text-sm font-medium">
                                    Authentication Flow (Optional)
                                </label>
                                <input
                                    id="authFlow"
                                    type="text"
                                    className="w-full px-3 py-2 border border-border/30 rounded-md bg-background"
                                    placeholder="e.g. client_credentials"
                                    {...register("authFlow")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Features & Capabilities</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("streamingSupport")}
                                />
                                <span className="text-sm">Legacy Streaming Support</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("supportsStreaming")}
                                />
                                <span className="text-sm">Supports Streaming</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("supportsMultiAgent")}
                                />
                                <span className="text-sm">Multi-Agent System</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("pushNotifications")}
                                />
                                <span className="text-sm">Push Notifications</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("fileUploadSupport")}
                                />
                                <span className="text-sm">File Upload Support</span>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="maxTotalAgentCost" className="text-sm font-medium">
                                Max Total Agent Cost (Optional)
                            </label>
                            <input
                                id="maxTotalAgentCost"
                                type="number"
                                step="0.01"
                                className="w-full px-3 py-2 border border-border/30 rounded-md bg-background"
                                placeholder="1.0"
                                {...register("maxTotalAgentCost")}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="skills" className="text-sm font-medium">
                                Skills (comma-separated)
                            </label>
                            <input
                                id="skills"
                                type="text"
                                className="w-full px-3 py-2 border border-border/30 rounded-md bg-background"
                                placeholder="e.g. document_analysis, text_extraction, summarization"
                                {...register("skills")}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="defaultInputMethod" className="text-sm font-medium">
                                    Default Input Method
                                </label>
                                <input
                                    id="defaultInputMethod"
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.defaultInputMethod ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    placeholder="e.g. text"
                                    {...register("defaultInputMethod")}
                                />
                                {errors.defaultInputMethod && (
                                    <p className="text-xs text-red-500">{errors.defaultInputMethod.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="supportedInputMethods" className="text-sm font-medium">
                                    Supported Input Methods (comma-separated)
                                </label>
                                <input
                                    id="supportedInputMethods"
                                    type="text"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.supportedInputMethods ? "border-red-500" : "border-border/30"
                                        } bg-background`}
                                    placeholder="e.g. text, file"
                                    {...register("supportedInputMethods")}
                                />
                                {errors.supportedInputMethods && (
                                    <p className="text-xs text-red-500">{errors.supportedInputMethods.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-border/30 rounded-md text-sm font-medium transition-colors hover:bg-secondary/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium transition-colors hover:bg-primary/90"
                        >
                            Generate JSON
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}