"use client";

import React from 'react';

interface SimpleBarChartProps {
    data: {
        label: string;
        value: number;
        color?: string;
    }[];
    height?: number;
    maxValue?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
    data,
    height = 200,
    maxValue
}) => {
    const highestValue = maxValue || Math.max(...data.map(item => item.value));

    return (
        <div className="w-full">
            <div className="flex items-end h-[200px] gap-2">
                {data.map((item, index) => {
                    const percentage = (item.value / highestValue) * 100;
                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center flex-1"
                        >
                            <div
                                className="w-full rounded-t-sm transition-all duration-500 ease-in-out"
                                style={{
                                    height: `${percentage}%`,
                                    backgroundColor: item.color || 'var(--primary)',
                                    opacity: 0.8
                                }}
                            />
                            <span className="text-xs mt-2 text-muted-foreground truncate w-full text-center">
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

interface SimpleLineChartProps {
    data: {
        date: string;
        value: number;
    }[];
    height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
    data,
    height = 200
}) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = 0;
    const range = maxValue - minValue;

    // Normalize points to fit within the chart area
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - minValue) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="0" y2="100" stroke="var(--border)" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="100" y2="100" stroke="var(--border)" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="var(--border)" strokeWidth="0.2" strokeDasharray="1" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="var(--border)" strokeWidth="0.2" strokeDasharray="1" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="var(--border)" strokeWidth="0.2" strokeDasharray="1" />

                {/* Data polyline */}
                <polyline
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="1.5"
                    points={points}
                />

                {/* Area under the line */}
                <polyline
                    fill="var(--primary)"
                    fillOpacity="0.1"
                    stroke="none"
                    points={`0,100 ${points} 100,100`}
                />

                {/* Data points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - ((d.value - minValue) / range) * 100;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="1"
                            fill="var(--primary)"
                            className="hover:r-2 transition-all duration-200"
                        />
                    );
                })}
            </svg>
            <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">{data[0].date}</span>
                <span className="text-xs text-muted-foreground">{data[data.length - 1].date}</span>
            </div>
        </div>
    );
};