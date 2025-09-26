"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
    endpoint1Url: z.string().url("Must be a valid URL"),
    endpoint1Type: z.string().min(1, "Endpoint type is required"),
    endpoint2Url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    endpoint2Type: z.string().optional().or(z.literal("")),
    authType: z.string().min(1, "Authentication type is required"),
    authFlow: z.string().optional().or(z.literal("")),
    streamingSupport: z.boolean().default(false),
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AgentCardGeneratorValues>({
        resolver: zodResolver(agentCardGeneratorSchema) as any, // Type casting to avoid TypeScript errors
        defaultValues: {
            version: "1.0.0",
            streamingSupport: true,
            pushNotifications: false,
            fileUploadSupport: false,
            defaultInputMethod: "text",
            supportedInputMethods: "text,file",
            authType: "oauth2",
            authFlow: "client_credentials",
        },
    });

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
            skills: skillsArray,
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
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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

                        <div className="grid grid-cols-3 gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-border/30"
                                    {...register("streamingSupport")}
                                />
                                <span className="text-sm">Streaming Support</span>
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