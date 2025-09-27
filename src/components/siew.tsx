"use client";
import { useState, useRef, useEffect } from "react"
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi"
import { authClient } from "../lib/auth-client"
import { IconWallet, IconLogout, IconCopy, IconCheck, IconChevronDown, IconUser } from '@tabler/icons-react'
import { useRouter } from "next/navigation";

export default function LoginWithEthereum() {
    const { connect, connectors } = useConnect()
    const { address, chainId, isConnected } = useAccount()
    const { signMessageAsync } = useSignMessage()
    const { disconnect } = useDisconnect()
    const [status, setStatus] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const login = async () => {
        try {
            setIsLoading(true)
            setStatus("")

            if (!isConnected) {
                 connect({ connector: connectors[0] })
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
                setStatus("✅ Successfully authenticated")
                setIsAuthenticated(true)
                router.push('/home')
            } else {
                setStatus("❌ Authentication failed")
            }
        } catch (err) {
            console.error(err)
            setStatus("❌ Error during authentication")
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true)
            const { error } = await authClient.signOut()
            if (error) throw new Error(error.message)

            await disconnect()
            setStatus("✅ Logged out successfully")
            setIsAuthenticated(false)
            setIsDropdownOpen(false)
        } catch (err) {
            console.error(err)
            setStatus("❌ Error during logout")
        } finally {
            setIsLoading(false)
        }
    }

    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        }
    }

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const getInitials = (addr: string) => {
        return addr.slice(2, 4).toUpperCase()
    }

    // Not connected state
    if (!isConnected) {
        return (
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={login}
                    disabled={isLoading}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 border border-primary/30 rounded-xl text-primary font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : (
                        <IconWallet size={20} />
                    )}
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
            </div>
        )
    }

    // Connected but not authenticated
    if (isConnected && !isAuthenticated) {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    {/* Wallet Circle */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                        <span className="text-primary font-mono text-sm font-bold">
                            {getInitials(address!)}
                        </span>
                    </div>

                    {/* Address and Sign Button */}
                    <div className="flex flex-col gap-2">
                        <div className="text-white font-medium">
                            {formatAddress(address!)}
                        </div>
                        <button
                            onClick={login}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <IconUser size={16} />
                            )}
                            {isLoading ? "Signing..." : "Sign in with Ethereum"}
                        </button>
                    </div>
                </div>

                {status && (
                    <div className={`text-sm px-4 py-2 rounded-lg ${status.includes('✅')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {/* {status} */}
                    </div>
                )}
            </div>
        )
    }

    // Connected and authenticated
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
                {/* Wallet Circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-400 font-mono text-sm font-bold">
                        {getInitials(address!)}
                    </span>
                </div>

                {/* Address */}
                <div className="flex flex-col items-start">
                    <div className="text-white font-medium text-sm">
                        {formatAddress(address!)}
                    </div>
                    <div className="text-emerald-400 text-xs">
                        Connected
                    </div>
                </div>

                {/* Dropdown Arrow */}
                <IconChevronDown
                    size={16}
                    className={`text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
                    <div className="p-4">
                        {/* Wallet Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center">
                                <span className="text-emerald-400 font-mono text-sm font-bold">
                                    {getInitials(address!)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="text-white font-medium">
                                    {formatAddress(address!)}
                                </div>
                                <div className="text-emerald-400 text-sm">
                                    Authenticated
                                </div>
                            </div>
                        </div>

                        {/* Full Address */}
                        <div className="py-3 border-b border-white/10">
                            <div className="text-xs text-neutral-400 mb-1">Address</div>
                            <div className="flex items-center gap-2">
                                <code className="text-white text-xs bg-white/5 px-2 py-1 rounded flex-1 font-mono break-all">
                                    {address}
                                </code>
                                <button
                                    onClick={copyAddress}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Copy address"
                                >
                                    {isCopied ? (
                                        <IconCheck size={14} className="text-emerald-400" />
                                    ) : (
                                        <IconCopy size={14} className="text-neutral-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Chain Info */}
                        <div className="py-3 border-b border-white/10">
                            <div className="text-xs text-neutral-400 mb-1">Network</div>
                            <div className="text-white text-sm">
                                Chain ID: {chainId}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3">
                            <button
                                onClick={logout}
                                disabled={isLoading}
                                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                ) : (
                                    <IconLogout size={16} />
                                )}
                                {isLoading ? "Logging out..." : "Disconnect & Logout"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Message */}
            {status && (
                <div className="absolute top-full left-0 mt-2 z-40">
                    <div className={`text-sm px-4 py-2 rounded-lg ${status.includes('✅')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {/* {status} */}
                    </div>
                </div>
            )}
        </div>
    )
}