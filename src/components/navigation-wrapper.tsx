"use client";

import dynamic from 'next/dynamic';

// Dynamically import Navigation component with no SSR to avoid hydration issues
const Navigation = dynamic(() => import('@/components/navigation').then(mod => mod.Navigation), {
    ssr: false,
});

export default function NavigationWrapper() {
    return <Navigation />;
}