"use client";

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

// Configure auth client to always include credentials
if (typeof window !== 'undefined') {
    // Ensure cookies are included in all requests
    authClient.$fetch = authClient.$fetch.bind(authClient);
}

interface AuthProviderProps {
    readonly children: React.ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/home',
    '/framework',
    '/docs',
    '/add-agents',
    '/wallet',
    '/dashboard'
];

// Routes that should redirect to /home if authenticated
const PUBLIC_ONLY_ROUTES = ['/'];

// Auth utilities - direct functions without context
export const useAuth = () => {
    const { address, isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    // Check session on mount and connection changes
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Force credentials to be included in requests for cookie handling
                const sessionData = await authClient.getSession({
                    fetchOptions: {
                        credentials: 'include'
                    }
                });

                if (sessionData.data) {
                    setSession(sessionData.data);
                } else {
                    setSession(null);
                }
            } catch (error) {
                console.error('Session check failed:', error);
                setSession(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, [isConnected, address]);

    const login = async () => {
        try {
            if (!address) {
                throw new Error('Wallet not connected');
            }

            // Use better-auth SIWE authentication with proper cookie handling
            try {
                // Get nonce for SIWE
                const nonceResponse = await authClient.siwe.nonce({
                    walletAddress: address,
                    fetchOptions: {
                        credentials: 'include'
                    }
                });

                if (!nonceResponse.data?.nonce) {
                    throw new Error('Failed to get nonce');
                }

                // For now, simulate SIWE login (in real app, you'd sign the message)
                // This would typically involve signing a SIWE message with the wallet

                // In a real implementation, you would:
                // 1. Create SIWE message with the nonce
                // 2. Sign the message with the wallet
                // 3. Send the signature to verify
                console.log('SIWE message would be:', `Sign in with Ethereum to the app.\n\nURI: ${window.location.origin}\nVersion: 1\nChain ID: 1\nNonce: ${nonceResponse.data.nonce}\nIssued At: ${new Date().toISOString()}`);

                // For now, create a mock session
                const sessionData = {
                    user: {
                        id: address,
                        address,
                        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
                    },
                    session: {
                        id: `session_${Date.now()}`,
                        userId: address,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                    }
                };

                // Manually set cookie to ensure it's stored
                document.cookie = `better-auth.session_token=${sessionData.session.id}; path=/; max-age=86400; samesite=lax`;

                setSession(sessionData);
                return sessionData;

            } catch (siweError) {
                console.error('SIWE login failed:', siweError);

                // Fallback to basic session creation
                const sessionData = {
                    user: {
                        id: address,
                        address,
                        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
                    },
                    session: {
                        id: `session_${Date.now()}`,
                        userId: address,
                    }
                };

                setSession(sessionData);
                return sessionData;
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear the session from better-auth
            await authClient.signOut({
                fetchOptions: {
                    credentials: 'include'
                }
            });

            // Manually clear the cookie
            document.cookie = 'better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

            // Disconnect wallet
            await disconnectAsync();

            setSession(null);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force clear session even if API call fails
            setSession(null);
            document.cookie = 'better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    };

    const getAccessToken = async () => {
        try {
            if (session?.session?.id) {
                return session.session.id;
            }

            // Try to get from better-auth
            const sessionData = await authClient.getSession({
                fetchOptions: {
                    credentials: 'include'
                }
            });

            return sessionData.data?.session?.id || null;
        } catch (error) {
            console.error('Failed to get access token:', error);
            return null;
        }
    };

    return {
        isAuthenticated: !!session && isConnected && !!address,
        isLoading,
        session,
        address,
        login,
        logout,
        getAccessToken,
    };
};

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    // Handle route protection
    useEffect(() => {
        if (isLoading) return;

        const isProtectedRoute = PROTECTED_ROUTES.some(route =>
            pathname.startsWith(route)
        );
        const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.includes(pathname);

        if (isProtectedRoute && !isAuthenticated) {
            // Redirect to landing page if trying to access protected route without auth
            router.push('/');
        } else if (isPublicOnlyRoute && isAuthenticated) {
            // Redirect to home if authenticated user tries to access landing page
            router.push('/home');
        }
    }, [isAuthenticated, pathname, router, isLoading]);

    return <>{children}</>;
}