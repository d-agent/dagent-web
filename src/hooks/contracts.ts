"use client";
import {
  useAccount,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { parseEther } from "viem";
import contractData from "../lib/config/abi/Stake.contract.json";
import { env } from "@/lib/config/env";

const abi = contractData.abi;

export const useStake = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const contractAddress = env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`;

  const stakeFn = (val?: number) => {
    if (!address) {
      console.log("Wallet not connected");
      return null;
    }

    const provider = address; // the client is msg.sender, provider you can pass from UI or env
    const userId = "some-user-id"; // ideally from app state, not hardcoded

    writeContract({
      abi,
      address: contractAddress,
      functionName: "createEscrow",
      args: [provider, userId],
      value: parseEther((val ?? 0.01).toString()),
    });
  };

  const { data, isLoading, isError } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "getAddressStake",
    args: [address],
    query: { enabled: Boolean(address) },
  });

  // console.log("escrow raw data", data);

  // Convert array response to object and check if escrow exists
  const processedStake = data ? (() => {
    const [client, provider, userId, amount] = data as [string, string, string, bigint];
    
    // Check if this is an empty/default escrow (no actual stake)
    const isEmpty = client === "0x0000000000000000000000000000000000000000" && 
                   provider === "0x0000000000000000000000000000000000000000" && 
                   userId === "" && 
                   amount === BigInt(0);

    if (isEmpty) {
      return undefined;
    }

    return {
      client: client as `0x${string}`,
      provider: provider as `0x${string}`,
      userId,
      amount,
    };
  })() : undefined;

  // console.log("processed stake", processedStake);

  return { 
    stakeFn, 
    stake: processedStake,
    isLoading,
    isError,
  };
};

export const usePullStake = (amount: number) => {
  const { writeContract } = useWriteContract();

  const contractAddress = env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`;

  const pullFn = () => {
    writeContract({
      abi,
      address: contractAddress,
      functionName: "pullEscrow",
      args: [parseEther(amount.toString())],
    });
  };

  return { pullFn };
};

export const useEmptyStake = () => {
  const { writeContract } = useWriteContract();

  const contractAddress = env.NEXT_PUBLIC_PROVIDER_ADDRESS as `0x${string}`;

  const emptyFn = () => {
    writeContract({
      abi,
      address: contractAddress,
      functionName: "pullAllEscrow", // correct function name
      args: [],
    });
  };

  return { emptyFn };
};
