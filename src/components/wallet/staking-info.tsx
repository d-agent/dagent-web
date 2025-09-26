"use client";

import React from 'react';
import { IconLock, IconInfoCircle } from '@tabler/icons-react';

interface StakingInfoProps {
    stakedAmount: string;
    stakingDate: string;
    rewardsRate: string;
    lockPeriod: string;
    contractAddress: string;
}

export const StakingInfo: React.FC<StakingInfoProps> = ({
    stakedAmount,
    stakingDate,
    rewardsRate,
    lockPeriod,
    contractAddress
}) => {
    return (
        <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-primary/10">
                    <IconLock size={20} className="text-primary" />
                </div>
                <h3 className="text-lg font-medium">Staked Assets</h3>
            </div>

            <div className="space-y-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total Staked</div>
                    <div className="text-2xl font-medium">{stakedAmount} ETH</div>
                    <div className="text-xs text-muted-foreground mt-1">Since {stakingDate}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 border border-border/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Rewards Rate</div>
                        <div className="font-medium">{rewardsRate}</div>
                    </div>
                    <div className="p-3 border border-border/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Lock Period</div>
                        <div className="font-medium">{lockPeriod}</div>
                    </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Contract</div>
                    <div className="text-sm font-mono break-all">
                        {contractAddress}
                    </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary/20 p-3 rounded-md">
                    <IconInfoCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <p>
                        Staked ETH is used to cover the costs of API usage. As your agents use the platform's APIs, ETH is automatically
                        burned from your staked amount. You can add more ETH to your stake at any time.
                    </p>
                </div>
            </div>
        </div>
    );
};