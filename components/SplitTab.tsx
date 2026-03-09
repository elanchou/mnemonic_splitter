import React, { useState } from 'react';
import { validateInput, splitSecret } from '../utils/logic';
import { Share, SplitScheme } from '../types';
import { ShareDisplay } from './ShareDisplay';

export const SplitTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [scheme, setScheme] = useState<SplitScheme>(SplitScheme.TWO_OF_THREE);
  const [shares, setShares] = useState<Share[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = () => {
    setError(null);
    setShares(null);

    const validation = validateInput(input, scheme);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    try {
      const generatedShares = splitSecret(validation.words, scheme);
      setShares(generatedShares);
    } catch (e) {
      setError("An unexpected error occurred while splitting.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-6">
        
        {/* Scheme Selector */}
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-3">
                Select Splitting Strategy
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                    { id: SplitScheme.TWO_OF_TWO, label: '2-of-2', desc: 'Simple split. Both required.' },
                    { id: SplitScheme.TWO_OF_THREE, label: '2-of-3', desc: 'Standard overlap. Any 2/3.' },
                    { id: SplitScheme.THREE_OF_FOUR, label: '3-of-4', desc: 'Advanced. Higher redundancy.' },
                ].map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setScheme(s.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                            scheme === s.id 
                            ? 'bg-primary/10 border-primary text-white ring-2 ring-primary/20' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                    >
                        <div className="font-bold text-sm mb-1">{s.label}</div>
                        <div className="text-xs opacity-70">{s.desc}</div>
                    </button>
                ))}
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Original Mnemonic Phrase
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your seed phrase here..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent font-mono outline-none resize-none transition-all"
            spellCheck={false}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <button
          onClick={handleSplit}
          className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
          Generate {scheme} Shards
        </button>
      </div>

      {shares && (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Generated Shards</span>
                <div className="h-px bg-slate-700 flex-1"></div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shares.map(share => (
              <ShareDisplay key={share.id} share={share} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};