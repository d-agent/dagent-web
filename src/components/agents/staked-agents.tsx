"use client";

import React from 'react';
import { IconRobotFace, IconLock, IconTrendingUp, IconClock } from '@tabler/icons-react';

interface StakedAgent {
  id: string;
  name: string;
  type: string;
  stakedAmount: string;
  stakingDate: string;
  performance: 'excellent' | 'good' | 'average' | 'poor';
  totalReturns: string;
  lastUpdate: string;
}

const sampleStakedAgents: StakedAgent[] = [
  {
    id: '1',
    name: 'DeFi Yield Optimizer',
    type: 'Yield Farming',
    stakedAmount: '5.250',
    stakingDate: 'Sep 10, 2025',
    performance: 'excellent',
    totalReturns: '+1.234',
    lastUpdate: '3 mins ago'
  },
  {
    id: '2',
    name: 'Arbitrage Hunter',
    type: 'MEV Bot',
    stakedAmount: '3.500',
    stakingDate: 'Sep 15, 2025',
    performance: 'good',
    totalReturns: '+0.789',
    lastUpdate: '1 hour ago'
  },
  {
    id: '3',
    name: 'Liquidity Provider',
    type: 'LP Management',
    stakedAmount: '2.750',
    stakingDate: 'Sep 20, 2025',
    performance: 'average',
    totalReturns: '+0.145',
    lastUpdate: '2 hours ago'
  },
  {
    id: '4',
    name: 'Flash Loan Bot',
    type: 'Flash Loans',
    stakedAmount: '1.000',
    stakingDate: 'Sep 25, 2025',
    performance: 'poor',
    totalReturns: '-0.023',
    lastUpdate: '5 hours ago'
  }
];

export const StakedAgents: React.FC = () => {
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'text-green-500 bg-green-500/10';
      case 'good':
        return 'text-blue-500 bg-blue-500/10';
      case 'average':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'poor':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-secondary/20';
    }
  };

  const getReturnsColor = (returns: string) => {
    return returns.startsWith('+') ? 'text-green-500' : 'text-red-500';
  };

  const totalStaked = sampleStakedAgents.reduce((sum, agent) => sum + parseFloat(agent.stakedAmount), 0);
  const totalReturns = sampleStakedAgents.reduce((sum, agent) => sum + parseFloat(agent.totalReturns), 0);

  return (
    <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <IconRobotFace size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Staked Agents</h3>
            <p className="text-sm text-muted-foreground">
              {sampleStakedAgents.length} agents actively staking
            </p>
          </div>
        </div>
        <button className="text-sm text-primary hover:underline">
          Manage
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sampleStakedAgents.map((agent) => (
          <div
            key={agent.id}
            className="border border-border rounded-lg p-4 bg-card/30 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-primary/10">
                  <IconLock size={12} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{agent.name}</h4>
                  <p className="text-xs text-muted-foreground">{agent.type}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(agent.performance)}`}>
                {agent.performance}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Staked:</span>
                <span className="font-medium">{agent.stakedAmount} ETH</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Returns:</span>
                <span className={`font-medium ${getReturnsColor(agent.totalReturns)}`}>
                  {agent.totalReturns} ETH
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                Since: {agent.stakingDate}
              </div>
              <div className="text-xs text-muted-foreground">
                Updated: {agent.lastUpdate}
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconClock size={12} />
                <span>Active staking</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <IconLock size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Total Staked</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {totalStaked.toFixed(3)} ETH
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <IconTrendingUp size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Total Returns</span>
            </div>
            <div className={`text-lg font-bold ${getReturnsColor(totalReturns >= 0 ? '+' + totalReturns.toString() : totalReturns.toString())}`}>
              {totalReturns >= 0 ? '+' : ''}{totalReturns.toFixed(3)} ETH
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};