"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconRobot, IconWallet, IconCode, IconShield, IconTrendingUp, IconBolt, IconUsers, IconCheck } from "@tabler/icons-react";
import LoginWithEthereum from "@/components/siew";
import { CodeBlock } from "@/components/ui/code-block";

const features = [
  {
    icon: <IconRobot className="w-6 h-6" />,
    title: "AI Agent Development",
    description: "Build powerful AI agents with our ADK framework or integrate with LangGraph for complex workflows."
  },
  {
    icon: <IconWallet className="w-6 h-6" />,
    title: "Web3 Integration",
    description: "Native wallet connectivity with Ethereum, Polygon, and other EVM chains for seamless transactions."
  },
  {
    icon: <IconCode className="w-6 h-6" />,
    title: "API Management",
    description: "Comprehensive API key management with usage tracking, permissions, and detailed analytics."
  },
  {
    icon: <IconShield className="w-6 h-6" />,
    title: "Secure Authentication",
    description: "Sign-in with Ethereum (SIWE) for secure, decentralized authentication without passwords."
  },
  {
    icon: <IconTrendingUp className="w-6 h-6" />,
    title: "Staking & Rewards",
    description: "Stake ETH to power your agents and earn rewards based on performance and usage."
  },
  {
    icon: <IconBolt className="w-6 h-6" />,
    title: "Real-time Analytics",
    description: "Monitor agent performance, token usage, and API costs with detailed dashboards."
  }
];

const pricingTiers = [
  {
    name: "Developer",
    price: "Free",
    description: "Perfect for getting started with AI agents",
    features: [
      "Up to 3 agents",
      "1,000 API calls/month",
      "Basic analytics",
      "Community support",
      "ADK framework access"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "$29/month",
    description: "For serious developers and small teams",
    features: [
      "Up to 25 agents",
      "100,000 API calls/month",
      "Advanced analytics",
      "Priority support",
      "All frameworks",
      "Custom integrations"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large teams and organizations",
    features: [
      "Unlimited agents",
      "Unlimited API calls",
      "Custom analytics",
      "24/7 dedicated support",
      "On-premise deployment",
      "Custom SLAs"
    ],
    popular: false
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"adk" | "langgraph">("adk");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Your All In One Marketplace for{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  AI and Blockchain
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Create, deploy, and monetize intelligent AI agents with built-in wallet integration,
                staking mechanisms, and comprehensive analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
                <LoginWithEthereum />
              </div>
              <Link
                href="/framework"
                className="px-8 py-3 border border-border rounded-lg hover:bg-secondary/10 transition-colors font-medium"
              >
                View Documentation
              </Link>
            </div>

            <div className="pt-8">
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>1,200+ Agents Deployed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>$2.4M+ ETH Staked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>50K+ API Calls Daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need to build AI agents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From development frameworks to analytics, we provide all the tools
              to create powerful Web3-enabled AI agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Choose Your Development Framework
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build with our lightweight ADK or integrate complex workflows with LangGraph.
            </p>
          </div>

          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("adk")}
                className={cn(
                  "flex-1 px-6 py-4 text-sm font-medium transition-colors",
                  activeTab === "adk"
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Agent Development Kit (ADK)
              </button>
              <button
                onClick={() => setActiveTab("langgraph")}
                className={cn(
                  "flex-1 px-6 py-4 text-sm font-medium transition-colors",
                  activeTab === "langgraph"
                    ? "bg-primary/10 text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                LangGraph Integration
              </button>
            </div>

            <div className="p-6">
              {activeTab === "adk" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Lightweight & Fast</h3>
                    <p className="text-muted-foreground">
                      Perfect for developers who need fine-grained control over agent behavior
                      with minimal overhead and maximum flexibility.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Modular architecture</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Built-in Web3 integration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Comprehensive testing tools</span>
                      </li>
                    </ul>
                  </div>
                  <CodeBlock
                    language="typescript"
                    filename="agent.ts"
                    code={`import { ADK } from '@web3/agent-sdk'

const agent = new ADK.Agent({
  name: 'TradingBot',
  description: 'AI trading assistant',
  capabilities: ['wallet-integration'],
  auth: {
    type: 'wallet',
    chains: ['ethereum', 'polygon']
  }
})

// Add tools and skills
agent.addTool(new ADK.Tools.WalletConnector())
agent.addSkill(new ADK.Skills.MarketAnalyzer())

export default agent`}
                  />
                </div>
              )}

              {activeTab === "langgraph" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Complex Workflows</h3>
                    <p className="text-muted-foreground">
                      Build sophisticated multi-agent systems with visual workflow designer
                      and state management across reasoning chains.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Visual workflow designer</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Multi-agent collaboration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <IconCheck className="w-4 h-4 text-green-500" />
                        <span>Advanced state management</span>
                      </li>
                    </ul>
                  </div>
                  <CodeBlock
                    language="typescript"
                    filename="workflow.ts"
                    code={`import { LangGraph } from '@web3/langgraph'

const workflow = new LangGraph.Workflow({
  name: 'Trading Assistant',
  description: 'Multi-step trading workflow'
})

// Define agent workflow
workflow.addNode('analysis', MarketAnalysisAgent)
workflow.addNode('risk', RiskEvaluationAgent)
workflow.addNode('execution', TradingAgent)

// Connect workflow steps
workflow.addEdge('analysis', 'risk')
workflow.addEdge('risk', 'execution')

export default workflow`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include our core features
              and Web3 integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={cn(
                  "relative bg-card/30 backdrop-blur-sm border rounded-lg p-8",
                  tier.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border hover:border-primary/20"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{tier.price}</div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <IconCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={cn(
                    "w-full py-3 px-4 rounded-lg font-medium transition-colors",
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to build the future of AI?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers building intelligent agents with Web3 integration.
                Connect your wallet and start building today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
                <LoginWithEthereum />
              </div>
              <Link
                href="/framework"
                className="px-8 py-3 border border-border rounded-lg hover:bg-secondary/10 transition-colors font-medium"
              >
                Explore Frameworks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/framework" className="hover:text-foreground transition-colors">Frameworks</Link></li>
                <li><Link href="/add-agents" className="hover:text-foreground transition-colors">Add Agents</Link></li>
                <li><Link href="/api-manage" className="hover:text-foreground transition-colors">API Management</Link></li>
                <li><Link href="/wallet" className="hover:text-foreground transition-colors">Wallet</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-foreground transition-colors">Examples</Link></li>
                <li><Link href="/api-docs" className="hover:text-foreground transition-colors">API Reference</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <Image
                src="/globe.svg"
                alt="DAgents Logo"
                width={24}
                height={24}
                className="dark:invert"
              />
              <span className="font-semibold text-primary">DAgents</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DAgents. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
