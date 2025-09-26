"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
    NavbarButton
} from "@/components/ui/resizable-navbar";
import LoginWithEthereum from "./siew";
import { useAccount } from "wagmi";

// Navigation items
const navItems = [
    {
        name: "Home",
        link: "/",
    },
    {
        name: "Frameworks",
        link: "/framework",
    },
    {
        name: "Documentation",
        link: "/docs",
    },
    {
        name: "Wallets",
        link: "/wallet",
    },
    {
        name: "API Keys",
        link: "/api-manage",
    },
    {
        name: "Add Agents",
        link: "/add-agents",
    },
];

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
      const { address, isConnected } = useAccount();


    return (
        <>
            <Navbar>
                <NavBody>
                    {/* Left side - Logo */}
                    <div className="relative z-20">
                        <Link href="/" className="flex items-center gap-2 px-2">
                            <Image
                                src="/globe.svg"
                                alt="Logo"
                                width={28}
                                height={28}
                                className="dark:invert"
                            />
                            <span className="font-semibold text-lg text-primary">AgentHub</span>
                        </Link>
                    </div>

                    {/* Center - Navigation Items */}
                    <NavItems items={navItems} />

                    {/* Right side - Auth button */}
                    <div className="relative z-20 flex items-center gap-2">
                        {isConnected && (
                            <NavbarButton variant="secondary" href="/dashboard" className="hidden sm:inline-block">
                                Dashboard
                            </NavbarButton>
                        )}
                        {!isConnected && (
                            <NavbarButton variant="primary" className="hidden text-white sm:inline-block bg-slate-700">
                                <LoginWithEthereum />
                            </NavbarButton>
                        )}
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/globe.svg"
                                alt="Logo"
                                width={24}
                                height={24}
                                className="dark:invert"
                            />
                            <span className="font-semibold text-primary">AgentHub</span>
                        </Link>
                        <MobileNavToggle
                            isOpen={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                        <div className="flex w-full flex-col space-y-2 pb-4">
                            {navItems.map((item, idx) => (
                                <Link
                                    key={`mobile-link-${idx}`}
                                    href={item.link}
                                    className={`w-full rounded-md px-4 py-2 text-sm transition-colors ${pathname === item.link
                                            ? "bg-secondary text-secondary-foreground"
                                            : "hover:bg-secondary/80"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-border">
                                {isConnected && (
                                    <Link
                                        href="/dashboard"
                                        className="w-full rounded-md px-4 py-2 text-sm transition-colors hover:bg-secondary/80"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {!isConnected && (
                                    <NavbarButton variant="primary" className="w-full text-center bg-slate-700 text-white">
                                        <LoginWithEthereum/>
                                    </NavbarButton>
                                )}
                            </div>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </>
    );
}