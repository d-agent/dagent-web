"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentMarketplace } from "@/components/agents/agent-marketplace";
import { IconRobot, IconWorld, IconPlus } from "@tabler/icons-react";

export default function AgentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'your-agents' | 'marketplace'>('your-agents');

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-wide">Agent Ecosystem</h1>
              <p className="text-muted-foreground font-light">Discover, deploy, and manage intelligent agents</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center bg-card/30 border border-border/30 rounded-xl p-1">
              {/* <button
                onClick={() => setActiveTab('your-agents')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-light transition-all ${activeTab === 'your-agents'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
              >
                <IconRobot size={16} />
                Your Agents
              </button>
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-light transition-all ${activeTab === 'marketplace'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
              >
                <IconWorld size={16} />
                Marketplace
              </button> */}
            </div>
          </div>

          <button
            onClick={() => router.push('/agents/add-agents')}
            className="group relative px-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-light transition-all hover:bg-primary/20 hover:shadow-xl hover:shadow-primary/10 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <IconPlus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Agent</span>
          </button>
        </div>

        {/* Content */}
        <div className="w-full">
          {<AgentMarketplace />}
        </div>
      </div>
    </div>
  );
}