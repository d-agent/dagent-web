"use client";

import React, { useState } from 'react';
import { IconLock, IconPlus, IconHistory, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

interface StakeTransaction {
  id: string;
  type: 'stake' | 'unstake' | 'burn';
  amount: string;
  timestamp: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
}

interface StakingDashboardProps {
  totalStaked: string;
  contractAddress: string;
}

const sampleTransactions: StakeTransaction[] = [
  {
    id: '1',
    type: 'stake',
    amount: '5.000',
    timestamp: 'Sep 27, 2025 10:30 AM',
    txHash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'stake',
    amount: '7.500',
    timestamp: 'Sep 15, 2025 2:15 PM',
    txHash: '0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a',
    status: 'completed'
  },
  {
    id: '3',
    type: 'burn',
    amount: '0.025',
    timestamp: 'Sep 20, 2025 8:45 AM',
    txHash: '0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z1a2b',
    status: 'completed'
  },
];

export const StakingDashboard: React.FC<StakingDashboardProps> = ({
  totalStaked,
  contractAddress
}) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeForm, setShowStakeForm] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to stake would go here
    console.log('Staking:', stakeAmount);
    setStakeAmount('');
    setShowStakeForm(false);
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') return <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />;
    
    switch (type) {
      case 'stake':
        return <IconArrowUp size={16} className="text-green-500" />;
      case 'unstake':
        return <IconArrowDown size={16} className="text-blue-500" />;
      case 'burn':
        return <IconArrowDown size={16} className="text-red-500" />;
      default:
        return <IconHistory size={16} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'stake':
        return 'text-green-500';
      case 'unstake':
        return 'text-blue-500';
      case 'burn':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <IconLock size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium">Staking Dashboard</h3>
        </div>
        <button
          onClick={() => setShowStakeForm(!showStakeForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus size={16} />
          Stake
        </button>
      </div>

      {/* Total Staked Display */}
      <div className="bg-secondary/30 p-6 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Staked</div>
          <div className="text-4xl font-bold mb-2">{totalStaked} ETH</div>
          <div className="text-xs text-muted-foreground">Available for API usage</div>
        </div>
      </div>

      {/* Stake Form */}
      {showStakeForm && (
        <div className="border border-border rounded-lg p-4 mb-6 bg-secondary/20">
          <form onSubmit={handleStake}>
            <div className="mb-4">
              <label htmlFor="stake-amount" className="block text-sm font-medium mb-2">
                Amount to Stake (ETH)
              </label>
              <input
                id="stake-amount"
                type="number"
                step="0.001"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.000"
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Confirm Stake
              </button>
              <button
                type="button"
                onClick={() => setShowStakeForm(false)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconHistory size={18} />
            <h4 className="font-medium">Transaction History</h4>
          </div>
          <button
            onClick={() => setShowFullHistory(!showFullHistory)}
            className="text-xs text-primary hover:underline"
          >
            {showFullHistory ? 'Show Less' : 'View All'}
          </button>
        </div>
        
        <div className={`space-y-3 transition-all duration-300 ${showFullHistory ? 'max-h-none' : 'max-h-20'} overflow-y-auto`}>
          {(showFullHistory ? sampleTransactions : sampleTransactions.slice(0, 1)).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getTransactionIcon(tx.type, tx.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">{tx.type}</span>
                    <span className={`text-sm font-mono ${getTransactionColor(tx.type)}`}>
                      {tx.type === 'burn' ? '-' : '+'}{tx.amount} ETH
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{tx.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-1 rounded ${
                  tx.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                  tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {tx.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Info */}
      <div className="pt-4 border-t border-border/50 mt-6">
        <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
        <div className="text-xs font-mono break-all text-muted-foreground">
          {contractAddress}
        </div>
      </div>
    </div>
  );
};