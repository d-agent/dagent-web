"use client";
import React, { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { StakePopup } from "@/components/ui/stake-popup";
import { useAccount, useBalance } from "wagmi";
import { JsonRpcProvider, Contract, formatEther } from "ethers";
import contractData from "../../lib/config/abi/Stake.contract.json";
import { env } from "@/lib/config/env";

type StakeData = {
  client: any;
  provider: any;
  userId: any;
  amount: any;
};

export const StakingDashboard = () => {
  const [isStakePopupOpen, setIsStakePopupOpen] = useState(false);
  const [stakeData, setStakeData] = useState<StakeData | null>(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const provider = new JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/6KgAm-U3lY1sbQ-3tovqWQhyXLpayFzK"
  );
  const abi = contractData.abi;
  const contractAddress = env.NEXT_PUBLIC_PROVIDER_ADDRESS;
  const contract = new Contract(contractAddress, abi, provider);
  const { data: balance } = useBalance({
    address,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const result = await contract.getAddressStake(address);

        const stakeInfo = {
          client: result[0], // or result.client
          provider: result[1], // or result.provider
          userId: result[2], // or result.userId
          amount: result[3], // or result.amount
        };

        setStakeData(stakeInfo);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handleStakeAction = (data: {
    action: "stake" | "pull";
    amount: number;
    tokenAddress: string;
  }) => {
    try {
      console.log("Staking action:", data);
      if (data.action === "stake") {
        console.log(`Successfully staked ${data.amount} ${data.tokenAddress}`);
      } else {
        console.log(`Unstaking ${data.amount} ${data.tokenAddress}`);
      }
    } catch (error) {
      console.error("Staking action failed:", error);
    }
  };

  const totalStaked = stakeData ? formatEther(stakeData?.amount) : "0";

  return (
    <div className="border border-border rounded-xl p-6 backdrop-blur-sm bg-card/10 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground mb-1">
            Contract Address
          </div>
          <div className="text-xs font-mono break-all font-bold text-white">
            {contractAddress}
          </div>
        </div>
      </div>

      <div className="bg-secondary/30 p-6 rounded-lg mb-6 flex items-center justify-between">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Staked</div>
          <div className="text-4xl font-bold mb-2">
            {loading ? "Loading..." : `${totalStaked} ETH`}
          </div>
          <div className="text-xs text-muted-foreground">
            Available for API usage
          </div>
        </div>

        <button
          onClick={() => setIsStakePopupOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <IconPlus size={16} />
          Stake
        </button>
      </div>

      <StakePopup
        isOpen={isStakePopupOpen}
        onClose={() => setIsStakePopupOpen(false)}
        onStake={handleStakeAction}
        availableBalance={
          balance?.value
            ? parseFloat(formatEther(balance.value)).toFixed(4)
            : "0.0000"
        }
        stakedBalance={totalStaked}
        tokenSymbol="ETH"
      />

      <div className="pt-4 border-t border-border/50 mt-6"></div>
    </div>
  );
};
