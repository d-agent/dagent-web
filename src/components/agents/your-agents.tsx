"use client";

import React from 'react';
import { ExpandableYourAgents } from './expandable-your-agents';

const deployedAgents = [
  {
    id: '1',
    name: 'Trading Bot Alpha',
    type: 'Trading Agent',
    status: 'running' as const,
    lastActive: '2 mins ago',
    apiCalls: 1243,
    ethBurned: '0.0125'
  },
  {
    id: '2',
    name: 'Data Analyzer',
    type: 'Analytics Agent',
    status: 'running' as const,
    lastActive: '5 mins ago',
    apiCalls: 892,
    ethBurned: '0.0089'
  }
];

const registeredAgents = [
  {
    id: 'reg-1',
    name: 'Advanced Trading Bot',
    description: 'Sophisticated trading agent for cryptocurrency markets',
    visibility: 'public' as const,
    registeredDate: '2024-03-15',
    status: 'active' as const,
    category: 'Trading'
  }
];

export const YourAgents = () => {
  const handleAgentAction = (agentId: string, action: string) => {
    console.log(`Action: ${action} on agent: ${agentId}`);
  };

  return (
    <ExpandableYourAgents
      deployedAgents={deployedAgents}
      registeredAgents={registeredAgents}
      onAgentAction={handleAgentAction}
    />
  );
};
