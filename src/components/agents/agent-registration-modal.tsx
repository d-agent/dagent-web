"use client";

import React, { useState } from 'react';
import { IconX, IconGlobe, IconLock, IconCheck, IconAlertTriangle } from '@tabler/icons-react';

interface AgentInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  llmProvider: string;
  llmModel: string;
  costPerToken: number;
  author: string;
  category: string;
}

interface AgentRegistrationModalProps {
  agent: AgentInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (agentId: string, visibility: 'public' | 'private', customSettings?: any) => void;
}

export const AgentRegistrationModal: React.FC<AgentRegistrationModalProps> = ({
  agent,
  isOpen,
  onClose,
  onRegister
}) => {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [customName, setCustomName] = useState('');
  const [maxCost, setMaxCost] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState<'configure' | 'confirm' | 'success'>('configure');

  const handleRegister = async () => {
    if (!agent) return;
    
    setIsRegistering(true);
    setStep('confirm');
    
    // Simulate registration process
    setTimeout(() => {
      onRegister(agent.id, visibility, {
        customName: customName || agent.name,
        maxCost: maxCost ? parseFloat(maxCost) : undefined
      });
      setStep('success');
      setIsRegistering(false);
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        setStep('configure');
        setCustomName('');
        setMaxCost('');
        setVisibility('public');
      }, 2000);
    }, 1500);
  };

  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card/95 border border-border/30 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <IconCheck size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-light text-white">Register Agent</h2>
                <p className="text-muted-foreground text-sm">{agent.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <IconX size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'configure' && (
            <div className="space-y-6">
              {/* Agent Summary */}
              <div className="bg-white/5 p-4 rounded-lg border border-border/30">
                <h3 className="text-sm font-light text-white mb-3">Agent Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="text-white ml-2">{agent.llmProvider}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Model:</span>
                    <span className="text-white ml-2">{agent.llmModel}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost/Token:</span>
                    <span className="text-primary ml-2">${agent.costPerToken}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-white ml-2">{agent.category}</span>
                  </div>
                </div>
              </div>

              {/* Visibility Settings */}
              <div>
                <h3 className="text-sm font-light text-white mb-3">Visibility Settings</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setVisibility('public')}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      visibility === 'public'
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border/30 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconGlobe size={16} className={visibility === 'public' ? 'text-primary' : 'text-muted-foreground'} />
                      <span className={`font-light ${visibility === 'public' ? 'text-primary' : 'text-white'}`}>
                        Public Agent
                      </span>
                      {visibility === 'public' && <IconCheck size={16} className="text-primary ml-auto" />}
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Make this agent available to all users on the platform. Others can discover and use it.
                    </p>
                  </button>

                  <button
                    onClick={() => setVisibility('private')}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      visibility === 'private'
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-border/30 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconLock size={16} className={visibility === 'private' ? 'text-primary' : 'text-muted-foreground'} />
                      <span className={`font-light ${visibility === 'private' ? 'text-primary' : 'text-white'}`}>
                        Private Agent
                      </span>
                      {visibility === 'private' && <IconCheck size={16} className="text-primary ml-auto" />}
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">
                      Keep this agent private to your account. Only you can access and use it.
                    </p>
                  </button>
                </div>
              </div>

              {/* Custom Settings */}
              <div>
                <h3 className="text-sm font-light text-white mb-3">Custom Settings (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Custom Name</label>
                    <input
                      type="text"
                      placeholder={agent.name}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/5 border border-border/30 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Max Cost Limit ($)</label>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={maxCost}
                      onChange={(e) => setMaxCost(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2.5 bg-white/5 border border-border/30 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <IconAlertTriangle size={16} className="text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-400 text-sm font-light">Important Notice</p>
                    <p className="text-amber-300/80 text-xs mt-1">
                      By registering this agent, you agree to the usage terms and understand that costs will be incurred based on token usage. 
                      Monitor your usage regularly to avoid unexpected charges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'confirm' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
              <h3 className="text-lg font-light text-white mb-2">Registering Agent</h3>
              <p className="text-muted-foreground text-sm">Setting up your agent configuration...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <IconCheck size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-light text-white mb-2">Agent Registered Successfully!</h3>
              <p className="text-muted-foreground text-sm">
                {agent.name} has been registered as a {visibility} agent.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'configure' && (
          <div className="p-6 border-t border-border/30 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
            >
              Cancel
            </button>
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="px-6 py-2.5 bg-primary/20 text-primary border border-primary/30 rounded-lg font-light hover:bg-primary/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Register Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
};