"use client";

import React, { useState } from 'react';
import { IconLock, IconPlus, IconHistory, IconArrowUp, IconArrowDown } from '@tabler/icons-react';
import { useStake } from '@/hooks/contracts';
import { StakePopup } from '@/components/ui/stake-popup';

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
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false);
  
  // const { stakeFn } = useStake();

  const handleStakeAction = async (data: {
    action: "stake" | "pull";
    amount: number;
    tokenAddress: string;
  }) => {
    try {
      console.log('Staking action:', data);
      
      if (data.action === 'stake') {
        // await stakeFn();
        console.log(`Successfully staked ${data.amount} ETH`);
      } else {
        console.log(`Unstaking ${data.amount} ETH`);
      }
    } catch (error) {
      console.error('Staking action failed:', error);
      throw error;
    }
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

  const handleStakkk = async () => {
    console.log("Stakkk function triggered");
  //  const result = stakeFn();  // simulate with 0.05 ETH
  };

  return (
    <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* <button onClick={handleStakkk}>
            Stakkkkeee
          </button> */}
           <div className="text-sm text-muted-foreground mb-1">Contract Address</div>
        <div className="text-xs font-mono break-all   font-bold text-white">
          {contractAddress}
        </div>
         
        </div>
       
      </div>

      <div className="bg-secondary/30 p-6 rounded-lg mb-6 flex items-center justify-between">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Staked</div>
          <div className="text-4xl font-bold mb-2">{totalStaked} ETH</div>
          <div className="text-xs text-muted-foreground">Available for API usage</div>

        </div>
         <button
          onClick={() => setIsStakePopupOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus size={16} />
          Stake
        </button>
      </div>

      <StakePopup
        isOpen={isStakePopupOpen}
        onClose={() => setIsStakePopupOpen(false)}
        onStake={handleStakeAction}
        availableBalance="10.000" 
        stakedBalance={totalStaked}
        tokenSymbol="ETH"
      />

     

      <div className="pt-4 border-t border-border/50 mt-6">
       
      </div>
    </div>
  );
};