import React, { useState } from 'react';
import { recoverSecret, rotateWords } from '../utils/logic';
import { RotateIcon, CheckIcon, CopyIcon } from './Icons';

export const RecoverTab: React.FC = () => {
  const [shareA, setShareA] = useState('');
  const [shareB, setShareB] = useState('');
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRecover = () => {
    setError(null);
    setResult(null);

    const outcome = recoverSecret(shareA, shareB);
    if (outcome.success) {
      setResult(outcome.words);
    } else {
      setError(outcome.error || "Recovery failed.");
    }
  };

  const handleRotate = () => {
    if (result) {
      setResult(rotateWords(result));
    }
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
           <strong>Recovery:</strong> Paste any 2 of your shards below. The system will detect the overlap and reconstruct the original sequence.
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            First Share
          </label>
          <textarea
            value={shareA}
            onChange={(e) => setShareA(e.target.value)}
            placeholder="Paste first share here..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent font-mono outline-none resize-none"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Second Share
          </label>
          <textarea
            value={shareB}
            onChange={(e) => setShareB(e.target.value)}
            placeholder="Paste second share here..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent font-mono outline-none resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        {error && <p className="mb-4 text-sm text-red-400 bg-red-900/20 px-4 py-2 rounded border border-red-900/50">{error}</p>}
        <button
          onClick={handleRecover}
          className="w-full md:w-1/3 bg-primary hover:bg-primaryHover text-white font-bold py-3 px-6 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          Reconstruct Secret
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-surface rounded-xl border border-primary/50 shadow-2xl overflow-hidden">
          <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex justify-between items-center">
            <h3 className="text-primary font-bold text-lg flex items-center gap-2">
                <CheckIcon className="w-5 h-5" />
                Recovered Mnemonic ({result.length} words)
            </h3>
            <div className="flex gap-2">
                <button
                    onClick={handleRotate}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
                    title="Rotate sequence if the order seems offset"
                >
                    <RotateIcon className="w-3 h-3" /> Rotate Order
                </button>
                 <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-xs text-white transition-colors"
                >
                    {copied ? <CheckIcon className="w-3 h-3 text-green-400" /> : <CopyIcon className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 font-mono">
              {result.map((word, idx) => (
                <div key={idx} className="flex items-center bg-slate-900 rounded p-3 border border-slate-700/50">
                  <span className="text-slate-500 mr-3 w-5 text-right select-none text-sm">{idx + 1}.</span>
                  <span className="text-white font-medium">{word}</span>
                </div>
              ))}
            </div>
             <p className="mt-4 text-xs text-center text-slate-500">
                If the words look correct but the order is wrong (e.g. starts with middle words), click "Rotate Order".
            </p>
          </div>
        </div>
      )}
    </div>
  );
};