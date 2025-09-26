import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CodeBlock } from '@/components/ui/code-block'
import { cn } from '@/lib/utils'

const FrameworkPage = () => {
    return (
        <div className='w-full max-w-[1100px] mx-auto px-4 md:px-6 py-16'>
            {/* Hero Section */}
            <section className='mb-20 space-y-4 text-center'>
                <h1 className='text-3xl md:text-5xl font-bold tracking-tighter'>
                    AI Agent <span className='bg-gradient-to-r from-primary to-[#8055FF] bg-clip-text text-transparent'>Frameworks</span>
                </h1>
                <p className='text-muted-foreground max-w-[750px] mx-auto text-lg'>
                    Build, deploy, and manage AI agents with our suite of frameworks designed for maximum flexibility and performance.
                </p>
            </section>

            {/* Frameworks Overview */}
            <section className='mb-20'>
                <div className='flex flex-col gap-12'>
                    {/* ADK Framework */}
                    <div className='border border-border rounded-lg p-6 space-y-6 hover:border-primary/30 transition-colors'>
                        <div className='flex items-center gap-4'>
                            <div className='w-20 h-12 flex items-center justify-center'>
                                <Image
                                    alt='adk'
                                    src="/agent-development-kit.png"
                                    width={100}
                                    height={100} />
                            </div>
                            <h2 className='text-xl font-semibold'>Agent Development Kit (ADK)</h2>
                        </div>
                        <p className='text-muted-foreground'>
                            A lightweight framework for building, testing, and deploying AI agents with minimal overhead. Perfect for developers who need fine-grained control over agent behavior.
                        </p>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium'>Key features:</h3>
                            <ul className='text-sm text-muted-foreground space-y-1'>
                                <li>• Modular architecture for easy customization</li>
                                <li>• Built-in testing tools for agent behavior</li>
                                <li>• Seamless wallet integration for Web3 functionality</li>
                                <li>• Optimized for both browser and server environments</li>
                            </ul>
                        </div>
                        <CodeBlock
                            language="typescript"
                            filename="agent.ts"
                            code={`import { ADK } from '@web3/agent-sdk'
              
const agent = new ADK.Agent({
  name: 'Web3Assistant',
  description: 'Helps users with Web3 tasks',
  capabilities: ['wallet-integration', 'transaction-history'],
  auth: {
    type: 'wallet',
    chains: ['ethereum', 'polygon']
  }
})

// Add tools and skills
agent.addTool(new ADK.Tools.WalletConnector())
agent.addSkill(new ADK.Skills.TransactionAnalyzer())

export default agent`}
                        />
                        <div className='flex gap-4 items-center pt-2'>
                            <Link href="/docs/adk" className='inline-block text-sm font-medium text-primary hover:underline'>
                                Learn more about ADK →
                            </Link>
                            <Link
                                href="https://github.com/yourusername/adk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:underline'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                View on GitHub
                            </Link>
                        </div>
                    </div>

                    {/* LangGraph Framework */}
                    <div className='border border-border rounded-lg p-6 space-y-6 hover:border-primary/30 transition-colors'>
                        <div className='flex items-center gap-4'>
                            <div className='w-20 h-12 flex items-center justify-center'>
                                <Image
                                    alt='langgraph'
                                    src="https://langchain-ai.github.io/langgraph/static/wordmark_dark.svg"
                                    width={100}
                                    height={100} />
                            </div>
                            <h2 className='text-xl font-semibold'>LangGraph</h2>
                        </div>
                        <p className='text-muted-foreground'>
                            A graph-based framework for creating complex, multi-step AI agent workflows. Ideal for agents that need to perform sequential reasoning or multi-agent collaboration.
                        </p>
                        <div className='space-y-2'>
                            <h3 className='text-sm font-medium'>Key features:</h3>
                            <ul className='text-sm text-muted-foreground space-y-1'>
                                <li>• Visual workflow designer for agent interactions</li>
                                <li>• State management across complex reasoning chains</li>
                                <li>• Support for multiple agents working together</li>
                                <li>• Transparent execution with detailed tracing</li>
                            </ul>
                        </div>
                        <CodeBlock
                            language="typescript"
                            filename="workflow.ts"
                            code={`import { LangGraph } from '@web3/langgraph'

// Define agent workflow as a graph
const workflow = new LangGraph.Workflow({
  name: 'Trading Assistant',
  description: 'Helps analyze and execute crypto trades'
})

// Add nodes to the graph
workflow.addNode('marketAnalysis', MarketAnalysisAgent)
workflow.addNode('riskEvaluation', RiskEvaluationAgent)
workflow.addNode('tradingExecution', TradingExecutionAgent)

// Define the flow between nodes
workflow.addEdge('marketAnalysis', 'riskEvaluation')
workflow.addEdge('riskEvaluation', 'tradingExecution', {
  condition: (output) => output.riskLevel < 0.7
})

export default workflow`}
                        />
                        <div className='flex gap-4 items-center pt-2'>
                            <Link href="/docs/langgraph" className='inline-block text-sm font-medium text-primary hover:underline'>
                                Learn more about LangGraph →
                            </Link>
                            <Link
                                href="https://github.com/langchain-ai/langgraph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className='inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:underline'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                View on GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Framework Comparison */}
            <section className='mb-16'>
                <h2 className='text-2xl font-semibold mb-6'>Choose the right framework</h2>
                <div className='border border-border rounded-lg overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead>
                            <tr className='bg-secondary border-b border-border'>
                                <th className='px-6 py-4 text-left font-medium'>Feature</th>
                                <th className='px-6 py-4 text-left font-medium'>ADK</th>
                                <th className='px-6 py-4 text-left font-medium'>LangGraph</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border-b border-border'>
                                <td className='px-6 py-4'>Complexity</td>
                                <td className='px-6 py-4'>Low</td>
                                <td className='px-6 py-4'>Medium</td>
                            </tr>
                            <tr className='border-b border-border'>
                                <td className='px-6 py-4'>Learning Curve</td>
                                <td className='px-6 py-4'>Minimal</td>
                                <td className='px-6 py-4'>Moderate</td>
                            </tr>
                            <tr className='border-b border-border'>
                                <td className='px-6 py-4'>Use Case</td>
                                <td className='px-6 py-4'>Simple agents, quick prototyping</td>
                                <td className='px-6 py-4'>Complex workflows, multi-agent systems</td>
                            </tr>
                            <tr className='border-b border-border'>
                                <td className='px-6 py-4'>Web3 Integration</td>
                                <td className='px-6 py-4'>Built-in</td>
                                <td className='px-6 py-4'>Via plugins</td>
                            </tr>
                            <tr>
                                <td className='px-6 py-4'>Deployment Complexity</td>
                                <td className='px-6 py-4'>Low</td>
                                <td className='px-6 py-4'>Medium</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Getting Started */}
            <section>
                <div className='bg-secondary/30 border border-border rounded-lg p-8 text-center'>
                    <h2 className='text-2xl font-semibold mb-4'>Ready to build your own agent?</h2>
                    <p className='text-muted-foreground max-w-[500px] mx-auto mb-6'>
                        Get started with our comprehensive documentation and examples to build your first Web3-enabled AI agent in minutes.
                    </p>
                    <div className='flex flex-wrap gap-4 justify-center'>
                        <Link href="/docs" className='px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity'>
                            View Documentation
                        </Link>
                        <Link href="/examples" className='px-5 py-2.5 rounded-md border border-border hover:border-primary/50 transition-colors font-medium'>
                            Explore Examples
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default FrameworkPage