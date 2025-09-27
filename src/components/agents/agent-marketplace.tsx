"use client";

import React, { useState } from 'react';
import { IconRobot, IconClock, IconEye, IconHeart, IconStar, IconShield, IconGlobe, IconLock, IconCpu, IconDatabase, IconBolt, IconDownload } from '@tabler/icons-react';
import { AgentRegistrationModal } from './agent-registration-modal';
import { ExpandableAgentCards } from './expandable-agent-cards';

interface AgentInfo {
    id: string;
    name: string;
    description: string;
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
    category: 'Trading' | 'Analytics' | 'Data Collection' | 'Investment' | 'AI Assistant' | 'Automation';
    tags: string[];
    features?: Record<string, any>;
}

const sampleAgents: AgentInfo[] = [
    {
        id: '1',
        name: 'Advanced Trading Bot',
        description: 'Sophisticated algorithmic trading agent with machine learning capabilities for cryptocurrency and stock markets. Features real-time market analysis, risk management, and automated portfolio optimization.',
        version: '2.1.0',
        llmProvider: 'OpenAI',
        llmModel: 'gpt-4-turbo',
        costPerToken: 0.0012,
        inputCostPer1M: 10,
        outputCostPer1M: 30,
        skills: ['Trading', 'Market Analysis', 'Risk Management', 'Portfolio Optimization'],
        supportsStreaming: true,
        supportsMultiAgent: true,
        maxTotalAgentCost: 100,
        isPublic: true,
        author: '0x742d35cc6bf8ff94ec9a7921cd5dc4c4f6b9c6f1',
        downloads: 15420,
        rating: 4.8,
        totalRatings: 324,
        lastUpdated: '2 days ago',
        category: 'Trading',
        tags: ['crypto', 'stocks', 'ml', 'automated'],
        features: {
            'Real-time Analysis': true,
            'Multi-exchange Support': true,
            'Risk Management': true,
            'Backtesting': true
        }
    },
    {
        id: '2',
        name: 'Data Analytics Wizard',
        description: 'Comprehensive data analysis and visualization agent that processes complex datasets, generates insights, and creates beautiful charts and reports automatically.',
        version: '1.8.3',
        llmProvider: 'Anthropic',
        llmModel: 'claude-3-sonnet',
        costPerToken: 0.0008,
        inputCostPer1M: 3,
        outputCostPer1M: 15,
        skills: ['Data Analysis', 'Visualization', 'Statistical Modeling', 'Report Generation'],
        supportsStreaming: false,
        supportsMultiAgent: true,
        maxTotalAgentCost: 50,
        isPublic: true,
        author: '0xa8e3b7c9d2f1e6b8c4a7d3f9e2b5c8d1a6f4e7b2',
        downloads: 8750,
        rating: 4.6,
        totalRatings: 187,
        lastUpdated: '1 week ago',
        category: 'Analytics',
        tags: ['data', 'charts', 'insights', 'reports'],
        features: {
            'Multiple Data Sources': true,
            'Custom Visualizations': true,
            'Automated Reports': true,
            'Export Options': true
        }
    },
    {
        id: '3',
        name: 'Smart Content Generator',
        description: 'AI-powered content creation agent that generates high-quality articles, social media posts, marketing copy, and technical documentation with brand consistency.',
        version: '3.0.1',
        llmProvider: 'OpenAI',
        llmModel: 'gpt-4o',
        costPerToken: 0.0015,
        inputCostPer1M: 5,
        outputCostPer1M: 15,
        skills: ['Content Creation', 'Copywriting', 'SEO Optimization', 'Brand Voice'],
        supportsStreaming: true,
        supportsMultiAgent: false,
        maxTotalAgentCost: 75,
        isPublic: true,
        author: '0xb9f4c6e1d8a3b5c7f2e9a6d4b8c5f1e3a7b9c2d6',
        downloads: 12340,
        rating: 4.7,
        totalRatings: 298,
        lastUpdated: '3 days ago',
        category: 'AI Assistant',
        tags: ['content', 'writing', 'seo', 'marketing'],
        features: {
            'Multiple Formats': true,
            'SEO Optimization': true,
            'Brand Guidelines': true,
            'Bulk Generation': true
        }
    },
    {
        id: '4',
        name: 'DeFi Yield Optimizer',
        description: 'Decentralized finance optimization agent that automatically finds the best yield farming opportunities, manages liquidity positions, and rebalances portfolios.',
        version: '1.5.2',
        llmProvider: 'Google',
        llmModel: 'gemini-pro',
        costPerToken: 0.0006,
        inputCostPer1M: 0.5,
        outputCostPer1M: 1.5,
        skills: ['DeFi Protocols', 'Yield Farming', 'Liquidity Management', 'Risk Assessment'],
        supportsStreaming: true,
        supportsMultiAgent: true,
        maxTotalAgentCost: 200,
        isPublic: false,
        author: '0xc3d7e2f5a8b1c9e6d4f7a3b8c5e2f9a6d1b4c7e5',
        downloads: 3890,
        rating: 4.9,
        totalRatings: 67,
        lastUpdated: '5 days ago',
        category: 'Investment',
        tags: ['defi', 'yield', 'liquidity', 'ethereum'],
        features: {
            'Multi-protocol Support': true,
            'Auto-compounding': true,
            'Risk Analysis': true,
            'Gas Optimization': true
        }
    },
    {
        id: '5',
        name: 'News Sentiment Analyzer',
        description: 'Real-time news aggregation and sentiment analysis agent that monitors financial news, social media, and market events to provide trading signals.',
        version: '2.3.0',
        llmProvider: 'Llama',
        llmModel: 'llama-3-70b',
        costPerToken: 0.0004,
        inputCostPer1M: 0.6,
        outputCostPer1M: 0.6,
        skills: ['News Analysis', 'Sentiment Analysis', 'Signal Generation', 'Social Media Monitoring'],
        supportsStreaming: true,
        supportsMultiAgent: true,
        maxTotalAgentCost: 30,
        isPublic: true,
        author: '0xf1e8b3c6d9a2f5e7b4c1d8a5f2e9b6c3d7a4f1e8',
        downloads: 6780,
        rating: 4.4,
        totalRatings: 142,
        lastUpdated: '1 day ago',
        category: 'Data Collection',
        tags: ['news', 'sentiment', 'signals', 'social'],
        features: {
            'Multi-source Aggregation': true,
            'Real-time Processing': true,
            'Custom Filters': true,
            'Alert System': true
        }
    },
    {
        id: '6',
        name: 'Smart Contract Auditor',
        description: 'Automated smart contract security analysis agent that scans for vulnerabilities, gas optimization opportunities, and best practice violations.',
        version: '1.2.1',
        llmProvider: 'Custom',
        llmModel: 'security-specialized-model',
        costPerToken: 0.002,
        inputCostPer1M: 20,
        outputCostPer1M: 40,
        skills: ['Security Analysis', 'Code Review', 'Gas Optimization', 'Vulnerability Detection'],
        supportsStreaming: false,
        supportsMultiAgent: false,
        maxTotalAgentCost: 150,
        isPublic: true,
        author: '0xe2d5a8f1c4b7e3a6d9f2c5a8e1b4d7a3f6c9e2d5',
        downloads: 2340,
        rating: 4.9,
        totalRatings: 45,
        lastUpdated: '1 week ago',
        category: 'Automation',
        tags: ['security', 'audit', 'solidity', 'web3'],
        features: {
            'Vulnerability Scanning': true,
            'Gas Optimization': true,
            'Best Practices Check': true,
            'Detailed Reports': true
        }
    }
];

export const AgentMarketplace: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [agentToRegister, setAgentToRegister] = useState<AgentInfo | null>(null);

    const filteredAgents = sampleAgents.filter(agent => {
        const matchesVisibility = filter === 'all' ||
            (filter === 'public' && agent.isPublic) ||
            (filter === 'private' && !agent.isPublic);

        const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;

        const matchesSearch = searchQuery === '' ||
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesVisibility && matchesCategory && matchesSearch;
    });

    const categories = ['all', ...Array.from(new Set(sampleAgents.map(agent => agent.category)))];

    const handleRegisterAgent = (agent: AgentInfo) => {
        setAgentToRegister(agent);
        setRegistrationModalOpen(true);
    };

    const handleRegisterComplete = (agentId: string, visibility: 'public' | 'private', customSettings?: any) => {
        console.log('Agent registered:', { agentId, visibility, customSettings });
        setRegistrationModalOpen(false);
        setAgentToRegister(null);
        // Here you would typically make an API call to register the agent
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <IconStar
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
            />
        ));
    };



    return (
        <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-card/30 border border-border/30 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Visibility Filter */}
                <div className="flex bg-card/30 border border-border/30 rounded-lg p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-light transition-all ${filter === 'all' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('public')}
                        className={`px-4 py-2 rounded-md text-sm font-light transition-all ${filter === 'public' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Public
                    </button>
                    <button
                        onClick={() => setFilter('private')}
                        className={`px-4 py-2 rounded-md text-sm font-light transition-all ${filter === 'private' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Private
                    </button>
                </div>

                {/* Category Filter */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-3 bg-card/30 border border-border/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                >
                    {categories.map((category) => (
                        <option key={category} value={category} className="bg-card text-white">
                            {category === 'all' ? 'All Categories' : category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground font-light">
                    {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Expandable Agent Cards */}
            <ExpandableAgentCards
                agents={filteredAgents.map(agent => ({
                    id: agent.id,
                    title: agent.name,
                    description: agent.description,
                    category: agent.category,
                    version: agent.version,
                    llmProvider: agent.llmProvider,
                    llmModel: agent.llmModel,
                    costPerToken: agent.costPerToken,
                    inputCostPer1M: agent.inputCostPer1M,
                    outputCostPer1M: agent.outputCostPer1M,
                    skills: agent.skills,
                    supportsStreaming: agent.supportsStreaming,
                    supportsMultiAgent: agent.supportsMultiAgent,
                    maxTotalAgentCost: agent.maxTotalAgentCost,
                    isPublic: agent.isPublic,
                    author: agent.author,
                    downloads: agent.downloads,
                    rating: agent.rating,
                    totalRatings: agent.totalRatings,
                    lastUpdated: agent.lastUpdated,
                    tags: agent.tags,
                    features: agent.features,
                    ctaText: "Register Agent",
                    onRegister: () => handleRegisterAgent(agent)
                }))}
            />

            {filteredAgents.length === 0 && (
                <div className="text-center py-16">
                    {/* <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                        <IconRobot size={40} className="text-primary/60" />
                    </div> */}
                    <h3 className="text-xl font-light text-white mb-3">No agents found</h3>
                    <p className="text-neutral-400 max-w-md mx-auto">Try adjusting your search criteria or explore different categories to discover amazing agents.</p>
                </div>
            )}

            {/* Registration Modal */}
            <AgentRegistrationModal
                agent={agentToRegister}
                isOpen={registrationModalOpen}
                onClose={() => {
                    setRegistrationModalOpen(false);
                    setAgentToRegister(null);
                }}
                onRegister={handleRegisterComplete}
            />
        </div>
    );
};