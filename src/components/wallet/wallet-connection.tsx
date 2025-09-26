"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther } from 'viem';
import { IconWallet, IconCheck } from '@tabler/icons-react';

export const WalletConnection = () => {
    const { address, isConnected, chainId } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const [isMetaMask, setIsMetaMask] = useState(false);

    // Check for MetaMask
    useEffect(() => {
        const checkMetaMask = async () => {
            // @ts-ignore - window.ethereum is not in the types
            setIsMetaMask(typeof window !== 'undefined' && window.ethereum?.isMetaMask);
        };

        checkMetaMask();
    }, []);

    // Get balance
    const { data: balance } = useBalance({
        address,
    });

    const connectWallet = async () => {
        try {
            connect({ connector: injected() });
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const getNetworkName = (id?: number) => {
        switch (id) {
            case 1: return 'Ethereum Mainnet';
            case 11155111: return 'Sepolia';
            case 137: return 'Polygon';
            case 80001: return 'Mumbai';
            default: return 'Unknown Network';
        }
    };

    const networkName = getNetworkName(chainId);

    if (!isMetaMask) {
        return (
            <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                    <IconWallet size={32} className="text-yellow-500" />
                    <h3 className="text-lg font-medium">MetaMask Not Detected</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        To use the wallet features, please install the MetaMask extension for your browser.
                    </p>
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm transition-all hover:opacity-90"
                    >
                        Install MetaMask
                    </a>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="border border-primary/30 bg-primary/5 rounded-xl p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <IconWallet size={32} className="text-primary" />
                    <h3 className="text-xl font-medium">Connect Your Wallet</h3>
                    <p className="text-muted-foreground max-w-md">
                        Connect your MetaMask wallet to view your balance, usage statistics, and manage your API costs.
                    </p>
                    <button
                        onClick={connectWallet}
                        className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:opacity-90"
                    >
                        Connect MetaMask
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <IconCheck size={18} className="text-green-500" />
                        <h3 className="text-lg font-medium">Wallet Connected</h3>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">Address:</span>
                            <span className="text-sm font-mono">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">Network:</span>
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm">{networkName}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">Balance:</span>
                            <span className="text-sm font-medium">
                                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : 'Loading...'}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleDisconnect}
                    className="text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded-md hover:bg-secondary/40 transition-colors"
                >
                    Disconnect
                </button>
            </div>
        </div>
    );
};