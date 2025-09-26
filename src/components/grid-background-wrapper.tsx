"use client";

import dynamic from 'next/dynamic';

// Dynamically import GridBackground component with no SSR to avoid hydration issues
const GridBackground = dynamic(() => import('@/components/ui/grid-background').then(mod => mod.GridBackground), {
    ssr: false,
});

export default function GridBackgroundWrapper() {
    return <GridBackground />;
}