"use client"
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function Home() {
      const { address, chainId, isConnected } = useAccount()
      const router= useRouter()

 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex min-h-screen items-center justify-center p-4">   </div>
    </div>
  );
}
