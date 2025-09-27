"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = [
    '/home',
    '/framework',
    '/docs',
    '/api-manage',
    '/add-agents',
    '/wallet',
    '/dashboard'
];

// Routes that should redirect to /home if authenticated
const PUBLIC_ONLY_ROUTES = ['/'];

export function AuthProvider({ children }: AuthProviderProps) {
    const { address, isConnected } = useAccount();
    const { disconnectAsync } = useDisconnect();
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Update authentication state based on wallet connection
    useEffect(() => {
        setIsAuthenticated(isConnected && !!address);
        setIsLoading(false);
    }, [isConnected, address]);

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

    const login = async () => {
        // The actual login logic is handled by the LoginWithEthereum component
        // This is just a placeholder for any additional login logic
    };

    const logout = async () => {
        try {
            await disconnectAsync();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value: AuthContextType = {
        isAuthenticated,
        isLoading,
        login,
        logout,
        address,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}