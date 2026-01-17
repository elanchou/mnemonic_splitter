import React, { useState } from 'react';
import { validateInput, splitSecret } from '../utils/logic';
import { Share } from '../types';
import { ShareDisplay } from './ShareDisplay';

export const SplitTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [shares, setShares] = useState<Share[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = () => {
    setError(null);
    setShares(null);

    const validation = validateInput(input);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    try {
      const generatedShares = splitSecret(validation.words);
      setShares(generatedShares);
    } catch (e) {
      setError("An unexpected error occurred while splitting.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-200 text-sm">
           <strong>How it works:</strong> Enter your 12-word mnemonic phrase. We will generate 3 "Shards". Each shard contains 8 words. You can recover your original phrase using <strong>any 2</strong> of these shards.
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Original 12-Word Mnemonic
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="apple banana cherry ..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent font-mono outline-none resize-none"
            spellCheck={false}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <button
          onClick={handleSplit}
          className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          Generate Shares
        </button>
      </div>

      {shares && (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-slate-700 flex-1"></div>
                <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Result</span>
                <div className="h-px bg-slate-700 flex-1"></div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shares.map(share => (
              <ShareDisplay key={share.id} share={share} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};