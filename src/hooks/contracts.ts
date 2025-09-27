
"use client";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { abi } from "../lib/config/abi/Stake.contract.json";
import { env } from "@/lib/config/env";

export const useStake = () => {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  
  const provider = "0x1234567890abcdef1234567890abcdef12345678";
  const userId = "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e";

  const stakeFn = () => {
    if (!address || !userId) return null;
	console.log("stake Triggered")
    writeContract({
      abi,
      address: env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`,
      functionName: "createEscrow",
      args: [provider, userId],
      value: parseEther("0.01"),
    });
  };

  return { 
    stakeFn, 
    isPending, 
    isSuccess, 
    error 
  };
};

export const usePullStake = (amount: number) => {
  const { address } = useAccount();
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const simulation = useSimulateContract({
    abi,
    address: env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`,
    functionName: "pullEscrow",
    args: [parseEther(amount.toString())],
    query: {
      enabled: !!address && !!userId && amount > 0,
    }
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const pullStakeFn = () => {
    if (!address || !userId || !simulation.data?.request) return;
    
    writeContract(simulation.data.request);
  };

  return { 
    pullStakeFn, 
    isPending, 
    isSuccess, 
    error,
    simulation
  };
};

export const useEmptyStake = () => {
  const { address } = useAccount();
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  const simulation = useSimulateContract({
    abi,
    address: env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`,
    functionName: "emptyEscrow", // Assuming this is the function name
    args: [],
    query: {
      enabled: !!address && !!userId,
    }
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const emptyStakeFn = () => {
    if (!address || !userId || !simulation.data?.request) return;
    
    writeContract(simulation.data.request);
  };

  return { 
    emptyStakeFn, 
    isPending, 
    isSuccess, 
    error,
    simulation
  };
};