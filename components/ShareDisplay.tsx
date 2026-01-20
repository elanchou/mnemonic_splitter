import React, { useState } from 'react';
import { Share } from '../types';
import { CopyIcon, CheckIcon } from './Icons';

interface Props {
  share: Share;
}

export const ShareDisplay: React.FC<Props> = ({ share }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(share.words.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface rounded-xl border border-slate-700 p-5 shadow-lg flex flex-col h-full hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                {share.id}
            </span>
            <h3 className="text-slate-200 font-semibold">{share.label}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-secondary hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 font-mono text-sm">
        {share.words.map((word, idx) => (
          <div key={idx} className="flex items-center bg-slate-900/50 rounded px-2 py-1.5 border border-slate-800">
            <span className="text-slate-500 mr-2 w-4 text-right select-none">{idx + 1}.</span>
            <span className="text-slate-200">{word}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
            Contains {share.words.length} words. Any 2 shares can restore the full secret.
        </p>
      </div>
    </div>
  );
};