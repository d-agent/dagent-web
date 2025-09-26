"use client"
import LoginWithEthereum from "@/components/siew";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";

export default function Home() {
      const router= useRouter()
  const { disconnect, disconnectAsync,  } = useDisconnect();
      const handleDisconnect = async () => {
    try {
      await disconnectAsync(); 
      console.log("Disconnected (wagmi)");
      router.push('/')
    } catch (err) {
      console.error("disconnect failed", err);

    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          
          <button onClick={handleDisconnect} className="w-full mb-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
            Disconnect
          </button>
    </div>
  );
}
