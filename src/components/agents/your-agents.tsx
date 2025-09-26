"use client";

import React from 'react';
import { IconRobot, IconPlayerPlay, IconPlayerPause, IconSettings, IconEye } from '@tabler/icons-react';

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-500/10';
      case 'paused':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'stopped':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-secondary/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <IconPlayerPlay size={12} />;
      case 'paused':
        return <IconPlayerPause size={12} />;
      case 'stopped':
        return <div className="w-3 h-3 rounded-full bg-red-500" />;
      default:
        return null;
    }
  };

  const runningAgents = sampleAgents.filter(agent => agent.status === 'running').length;
  const totalAgents = sampleAgents.length;

  return (
    <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <IconRobot size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Your Agents</h3>
            <p className="text-sm text-muted-foreground">
              {runningAgents}/{totalAgents} running
            </p>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleAgents.map((agent) => (
          <div
            key={agent.id}
            className="border border-border rounded-lg p-4 bg-card/30 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(agent.status)}
                <div>
                  <h4 className="font-medium text-sm">{agent.name}</h4>
                  <p className="text-xs text-muted-foreground">{agent.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="text-xs text-muted-foreground">
                Last active: {agent.lastActive}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">API Calls:</span>
                <span className="font-medium">{agent.apiCalls.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">ETH Burned:</span>
                <span className="font-medium text-red-500">{agent.ethBurned}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
              <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                <IconEye size={14} className="text-muted-foreground hover:text-primary" />
              </button>
              <button className="p-1.5 hover:bg-secondary rounded transition-colors">
                <IconSettings size={14} className="text-muted-foreground hover:text-primary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-sm font-medium">Total API Calls</div>
            <div className="text-lg font-bold text-primary">
              {sampleAgents.reduce((sum, agent) => sum + agent.apiCalls, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Total ETH Burned</div>
            <div className="text-lg font-bold text-red-500">
              {sampleAgents.reduce((sum, agent) => sum + parseFloat(agent.ethBurned), 0).toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};