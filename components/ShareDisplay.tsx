import React, { useState } from 'react';
import { Share } from '../types';
import { Copy, Check } from 'lucide-react';

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
    <div className="border border-neutral-800 flex flex-col h-full group bg-[#0a0a0a] relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-neutral-800 group-hover:bg-red-600 transition-colors"></div>
      <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-[#111] pl-5">
        <div className="flex items-center gap-3">
          <span className="text-red-500 text-xs font-bold border border-red-500/30 px-2 py-1 bg-red-500/10">
            {share.id}
          </span>
          <h3 className="text-white font-bold tracking-widest uppercase text-xs">{share.label}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-neutral-500 hover:text-red-500 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-4 pl-5 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
        {share.words.map((word, idx) => (
          <div key={idx} className="flex items-center border border-neutral-800 px-2 py-1.5 bg-[#111]">
            <span className="text-neutral-600 mr-2 w-4 text-right select-none">{idx + 1}.</span>
            <span className="text-neutral-300 uppercase tracking-wider">{word}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 pl-5 border-t border-neutral-800 bg-[#111]">
        <p className="text-xs text-neutral-500 uppercase tracking-widest">
          Contains <strong className="text-white">{share.words.length}</strong> words.
        </p>
      </div>
    </div>
  );
};