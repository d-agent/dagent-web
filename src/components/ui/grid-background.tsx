"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface GridBackgroundProps {
    className?: string;
}

export function GridBackground({ className }: GridBackgroundProps) {
    return (
        <div className={cn('absolute inset-0 -z-10 h-full w-full', className)}>
            <div
                className="absolute inset-0 bg-grid-pattern bg-[length:var(--grid-size)_var(--grid-size)] opacity-[var(--grid-opacity)]"
                style={{
                    '--grid-size': '25px',
                    '--grid-opacity': '0.05',
                    backgroundImage: `
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
          `,
                    backgroundSize: 'var(--grid-size) var(--grid-size)',
                    '--grid-color': 'var(--primary)',
                } as React.CSSProperties}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </div>
    );
}