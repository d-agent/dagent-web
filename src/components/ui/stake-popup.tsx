"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {  IconCoins, IconArrowUp, IconArrowDown } from "@tabler/icons-react";

const stakingSchema = z.object({
    action: z.enum(["stake", "pull"], {
        message: "Please select an action",
    }),
    amount: z.coerce
        .number()
        .positive("Amount must be positive")
        .min(0.001, "Minimum amount is 0.001"),
    tokenAddress: z.string().min(1, "Token address is required"),
});

type StakingValues = z.infer<typeof stakingSchema>;

interface StakePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onStake: (data: StakingValues) => void;
    availableBalance?: string;
    stakedBalance?: string;
    tokenSymbol?: string;
}

export function StakePopup({
    isOpen,
    onClose,
    onStake,
    availableBalance = "0.000",
    stakedBalance = "0.000",
    tokenSymbol = "ETH",
}: StakePopupProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<StakingValues>({
        resolver: zodResolver(stakingSchema) as any,
        defaultValues: {
            action: "stake" as const,
            amount: 0,
            tokenAddress: "",
        },
    });

    const watchedAction = watch("action");
    const watchedAmount = watch("amount");

    const handleStakeAction = async (data: StakingValues) => {
        setIsProcessing(true);
        try {
            await onStake(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Staking action failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        reset();
        setIsProcessing(false);
        onClose();
    };

    const setMaxAmount = () => {
        const maxAmount = watchedAction === "stake" 
            ? parseFloat(availableBalance) 
            : parseFloat(stakedBalance);
        setValue("amount", maxAmount);
    };

    const getActionIcon = () => {
        switch (watchedAction) {
            case "stake":
                return <IconArrowUp className="h-5 w-5 text-green-500" />;
            case "pull":
                return <IconArrowDown className="h-5 w-5 text-red-500" />;
            default:
                return <IconCoins className="h-5 w-5 text-gray-500" />;
        }
    };

    const getActionColor = () => {
        switch (watchedAction) {
            case "stake":
                return "bg-green-500 hover:bg-green-600";
            case "pull":
                return "bg-red-500 hover:bg-red-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <DialogTitle>Staking Actions</DialogTitle>
                    </div>
                    <DialogDescription>
                        Manage your token staking positions
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleStakeAction as any)} className="space-y-6 py-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Available Balance:</span>
                            <span className="font-medium">{availableBalance} {tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Staked Balance:</span>
                            <span className="font-medium">{stakedBalance} {tokenSymbol}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Action</label>
                        <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="stake"
                                    {...register("action")}
                                    className="sr-only"
                                />
                                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                    watchedAction === "stake" 
                                        ? "  text-green-700 dark:text-green-400" 
                                        : "border-border/30 hover:border-border/50"
                                }`}>
                                    <IconArrowUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">Stake</span>
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="pull"
                                    {...register("action")}
                                    className="sr-only"
                                />
                                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                    watchedAction === "pull" 
                                        ? "border-red-500   text-red-700 dark:text-red-400" 
                                        : "border-border/30 hover:border-border/50"
                                }`}>
                                    <IconArrowDown className="h-4 w-4" />
                                    <span className="text-sm font-medium">pull</span>
                                </div>
                            </label>
                        </div>
                        {errors.action && (
                            <p className="text-xs text-red-500">{errors.action.message}</p>
                        )}
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="amount" className="text-sm font-medium">
                                Amount ({tokenSymbol})
                            </label>
                            <button
                                type="button"
                                onClick={setMaxAmount}
                                className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Max: {watchedAction === "stake" ? availableBalance : stakedBalance}
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                id="amount"
                                type="number"
                                step="0.001"
                                min="0.001"
                                className={`w-full px-3 py-3 border rounded-lg text-lg font-medium ${
                                    errors.amount ? "border-red-500" : "border-border/30"
                                } bg-background`}
                                placeholder="0.000"
                                {...register("amount")}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {getActionIcon()}
                            </div>
                        </div>
                        {errors.amount && (
                            <p className="text-xs text-red-500">{errors.amount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2 flex space-x-4">
                        <label htmlFor="tokenAddress" className="text-sm font-light">
                            Token Contract Address:  
                        </label>
                        <div className="font-bold">

                            {"    kldflksfsdkfhdskf"}
                        </div>
                        {errors.tokenAddress && (
                            <p className="text-xs text-red-500">{errors.tokenAddress.message}</p>
                        )}
                    </div>

                    {watchedAmount > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-2">
                                Transaction Preview
                            </h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Action:</span>
                                    <span className="font-medium capitalize">{watchedAction}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Amount:</span>
                                    <span className="font-medium">{watchedAmount} {tokenSymbol}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 text-sm border border-border/30 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(handleStakeAction as any)}
                        disabled={isProcessing || !watchedAmount || watchedAmount <= 0}
                        className={`px-4 py-2 text-sm text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getActionColor()}`}
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {getActionIcon()}
                                {watchedAction === "stake" ? "Stake Tokens" : "pull Tokens"}
                            </div>
                        )}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}