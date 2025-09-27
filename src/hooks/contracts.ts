"use client";

import { useAccount, useSimulateContract } from "wagmi";
import { parseEther } from "viem";
import { abi } from "../lib/config/abi/Stake.contract.json";
import { env } from "@/lib/config/env";

export const useStake = () => {
	const { address } = useAccount();

	const provider = "0x1234567890abcdef1234567890abcdef12345678"; // Provider address
	const userId =
		typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

	if (!address || !userId) {
		return {
			data: null,
			error: null,
			isLoading: false,
			isSuccess: false,
			isError: false,
		};
	}

	return useSimulateContract({
		abi,
		address: env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`,
		functionName: "createEscrow",
		args: [provider, userId],
		// TODO: generate the eth amount from backend for security reasons
		value: parseEther("0.01"),
	});
};

export const usePullStake = (amount: number) => {
	const { address } = useAccount();
	const userId =
		typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

	if (!address || !userId) {
		return {
			data: null,
			error: null,
			isLoading: false,
			isSuccess: false,
			isError: false,
		};
	}
	return useSimulateContract({
		abi,
		address: env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`,
		functionName: "pullEscrow",
		args: [parseEther(amount.toString())],
	});
};

export const useEmptyStake = () => {
	const { address } = useAccount();
	const userId =
		typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

	if (!address || !userId) {
		return {
			data: null,
			error: null,
			isLoading: false,
			isSuccess: false,
			isError: false,
		};
	}
	return useSimulateContract({
		abi,
		address,
		args: [],
	});
};

