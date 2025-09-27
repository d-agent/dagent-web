"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { IconRobot, IconStar, IconDownload, IconEye, IconGlobe, IconLock, IconCpu, IconBolt, IconShield, IconDatabase } from "@tabler/icons-react";

interface AgentCardData {
    id: string;
    title: string;
    description: string;
    category: string;
    version: string;
    llmProvider: string;
    llmModel: string;
    costPerToken: number;
    inputCostPer1M?: number;
    outputCostPer1M?: number;
    skills?: string[];
    supportsStreaming?: boolean;
    supportsMultiAgent?: boolean;
    maxTotalAgentCost?: number;
    isPublic: boolean;
    author: string;
    downloads: number;
    rating: number;
    totalRatings: number;
    lastUpdated: string;
    tags: string[];
    features?: Record<string, any>;
    ctaText: string;
    onRegister: () => void;
}

interface ExpandableAgentCardsProps {
    agents: AgentCardData[];
}

export function ExpandableAgentCards({ agents }: ExpandableAgentCardsProps) {
    const [active, setActive] = useState<AgentCardData | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref as React.RefObject<HTMLElement>, () => setActive(null));

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <IconStar
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
            />
        ));
    };

    const getAgentIcon = () => {
        return (
            <div className="w-full h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-t-3xl flex items-center justify-center relative overflow-hidden">
                {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,120,120,0.1),transparent_70%)]"></div> */}
                {/* <IconRobot size={64} className="text-primary/80 relative z-10" /> */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    {active?.isPublic ? (
                        <IconGlobe size={12} className="text-emerald-400" />
                    ) : (
                        <IconLock size={12} className="text-amber-400" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm h-full w-full z-10"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {active ? (
                    <div className="fixed inset-0 grid place-items-center z-[100] p-4">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.05 } }}
                            className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white/10 backdrop-blur-sm rounded-full h-8 w-8 z-50"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>

                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-7xl h-full md:h-fit md:max-h-[90%] flex flex-col bg-white/5 backdrop-blur-md border border-white/10 dark:bg-neutral-900/80 sm:rounded-3xl overflow-hidden"
                        >
                            <motion.div layoutId={`image-${active.title}-${id}`}>
                                {getAgentIcon()}
                            </motion.div>

                            <div className="flex-1 overflow-auto">
                                <div className="p-6 border-b border-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <motion.h3
                                                layoutId={`title-${active.title}-${id}`}
                                                className="text-2xl font-light text-white mb-2"
                                            >
                                                {active.title}
                                            </motion.h3>
                                            <motion.p
                                                layoutId={`description-${active.description}-${id}`}
                                                className="text-neutral-400 mb-3"
                                            >
                                                {active.description}
                                            </motion.p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(active.rating)}
                                                    <span className="text-white ml-1">{active.rating}</span>
                                                    <span className="text-neutral-400">({active.totalRatings})</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-neutral-400">
                                                    <IconDownload size={14} />
                                                    <span>{active.downloads.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <motion.button
                                            layoutId={`button-${active.title}-${id}`}
                                            onClick={active.onRegister}
                                            className="px-6 py-3 text-sm rounded-xl font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all"
                                        >
                                            {active.ctaText}
                                        </motion.button>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {active.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-white/10 text-neutral-300 text-sm rounded-full border border-white/20"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Technical Specs */}
                                        <div>
                                            <h4 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                                                <IconCpu size={18} className="text-primary" />
                                                Technical Specifications
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                    <div className="text-xs text-neutral-400 mb-1">LLM Provider</div>
                                                    <div className="text-white font-light">{active.llmProvider}</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                    <div className="text-xs text-neutral-400 mb-1">Model</div>
                                                    <div className="text-white font-light">{active.llmModel}</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                    <div className="text-xs text-neutral-400 mb-1">Cost per Token</div>
                                                    <div className="text-primary font-light">${active.costPerToken}</div>
                                                </div>
                                                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                    <div className="text-xs text-neutral-400 mb-1">Version</div>
                                                    <div className="text-white font-light">v{active.version}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        {active.skills && (
                                            <div>
                                                <h4 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                                                    <IconBolt size={18} className="text-primary" />
                                                    Core Skills
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {active.skills.map((skill) => (
                                                        <div key={skill} className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                                                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                            <span className="text-white font-light">{skill}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Features */}
                                        {active.features && (
                                            <div>
                                                <h4 className="text-lg font-light text-white mb-4 flex items-center gap-2">
                                                    <IconShield size={18} className="text-primary" />
                                                    Features & Capabilities
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {Object.entries(active.features).map(([feature, enabled]) => (
                                                        <div key={feature} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                                            <span className="text-white font-light">{feature}</span>
                                                            <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-4">
                                        {/* Author */}
                                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <h5 className="text-sm font-light text-white mb-2">Author</h5>
                                            <div className="text-xs text-neutral-400 font-mono break-all">{active.author}</div>
                                        </div>

                                        {/* Capabilities */}
                                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <h5 className="text-sm font-light text-white mb-3">Capabilities</h5>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-neutral-400">Streaming</span>
                                                    <div className={`w-2 h-2 rounded-full ${active.supportsStreaming ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-neutral-400">Multi-Agent</span>
                                                    <div className={`w-2 h-2 rounded-full ${active.supportsMultiAgent ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        {(active.inputCostPer1M || active.outputCostPer1M) && (
                                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                                <h5 className="text-sm font-light text-white mb-3">Pricing (per 1M tokens)</h5>
                                                <div className="space-y-2">
                                                    {active.inputCostPer1M && (
                                                        <div className="flex justify-between">
                                                            <span className="text-xs text-neutral-400">Input</span>
                                                            <span className="text-xs text-white">${active.inputCostPer1M}</span>
                                                        </div>
                                                    )}
                                                    {active.outputCostPer1M && (
                                                        <div className="flex justify-between">
                                                            <span className="text-xs text-neutral-400">Output</span>
                                                            <span className="text-xs text-white">${active.outputCostPer1M}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Meta Info */}
                                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <h5 className="text-sm font-light text-white mb-3">Details</h5>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-neutral-400">Category</span>
                                                    <span className="text-xs text-white">{active.category}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-xs text-neutral-400">Updated</span>
                                                    <span className="text-xs text-white">{active.lastUpdated}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto w-full space-y-3">
                {agents.map((agent) => (
                    <motion.div
                        layoutId={`card-${agent.title}-${id}`}
                        key={`card-${agent.title}-${id}`}
                        onClick={() => setActive(agent)}
                        className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl cursor-pointer backdrop-blur-sm transition-all duration-300"
                    >
                        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
                            {/* <motion.div layoutId={`image-${agent.title}-${id}`}> */}
                            {/* <div className="h-24 w-24 md:h-16 md:w-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                                    <IconRobot size={20} className="text-primary" />
                                </div> */}
                            {/* </motion.div> */}

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <motion.h3
                                        layoutId={`title-${agent.title}-${id}`}
                                        className="font-medium text-white text-center md:text-left"
                                    >
                                        {agent.title}
                                    </motion.h3>
                                </div>

                                <motion.p
                                    layoutId={`description-${agent.description}-${id}`}
                                    className="text-neutral-400 text-sm text-center md:text-left mb-2 line-clamp-2"
                                >
                                    {agent.description}
                                </motion.p>

                                {/* <div className="flex items-center gap-4 text-xs text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        {renderStars(agent.rating)}
                                        <span className="ml-1">{agent.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IconDownload size={12} />
                                        <span>{agent.downloads.toLocaleString()}</span>
                                    </div>
                                    <span className="text-primary">${agent.costPerToken}/token</span>
                                </div> */}
                            </div>
                        </div>

                        <motion.button
                            layoutId={`button-${agent.title}-${id}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                agent.onRegister();
                            }}
                            className="px-4 py-2 text-sm rounded-lg font-medium bg-white/10 hover:bg-primary/20 hover:text-primary text-white mt-4 md:mt-0 border border-white/20 hover:border-primary/30 transition-all whitespace-nowrap"
                        >
                            {agent.ctaText}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.05 } }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-white"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};