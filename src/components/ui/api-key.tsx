"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDeleteApiKey } from '@/hooks/apikey';

interface ApiKeyProps {
    id: string;
    name: string | null;
    createdAt: Date;
    lastRequest: Date | null;
    enabled: boolean;
    prefix: string | null;
    permissions: { [key: string]: string[] } | null;
    className?: string;
}

export const ApiKey: React.FC<ApiKeyProps> = ({
    id,
    name,
    createdAt,
    lastRequest,
    enabled,
    prefix,
    permissions,
    className,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const { mutateAsync: DeleteApiKeyMutation } = useDeleteApiKey();

    const statusStyles = {
        true: 'bg-green-500/10 text-green-600 border-green-500/20',
        // expired: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        false: 'bg-red-500/10 text-red-600 border-red-500/20',
    };

    const handleApiRevoke = (id: string) => {
        const res = DeleteApiKeyMutation(id)
        setShowMenu(false)
    }

    return (
        <div className={cn('border border-border rounded-lg p-4', className)}>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">{name}</h3>
                        <span
                            className={cn(
                                'text-xs px-2 py-0.5 rounded-full border',
                                statusStyles[enabled ? 'true' : 'false']
                            )}
                        >
                            {enabled ? 'Enabled' : 'Revoked'}
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Created on {new Date(createdAt).toLocaleDateString()}
                        {lastRequest && ` • Last used ${lastRequest}`}
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1 rounded-md hover:bg-secondary"
                    >
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
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 mt-1 w-32 z-10 bg-popover border border-border rounded-md shadow-md py-1">
                            <button
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${prefix}...`);
                                    setShowMenu(false);
                                }}
                            >
                                Copy key
                            </button>
                            <button
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary text-red-500"
                                onClick={() => handleApiRevoke(id)}
                            >
                                Revoke
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="bg-secondary px-2 py-1 rounded text-xs font-mono text-muted-foreground">
                    {prefix}...
                </div>
            </div>
            {permissions && Object.keys(permissions).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(permissions).map(([key, values]) =>
                        values.map((permission) => (
                            <span
                                key={`${key}-${permission}`}
                                className="px-1.5 py-0.5 bg-secondary rounded text-xs text-secondary-foreground"
                            >
                                {permission}
                            </span>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};