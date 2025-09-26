"use client";

import React from 'react';
import { WalletConnection } from '@/components/wallet/wallet-connection';
import { StakingInfo } from '@/components/wallet/staking-info';
import { ApiUsageChart } from '@/components/wallet/api-usage-chart';
import { TransactionHistory } from '@/components/wallet/transaction-history';

// Sample data for API usage by agent
const apiUsageData = [
    { agent: 'Support Agent', tokensBurned: 0.0124, color: 'var(--chart-1)' },
    { agent: 'Market Analyzer', tokensBurned: 0.0097, color: 'var(--chart-2)' },
    { agent: 'Document Processor', tokensBurned: 0.0068, color: 'var(--chart-3)' },
    { agent: 'Trading Assistant', tokensBurned: 0.0053, color: 'var(--chart-4)' },
];

// Sample transaction history
const transactionHistory = [
    {
        id: 'tx1',
        date: 'Sep 25, 2025 • 14:32',
        type: 'api-call' as const,
        amount: '0.0012',
        agent: 'Support Agent',
        endpoint: '/chat/completions',
        status: 'completed' as const,
    },
    {
        id: 'tx2',
        date: 'Sep 25, 2025 • 10:15',
        type: 'api-call' as const,
        amount: '0.0008',
        agent: 'Market Analyzer',
        endpoint: '/market/analyze',
        status: 'completed' as const,
    },
    {
        id: 'tx3',
        date: 'Sep 24, 2025 • 18:47',
        type: 'deposit' as const,
        amount: '0.1500',
        status: 'completed' as const,
    },
    {
        id: 'tx4',
        date: 'Sep 24, 2025 • 16:22',
        type: 'api-call' as const,
        amount: '0.0015',
        agent: 'Document Processor',
        endpoint: '/document/analyze',
        status: 'completed' as const,
    },
    {
        id: 'tx5',
        date: 'Sep 23, 2025 • 09:05',
        type: 'api-call' as const,
        amount: '0.0018',
        agent: 'Trading Assistant',
        endpoint: '/trading/recommend',
        status: 'completed' as const,
    },
    {
        id: 'tx6',
        date: 'Sep 20, 2025 • 11:30',
        type: 'withdrawal' as const,
        amount: '0.0500',
        status: 'completed' as const,
    },
];

export default function WalletPage() {
    return (
        <div className="max-w-[1200px] mx-auto px-6 py-16">
            {/* Header with glass effect */}
            <header className="relative mb-16 max-w-3xl">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl blur-3xl" />
                <h1 className="text-4xl font-bold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">Wallet & API Usage</h1>
                <p className="text-lg text-muted-foreground">
                    Manage your wallet connection, view API costs, and track token usage across your agents.
                </p>
            </header>

            {/* Wallet Connection Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-4">Wallet Status</h2>
                <WalletConnection />
            </section>

            {/* Staking Information */}
            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-4">Staking Information</h2>
                <StakingInfo
                    stakedAmount="0.3500"
                    stakingDate="Sep 15, 2025"
                    rewardsRate="1.2% APY"
                    lockPeriod="30 days minimum"
                    contractAddress="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                />
            </section>

            {/* Token Usage Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-6">Token Usage</h2>
                <div className="border-t border-border/20 pt-6">
                    <ApiUsageChart data={apiUsageData} />
                </div>
            </section>

            {/* Transaction History */}
            <section className="mb-12">
                <h2 className="text-2xl font-medium mb-6">Recent Transactions</h2>
                <TransactionHistory transactions={transactionHistory} />
            </section>

            {/* Add Funds Section */}
            <section className="mb-16">
                <div className="border-t border-border/20 pt-8">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-xl font-medium mb-6">Add More Funds</h2>
                        <p className="text-muted-foreground mb-8">
                            Add more ETH to your staked balance to ensure uninterrupted API access for your agents.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-5 py-2 bg-primary text-primary-foreground rounded-md transition-colors">
                                Add Funds
                            </button>
                            <button className="px-5 py-2 border border-border/40 rounded-md transition-colors">
                                View Contract
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}