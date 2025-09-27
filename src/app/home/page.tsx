"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WalletConnection } from "@/components/wallet/wallet-connection";
import { StakingDashboard } from "@/components/wallet/staking-dashboard";
import { YourAgents } from "@/components/agents/your-agents";
import { StakedAgents } from "@/components/agents/staked-agents";
import { useStake } from "@/hooks/contracts";
// Dummy staking data for demo
const stakingData = {
  totalStaked: "12.500",
  contractAddress: "0xA1b2C3d4E5F6g7H8i9J0K1L2M3N4O5P6Q7R8S9T0"
};

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<'your-agents' | 'staked-agents' | null>("your-agents");
  const router = useRouter();

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-12">
     

      <div className="flex gap-8">
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-2">
            <button
              onClick={() => setSelectedSection(selectedSection === 'your-agents' ? null : 'your-agents')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedSection === 'your-agents'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Deployed Agents
            </button>
            <button
              onClick={() => setSelectedSection(selectedSection === 'staked-agents' ? null : 'staked-agents')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedSection === 'staked-agents'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Explore Agents
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Main Dashboard - Staking and Wallets Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Total Staked - Main Attraction */}
            <section className="flex flex-col items-center justify-center">
              <div className="w-full">
                <StakingDashboard {...stakingData} />
              </div>
            </section>

            {/* Connected Wallets & Balances */}
            <section>
              <h2 className="text-xl font-semibold mb-6">Connected Wallets</h2>
              <div className="space-y-4">
                <WalletConnection />
              </div>
            </section>
          </div>

         

          {selectedSection === 'your-agents' && (
            <section>
              <h2 className="text-xl font-semibold mb-6">Deployed Agents</h2>
              <YourAgents />
            </section>
          )}

          {selectedSection === 'staked-agents' && (
            <section>
              <h2 className="text-xl font-semibold mb-6">Explore Agents</h2>
              <StakedAgents />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
