"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import LoginWithEthereum from "./siew";
import { useAccount, useDisconnect } from "wagmi";
import { useAuth } from "./auth-provider";

// Navigation items
const navItems = [
  {
    name: "Home",
    link: "/home",
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
    name: "API Keys",
    link: "/api-manage",
  },
  {
    name: "Agents",
    link: "/agents",
  },

  {
    name: "Wallets",
    link: "/wallet",
  },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (err) {
      console.error("disconnect failed", err);
    }
  };

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
              <span className="font-semibold text-lg text-primary">
                AgentHub
              </span>
            </Link>
          </div>

          {/* Center - Navigation Items */}
          <NavItems
            items={navItems}
            currentPath={pathname}
            disabled={!isAuthenticated}
            disabledTooltip="Connect your wallet to access this feature"
          />

          {/* Right side - Auth button */}
          <div className="relative z-20 flex items-center gap-2">
            {isConnected && (
              <NavbarButton
                variant="secondary"
                className="hidden sm:inline-block bg-red-500 hover:bg-red-600"
                onClick={handleDisconnect}
              >
                Logout
              </NavbarButton>
            )}
            {!isConnected && (
              <NavbarButton
                variant="primary"
                className="hidden text-white sm:inline-block bg-slate-700"
              >
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

          <MobileNavMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          >
            <div className="flex w-full flex-col space-y-2 pb-4">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.link;

                if (!isAuthenticated) {
                  return (
                    <div
                      key={`mobile-disabled-link-${idx}`}
                      className="w-full rounded-md px-4 py-2 text-sm transition-colors cursor-not-allowed opacity-50 text-neutral-400 dark:text-neutral-600 relative group"
                      title="Connect your wallet to access this feature"
                    >
                      {item.name}
                    </div>
                  );
                }

                return (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    className={`w-full rounded-md px-4 py-2 text-sm transition-colors ${isActive
                        ? "bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-secondary/80 text-neutral-600 dark:text-neutral-300"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-border">
                {isConnected && (
                  <button
                    className="w-full rounded-md px-4 py-2 text-sm transition-colors  bg-red-500 hover:bg-red-600 "
                    onClick={handleDisconnect}
                  >
                    Logout
                  </button>
                )}

                {!isConnected && (
                  <NavbarButton
                    variant="primary"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full text-center bg-slate-700 text-white"
                  >
                    <LoginWithEthereum />
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
