import React, { useState } from 'react';
import { recoverSecret, rotateWords } from '../utils/logic';
import { RotateIcon, CheckIcon, CopyIcon } from './Icons';

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

    const outcome = recoverSecret(shares);
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
    <div className="space-y-8 animate-fade-in">
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-purple-200 text-sm">
           <strong>Recovery:</strong> Paste your shards below. The system automatically detects the scheme and word count. You usually need 2 or 3 shards depending on the strategy used.
        </div>

      <div className="space-y-4">
        {shares.map((s, idx) => (
            <div key={idx} className="relative group">
                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-tight">
                    Share #{idx + 1}
                </label>
                <div className="relative">
                    <textarea
                        value={s}
                        onChange={(e) => updateShare(idx, e.target.value)}
                        placeholder={`Paste shard ${idx + 1} here...`}
                        className="w-full h-24 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent font-mono outline-none resize-none transition-all"
                        spellCheck={false}
                    />
                    {shares.length > 2 && (
                        <button 
                            onClick={() => removeShareField(idx)}
                            className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        ))}

        {shares.length < 4 && (
            <button 
                onClick={addShareField}
                className="w-full py-2 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all text-sm font-medium"
            >
                + Add Another Shard
            </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        {error && <p className="mb-4 text-sm text-red-400 bg-red-900/20 px-4 py-2 rounded border border-red-900/50">{error}</p>}
        <button
          onClick={handleRecover}
          className="w-full md:w-1/2 bg-primary hover:bg-primaryHover text-white font-bold py-4 px-6 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          Reconstruct Seed Phrase
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-surface rounded-2xl border border-primary/40 shadow-2xl overflow-hidden transition-all duration-500 ease-out transform translate-y-0 opacity-100">
          <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-primary font-bold text-lg flex items-center gap-2">
                <CheckIcon className="w-5 h-5" />
                Successfully Recovered ({result.length} words)
            </h3>
            <div className="flex gap-2">
                <button
                    onClick={handleRotate}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
                    title="Rotate sequence if words are in the wrong order"
                >
                    <RotateIcon className="w-4 h-4" /> Rotate
                </button>
                 <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white transition-colors"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
          </div>
          <div className="p-6 bg-slate-900/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 font-mono">
              {result.map((word, idx) => (
                <div key={idx} className="flex items-center bg-slate-900/80 rounded-lg p-3 border border-slate-700/50 shadow-inner">
                  <span className="text-slate-600 mr-3 w-5 text-right select-none text-xs font-bold">{idx + 1}.</span>
                  <span className="text-white font-medium">{word}</span>
                </div>
              ))}
            </div>
             <p className="mt-6 text-xs text-center text-slate-500 italic">
                Verified: This phrase matches a standard mnemonic length.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};