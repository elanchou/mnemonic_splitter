import React, { useState } from 'react';
import { validateInput, splitSecret } from '../utils/logic';
import { Share, SplitScheme } from '../types';
import { ShareDisplay } from './ShareDisplay';
import { motion } from 'framer-motion';
import { Split } from 'lucide-react';

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        
        {/* Scheme Selector */}
        <div className="border-b border-neutral-800 pb-8">
            <label className="block text-xs font-medium text-neutral-500 mb-4 uppercase tracking-widest">
                Select Splitting Strategy
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: SplitScheme.TWO_OF_TWO, label: '2-of-2', desc: 'Simple split. Both required.' },
                    { id: SplitScheme.TWO_OF_THREE, label: '2-of-3', desc: 'Standard overlap. Any 2/3.' },
                    { id: SplitScheme.THREE_OF_FOUR, label: '3-of-4', desc: 'Advanced. Higher redundancy.' },
                ].map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setScheme(s.id)}
                        className={`p-4 border text-left transition-all relative ${
                            scheme === s.id 
                            ? 'border-red-600 bg-red-600/5 text-white' 
                            : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                        }`}
                    >
                        {scheme === s.id && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-red-600"></div>
                        )}
                        <div className="font-bold text-sm mb-2 uppercase tracking-widest">{s.label}</div>
                        <div className="text-xs opacity-80 uppercase tracking-wider">{s.desc}</div>
                    </button>
                ))}
            </div>
        </div>

        <div className="border-b border-neutral-800 pb-8">
          <div className="flex justify-between items-end mb-4">
            <label className="block text-xs font-medium text-neutral-500 uppercase tracking-widest">
              Original Mnemonic Phrase
            </label>
            <span className="text-xs text-neutral-600 uppercase tracking-widest">
              {input.trim() ? input.trim().split(/\s+/).length : 0} Words
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="PASTE YOUR SEED PHRASE HERE..."
            className="w-full h-32 bg-[#0a0a0a] border border-neutral-800 p-4 text-white placeholder-neutral-700 focus:border-red-600 font-mono outline-none resize-none transition-colors uppercase text-sm tracking-widest"
            spellCheck={false}
          />
          {error && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mt-4 text-xs text-red-500 uppercase tracking-widest"
            >
              {error}
            </motion.p>
          )}
        </div>

        <button
          onClick={handleSplit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-3 w-full md:w-auto"
        >
          <Split className="w-4 h-4" />
          Generate {scheme} Shards
        </button>
      </div>

      {shares && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="pt-8 border-t border-neutral-800"
        >
            <div className="flex items-center justify-between mb-6">
                <span className="text-white text-sm uppercase tracking-widest font-bold">Generated Shards</span>
                <span className="text-red-500 text-xs uppercase tracking-widest border border-red-500/30 px-3 py-1 bg-red-500/10">{shares.length} Total</span>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shares.map((share, index) => (
              <motion.div key={share.id} variants={item}>
                <ShareDisplay share={share} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};