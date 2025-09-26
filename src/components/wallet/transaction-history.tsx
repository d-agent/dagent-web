"use client";

import React from 'react';

type Transaction = {
    id: string;
    date: string;
    type: 'api-call' | 'deposit' | 'withdrawal';
    amount: string;
    agent?: string;
    endpoint?: string;
    status: 'completed' | 'pending' | 'failed';
};

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    const getTypeSymbol = (type: Transaction['type']) => {
        switch (type) {
            case 'api-call':
                return "•";
            case 'deposit':
                return "+";
            case 'withdrawal':
                return "-";
            default:
                return "";
        }
    };

    const handleSavePDF = () => {
        // In a real implementation, this would use a library like jsPDF or react-to-pdf
        // For now, this is just a placeholder function
        console.log('Saving transactions as PDF');
        window.alert('PDF download started');
    };

    return (
        <div className="relative rounded-xl overflow-hidden">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-primary/3 to-secondary/5 -z-10"></div>

            {/* Light border effect */}
            <div className="absolute inset-0 border border-primary/10 rounded-xl -z-10"></div>

            <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {transactions.length} transactions
                    </div>
                    <button
                        onClick={handleSavePDF}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 border border-border/40 rounded-md hover:bg-secondary/10 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Save as PDF
                    </button>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No transactions found
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-border/20">
                            <thead>
                                <tr>
                                    <th className="py-3 text-xs font-medium text-muted-foreground text-left">Date</th>
                                    <th className="py-3 text-xs font-medium text-muted-foreground text-left">Type</th>
                                    <th className="py-3 text-xs font-medium text-muted-foreground text-left">Agent/Endpoint</th>
                                    <th className="py-3 text-xs font-medium text-muted-foreground text-left">Amount</th>
                                    <th className="py-3 text-xs font-medium text-muted-foreground text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-secondary/5 transition-colors">
                                        <td className="py-3 text-sm whitespace-nowrap">{tx.date}</td>
                                        <td className="py-3 text-sm whitespace-nowrap">
                                            {tx.type === 'api-call' ? 'API Call' : tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                                        </td>
                                        <td className="py-3 text-sm">
                                            {tx.agent && <div className="text-sm">{tx.agent}</div>}
                                            {tx.endpoint && <div className="text-xs text-muted-foreground mt-0.5">{tx.endpoint}</div>}
                                            {!tx.agent && !tx.endpoint && "—"}
                                        </td>
                                        <td className="py-3 text-sm font-mono whitespace-nowrap">
                                            {getTypeSymbol(tx.type)} {tx.amount} ETH
                                        </td>
                                        <td className="py-3">
                                            <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-secondary/30 rounded-full">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};