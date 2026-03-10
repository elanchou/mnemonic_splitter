import React, { useState } from 'react';
import { Tab } from './types';
import { SplitTab } from './components/SplitTab';
import { RecoverTab } from './components/RecoverTab';
import { CryptoUtils } from './components/CryptoUtils';
import { MultiWallet } from './components/MultiWallet';
import { CryptoTools } from './components/CryptoTools';
import { ShieldCheck, Split, Combine, Home, Wallet, Wrench, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

type View = 'SHARDS' | 'MULTI_WALLET' | 'TOOLS';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SPLIT);
  const [currentView, setCurrentView] = useState<View>('SHARDS');

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white font-mono selection:bg-red-500/30">
      {/* Sidebar */}
      <aside className="w-16 border-r border-neutral-800 flex flex-col items-center py-6 gap-8 bg-[#0a0a0a] z-10 shrink-0">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-black font-bold text-xl mb-4">
          M
        </div>
        <nav className="flex flex-col gap-6 w-full items-center">
          <button 
            onClick={() => setCurrentView('SHARDS')}
            className={`w-full flex justify-center py-2 transition-colors border-l-2 ${currentView === 'SHARDS' ? 'text-red-500 border-red-500' : 'text-neutral-500 hover:text-white border-transparent'}`}
            title="Shards (Split/Recover)"
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentView('MULTI_WALLET')}
            className={`w-full flex justify-center py-2 transition-colors border-l-2 ${currentView === 'MULTI_WALLET' ? 'text-red-500 border-red-500' : 'text-neutral-500 hover:text-white border-transparent'}`}
            title="Multi-Wallet Generator"
          >
            <Wallet className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentView('TOOLS')}
            className={`w-full flex justify-center py-2 transition-colors border-l-2 ${currentView === 'TOOLS' ? 'text-red-500 border-red-500' : 'text-neutral-500 hover:text-white border-transparent'}`}
            title="Crypto Tools"
          >
            <Wrench className="w-5 h-5" />
          </button>
        </nav>
        <div className="mt-auto">
          <button className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="border-b border-neutral-800 p-4 flex items-center gap-4 text-xs text-neutral-500 uppercase tracking-widest bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-neutral-600 flex items-center justify-center">
              <div className="w-2 h-2 bg-neutral-600"></div>
            </div>
            <span>HOME</span>
            <span className="text-neutral-700">&gt;</span>
            <span className="text-white">
              {currentView === 'SHARDS' && 'MNEMONIC SHARDS'}
              {currentView === 'MULTI_WALLET' && 'MULTI-WALLET GENERATOR'}
              {currentView === 'TOOLS' && 'CRYPTO TOOLS'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {currentView === 'SHARDS' && (
              <>
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div>
                    <h1 className="text-5xl md:text-6xl font-display uppercase tracking-widest mb-2">
                      SHARDS
                    </h1>
                    <p className="text-neutral-500 text-xs uppercase tracking-widest">
                      Securely split your mnemonic seed phrase.
                    </p>
                  </div>

                  <div className="flex items-center gap-8 text-xs uppercase tracking-widest">
                    <div>
                      <div className="text-neutral-500 mb-1">Active Scheme</div>
                      <div className="text-white text-xl font-display">2-OF-3</div>
                    </div>
                    <div className="h-10 w-px bg-neutral-800"></div>
                    <div>
                      <div className="text-neutral-500 mb-1">Security Level</div>
                      <div className="text-red-500 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> HIGH
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Sidebar / Tabs */}
                  <div className="lg:col-span-3 xl:col-span-2 flex flex-col gap-4">
                    <button
                      onClick={() => setActiveTab(Tab.SPLIT)}
                      className={`p-4 text-left text-xs uppercase tracking-widest border transition-colors flex items-center justify-between ${
                        activeTab === Tab.SPLIT
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-[#111] text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Split className="w-4 h-4" />
                        Split
                      </div>
                      {activeTab === Tab.SPLIT && <span className="text-lg leading-none">+</span>}
                    </button>
                    <button
                      onClick={() => setActiveTab(Tab.RECOVER)}
                      className={`p-4 text-left text-xs uppercase tracking-widest border transition-colors flex items-center justify-between ${
                        activeTab === Tab.RECOVER
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-[#111] text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Combine className="w-4 h-4" />
                        Recover
                      </div>
                      {activeTab === Tab.RECOVER && <span className="text-lg leading-none">+</span>}
                    </button>
                  </div>

                  {/* Main Content Area */}
                  <div className="lg:col-span-6 xl:col-span-7">
                    <div className="border border-neutral-800 p-6 md:p-8 bg-[#111]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {activeTab === Tab.SPLIT ? <SplitTab /> : <RecoverTab />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Right Sidebar / Utilities */}
                  <div className="lg:col-span-3 xl:col-span-3">
                    <CryptoUtils />
                  </div>
                </div>
              </>
            )}

            {currentView === 'MULTI_WALLET' && <MultiWallet />}
            {currentView === 'TOOLS' && <CryptoTools />}
          </div>
        </main>
      </div>
      {typeof window !== 'undefined' && window.location.hostname.includes('vercel.app') && <Analytics />}
    </div>
  );
}

export default App;