"use client";

import React from 'react';
import { IconRobot, IconPlayerPlay, IconPlayerPause, IconSettings, IconEye, IconDots } from '@tabler/icons-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'paused' | 'stopped';
  lastActive: string;
  apiCalls: number;
  ethBurned: string;
}

const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Trading Bot Alpha',
    type: 'Trading Agent',
    status: 'running',
    lastActive: '2 mins ago',
    apiCalls: 1243,
    ethBurned: '0.0125'
  },
  {
    id: '2',
    name: 'Data Analyzer',
    type: 'Analytics Agent',
    status: 'running',
    lastActive: '5 mins ago',
    apiCalls: 892,
    ethBurned: '0.0089'
  },
  {
    id: '3',
    name: 'News Scraper',
    type: 'Data Collection',
    status: 'paused',
    lastActive: '1 hour ago',
    apiCalls: 567,
    ethBurned: '0.0057'
  },
  {
    id: '4',
    name: 'Portfolio Manager',
    type: 'Investment Agent',
    status: 'stopped',
    lastActive: '2 days ago',
    apiCalls: 234,
    ethBurned: '0.0023'
  }
];

export const YourAgents: React.FC = () => {
  const getStatusDot = (status: string) => {
    const baseClass = "w-2.5 h-2.5 rounded-full";
    switch (status) {
      case 'running':
        return <div className={`${baseClass} bg-emerald-500 shadow-sm shadow-emerald-500/50`} />;
      case 'paused':
        return <div className={`${baseClass} bg-amber-500 shadow-sm shadow-amber-500/50`} />;
      case 'stopped':
        return <div className={`${baseClass} bg-red-500 shadow-sm shadow-red-500/50`} />;
      default:
        return <div className={`${baseClass} bg-gray-400`} />;
    }
  };

  const getStatusText = (status: string) => {
    const baseClass = "text-sm font-light capitalize tracking-wide";
    switch (status) {
      case 'running':
        return <span className={`${baseClass} text-emerald-400`}>{status}</span>;
      case 'paused':
        return <span className={`${baseClass} text-amber-400`}>{status}</span>;
      case 'stopped':
        return <span className={`${baseClass} text-red-400`}>{status}</span>;
      default:
        return <span className={`${baseClass} text-gray-400`}>{status}</span>;
    }
  };

  const runningAgents = sampleAgents.filter(agent => agent.status === 'running').length;
  const totalAgents = sampleAgents.length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
     
      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {sampleAgents.length === 0 ? (
          <div>No Deployed Agents</div>
        ) : (
          sampleAgents.map((agent) => (
            <div
              key={agent.id}
              className=" border  rounded-xl p-6 shadow-xl shadow-primary/5 transition-all duration-300 border-primary/30"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <IconRobot size={18} className="text-primary" />
                  <div>
                    <h3 className="font-light text-white text-xl tracking-wide mb-1">{agent.name}</h3>
                    <p className="text-sm font-light text-muted-foreground">{agent.type}</p>
                  </div>
                </div>
                <button className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors">
                  <IconDots size={16} className="text-muted-foreground" />
                </button>
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-3 mb-6">
                {getStatusDot(agent.status)}
                {getStatusText(agent.status)}
                <span className="text-sm font-light text-muted-foreground ml-auto">{agent.lastActive}</span>
              </div>
              
              {/* Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-end bg-white/5 p-3 rounded-lg">
                  <span className="text-xs font-light text-muted-foreground tracking-wide">API CALLS</span>
                  <span className="text-2xl font-extralight text-white tracking-wider">{agent.apiCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end bg-white/5 p-3 rounded-lg">
                  <span className="text-xs font-light text-muted-foreground tracking-wide">ETH BURNED</span>
                  <span className="text-xl font-light text-orange-400">{agent.ethBurned}</span>
                </div>
              </div>
              
              {/* Activity Bar */}
              
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <IconEye size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                  <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <IconSettings size={16} className="text-muted-foreground hover:text-primary transition-colors" />
                  </button>
                </div>
                
                <button className={`px-4 py-2 rounded-lg text-sm font-light transition-all hover:shadow-md ${
                  agent.status === 'running' 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                }`}>
                  {agent.status === 'running' ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

     
    </div>
  );
};