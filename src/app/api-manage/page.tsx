"use client";

import React, { useState } from 'react';
import { SimpleBarChart, SimpleLineChart } from '@/components/ui/simple-charts';
import { ApiKey } from '@/components/ui/api-key';

// Sample data
const monthlyUsageData = [
    { date: 'Jan 1', value: 2430 },
    { date: 'Jan 8', value: 3200 },
    { date: 'Jan 15', value: 4800 },
    { date: 'Jan 22', value: 3900 },
    { date: 'Jan 29', value: 5100 },
    { date: 'Feb 5', value: 6300 },
    { date: 'Feb 12', value: 5400 },
];

const endpointUsageData = [
    { label: '/auth', value: 4200, color: 'var(--chart-1)' },
    { label: '/agents', value: 3100, color: 'var(--chart-2)' },
    { label: '/publish', value: 1800, color: 'var(--chart-3)' },
    { label: '/execute', value: 5600, color: 'var(--chart-4)' },
    { label: '/wallet', value: 2400, color: 'var(--chart-5)' },
];

const sampleApiKeys = [
    {
        id: 'key_1',
        name: 'Development API Key',
        created: 'Aug 15, 2025',
        lastUsed: '2 hours ago',
        status: 'active' as const,
        prefix: 'sk_dev_3FG7h',
        permissions: ['read', 'write', 'execute'],
    },
    {
        id: 'key_2',
        name: 'Production API Key',
        created: 'Jul 23, 2025',
        lastUsed: '5 mins ago',
        status: 'active' as const,
        prefix: 'sk_prod_9JK3f',
        permissions: ['read', 'execute'],
    },
    {
        id: 'key_3',
        name: 'Test API Key',
        created: 'Jun 10, 2025',
        lastUsed: null,
        status: 'revoked' as const,
        prefix: 'sk_test_7HR2d',
        permissions: ['read'],
    },
];

export default function ApiManagementPage() {
    const [newKeyName, setNewKeyName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['read']);

    const handleCreateKey = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to create a new API key would go here
        console.log('Creating key:', { name: newKeyName, permissions: selectedPermissions });
        setNewKeyName('');
    };

    const togglePermission = (permission: string) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-12">
            <header className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">API Management</h1>
                <p className="text-muted-foreground">
                    Manage your API keys and monitor usage across your agents.
                </p>
            </header>

            {/* Usage Overview */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Usage Overview</h2>
                    <div className="text-sm">
                        <span className="text-muted-foreground mr-2">Total calls this month:</span>
                        <span className="font-medium">26,730</span>
                    </div>
                </div>
                <div className="border border-border rounded-lg p-6 bg-card/30">
                    <h3 className="text-sm font-medium mb-4">API Calls (Last 30 Days)</h3>
                    <SimpleLineChart data={monthlyUsageData} height={200} />
                </div>
            </section>

            {/* Endpoint Usage */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Endpoint Usage</h2>
                <div className="border border-border rounded-lg p-6 bg-card/30">
                    <h3 className="text-sm font-medium mb-4">Calls by Endpoint</h3>
                    <SimpleBarChart data={endpointUsageData} />
                </div>
            </section>

            {/* API Keys */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">API Keys</h2>
                    <button
                        onClick={() => document.getElementById('create-key-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create New Key
                    </button>
                </div>
                <div className="space-y-4">
                    {sampleApiKeys.map(key => (
                        <ApiKey key={key.id} {...key} />
                    ))}
                </div>
            </section>

            {/* Create New Key */}
            <section id="create-key-form" className="mb-8">
                <h2 className="text-xl font-semibold mb-6">Create New API Key</h2>
                <div className="border border-border rounded-lg p-6 bg-card/30">
                    <form onSubmit={handleCreateKey}>
                        <div className="mb-4">
                            <label htmlFor="key-name" className="block text-sm font-medium mb-1">
                                Key Name
                            </label>
                            <input
                                id="key-name"
                                type="text"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                placeholder="e.g., Development API Key"
                                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Permissions</label>
                            <div className="flex flex-wrap gap-2">
                                {['read', 'write', 'execute', 'admin'].map(permission => (
                                    <label
                                        key={permission}
                                        className="flex items-center space-x-2 px-3 py-2 border rounded-md hover:bg-secondary cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(permission)}
                                            onChange={() => togglePermission(permission)}
                                            className="rounded border-input"
                                        />
                                        <span className="text-sm capitalize">{permission}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Generate API Key
                        </button>
                    </form>
                </div>
            </section>

            {/* API Documentation Link */}
            <section className="text-center p-6 border border-border rounded-lg bg-secondary/30">
                <h2 className="text-lg font-semibold mb-2">Need help with API integration?</h2>
                <p className="text-muted-foreground mb-4">
                    Check out our comprehensive API documentation for guides and examples.
                </p>
                <a
                    href="/docs/api"
                    className="inline-flex items-center text-primary hover:underline"
                >
                    View API Documentation
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </a>
            </section>
        </div>
    );
}