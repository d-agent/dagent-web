"use client";

import React from 'react';

interface ApiUsageChartProps {
    data: {
        agent: string;
        tokensBurned: number;
        color?: string;
    }[];
}

export const ApiUsageChart: React.FC<ApiUsageChartProps> = ({ data }) => {
    // Sort data by tokens burned (highest first)
    const sortedData = [...data].sort((a, b) => b.tokensBurned - a.tokensBurned);

    // Calculate total tokens burned
    const totalTokens = data.reduce((sum, item) => sum + item.tokensBurned, 0);

    return (
        <div className="bg-transparent">
            <div className="space-y-6">
                {sortedData.map((item, index) => {
                    const percentage = totalTokens > 0 ? (item.tokensBurned / totalTokens) * 100 : 0;

                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">{item.agent}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                                    <span className="text-sm">{item.tokensBurned.toFixed(4)} ETH</span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full bg-border/30 relative">
                                <div
                                    className="h-[1px] absolute top-0 left-0 bg-primary/80"
                                    style={{
                                        width: `${percentage}%`
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-border/30">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total tokens burned</span>
                    <span className="text-sm">{totalTokens.toFixed(4)} ETH</span>
                </div>
            </div>
        </div>
    );
};