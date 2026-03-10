import React, { useState } from 'react';
import { recoverSecret, rotateWords } from '../utils/logic';
import { RotateCw, Check, Copy, X, Combine, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RecoverTab: React.FC = () => {
  const [shares, setShares] = useState<string[]>(['', '']);
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addShareField = () => {
    if (shares.length < 4) setShares([...shares, '']);
  };

  const removeShareField = (index: number) => {
    if (shares.length > 2) {
        const next = [...shares];
        next.splice(index, 1);
        setShares(next);
    }
  };

  const updateShare = (index: number, val: string) => {
    const next = [...shares];
    next[index] = val;
    setShares(next);
  };

  const handleRecover = () => {
    setError(null);
    setResult(null);

    const validShares = shares.filter(s => s.trim().length > 0);
    if (validShares.length < 2) {
      setError('At least 2 shares are required for recovery');
      return;
    }

    const outcome = recoverSecret(validShares);
    if (outcome.success) {
      setResult(outcome.words);
    } else {
      setError(outcome.error || "Recovery failed.");
    }
  };

  const handleRotate = () => {
    if (result) setResult(rotateWords(result));
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.join(' '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border border-neutral-800 p-4 text-neutral-400 text-xs uppercase tracking-widest leading-relaxed bg-[#0a0a0a]">
        <span className="text-red-500 font-bold mr-2">RECOVERY:</span> 
        Paste your shards below. The system automatically detects the scheme and word count. You usually need 2 or 3 shards depending on the strategy used.
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {shares.map((s, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative group border border-neutral-800 p-4 bg-[#0a0a0a]"
              >
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest">
                        Share #{idx + 1}
                    </label>
                    {shares.length > 2 && (
                        <button 
                            onClick={() => removeShareField(idx)}
                            className="text-neutral-600 hover:text-red-500 transition-colors text-xs uppercase tracking-widest flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Remove
                        </button>
                    )}
                  </div>
                  <textarea
                      value={s}
                      onChange={(e) => updateShare(idx, e.target.value)}
                      placeholder={`PASTE SHARD ${idx + 1} HERE...`}
                      className="w-full h-24 bg-[#111] border border-neutral-800 p-4 text-white placeholder-neutral-700 focus:border-red-600 font-mono outline-none resize-none transition-colors uppercase text-sm tracking-widest"
                      spellCheck={false}
                  />
              </motion.div>
          ))}
        </AnimatePresence>

        {shares.length < 4 && (
            <button 
                onClick={addShareField}
                className="w-full py-4 border border-dashed border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-600 transition-colors text-xs font-bold uppercase tracking-widest bg-[#0a0a0a]"
            >
                + Add Another Shard
            </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 border border-red-900/50 bg-red-900/10 text-red-500 text-xs flex items-center gap-2 uppercase tracking-widest"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 border-t border-neutral-800">
        <button
          onClick={handleRecover}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-3 w-full md:w-auto"
        >
          <Combine className="w-4 h-4" />
          Reconstruct Seed Phrase
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-8 border border-neutral-800 bg-[#0a0a0a] relative"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <div className="bg-[#111] px-6 py-4 border-b border-neutral-800 flex justify-between items-center pl-8">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-3">
                  Successfully Recovered
                  <span className="text-neutral-500 text-xs">({result.length} words)</span>
              </h3>
              <div className="flex items-center gap-3">
                  <button
                      onClick={handleRotate}
                      className="flex items-center gap-2 px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
                      title="Rotate sequence if words are in the wrong order"
                  >
                      <RotateCw className="w-3 h-3" /> Rotate
                  </button>
                  <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-3 py-1.5 border border-red-600 bg-red-600/10 hover:bg-red-600/20 text-xs text-red-500 transition-colors uppercase tracking-wider"
                  >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                  </button>
              </div>
            </div>
            <div className="p-6 pl-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 font-mono text-xs">
                {result.map((word, idx) => (
                  <div key={idx} className="flex items-center border border-neutral-800 p-2 bg-[#111]">
                    <span className="text-neutral-600 mr-3 w-5 text-right select-none">{idx + 1}.</span>
                    <span className="text-white uppercase tracking-wider">{word}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-neutral-500 uppercase tracking-widest border-t border-neutral-800 pt-4">
                  Verified: This phrase matches a standard mnemonic length.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};