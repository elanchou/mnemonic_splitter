import React, { useState } from 'react';
import { Tab } from './types';
import { SplitTab } from './components/SplitTab';
import { RecoverTab } from './components/RecoverTab';
import { ShieldIcon, SplitIcon, MergeIcon } from './components/Icons';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SPLIT);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-emerald-700 rounded-2xl shadow-xl shadow-emerald-900/30">
                <ShieldIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
            Mnemonic Shards
          </h1>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Securely split your mnemonic seed phrase into 3 overlapping parts. Supports 12, 15, 18, 21, and 24 words.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-surface rounded-2xl border border-slate-800 p-1 mb-8 flex shadow-lg w-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab(Tab.SPLIT)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === Tab.SPLIT
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <SplitIcon className="w-4 h-4" />
            Split Secret
          </button>
          <button
            onClick={() => setActiveTab(Tab.RECOVER)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === Tab.RECOVER
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MergeIcon className="w-4 h-4" />
            Recover Secret
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-surface/50 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm">
          {activeTab === Tab.SPLIT ? <SplitTab /> : <RecoverTab />}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600">
          <p>This tool runs entirely in your browser. No data is sent to any server.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;