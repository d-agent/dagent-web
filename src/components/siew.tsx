"use client";
import { useState } from "react"
import { useAccount, useConnect, useSignMessage } from "wagmi"
import { authClient } from "../lib/validation/auth-client"
import { toast } from "sonner";

export default function LoginWithEthereum() {
    const { connect, connectors } = useConnect()
    const { address, chainId, isConnected } = useAccount()
    const { signMessageAsync } = useSignMessage()
    const [status, setStatus] = useState("")

    const login = async () => {
        console.log("Login with Ethereum")
        try {
            if (!isConnected) {
                await connect({ connector: connectors[0] }) 
            }
            if (!address) return

            // 1. Get nonce from server
            const { data: nonceData } = await authClient.siwe.nonce({
                walletAddress: address,
                chainId,
            })
            if (!nonceData) throw new Error("Failed to get nonce")

            // 2. Build SIWE message
            const message = `myapp.com wants you to sign in with your Ethereum account:
${address}

URI: https://myapp.com
Version: 1
Chain ID: ${chainId}
Nonce: ${nonceData.nonce}
Issued At: ${new Date().toISOString()}`

            // 3. Sign with wallet
            const signature = await signMessageAsync({ message })

            // 4. Verify with server
            const { data: verifyData } = await authClient.siwe.verify({
                message,
                signature,
                walletAddress: address,
                chainId,
            })

            if (verifyData) {
                toast(`✅ Logged in as ${verifyData.user.id}`)
            } else {
                toast("❌ Login failed")
            }
        } catch (err) {
            console.error(err)
            toast("❌ Error during login")
        }
    }

    return (
        <div>
            <button onClick={login}>
                connect Wallet
            </button>
        </div>

    )
}

