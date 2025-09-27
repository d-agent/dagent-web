"use client";

import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const queryClient = new QueryClient();

const config = createConfig({
    chains: [mainnet],
    connectors: [injected()],
    transports: {
        [mainnet.id]: http(),
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                {/* <AuthProvider> */}
                    {children}
                {/* </AuthProvider> */}
            </WagmiProvider>
        </QueryClientProvider>
    );
}
