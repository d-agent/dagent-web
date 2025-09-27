"use client"

import { useRouter } from "next/navigation";
import { YourAgents } from "@/components/agents/your-agents";

export default function AgentsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
           
          </div>
          
          <button
            onClick={() => router.push('/agents/add-agents')}
            className="group relative px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transform hover:-translate-y-1 flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span className="relative z-10">Create Agent</span>
          </button>
        </div>

        {/* Agents Grid */}
        <div className="w-full">
          <YourAgents />
        </div>
      </div>
    </div>
  );
}