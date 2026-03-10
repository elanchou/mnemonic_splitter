import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Download, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GeneratedWallet {
  index: number;
  address: string;
  mnemonic: string;
  privateKey: string;
}

export function MultiWallet() {
  const [wallets, setWallets] = useState<GeneratedWallet[]>([]);
  const [count, setCount] = useState<number>(5);
  const [words, setWords] = useState<12 | 24>(12);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateWallets = async () => {
    setIsGenerating(true);
    // Use setTimeout to allow UI to update before heavy synchronous generation
    setTimeout(() => {
      const newWallets: GeneratedWallet[] = [];
      const entropySize = words === 12 ? 16 : 32;

      for (let i = 0; i < count; i++) {
        const entropy = ethers.randomBytes(entropySize);
        const mnemonicObj = ethers.Mnemonic.fromEntropy(entropy);
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj);
        
        newWallets.push({
          index: i + 1,
          address: wallet.address,
          mnemonic: wallet.mnemonic!.phrase,
          privateKey: wallet.privateKey,
        });
      }
      setWallets(newWallets);
      setIsGenerating(false);
    }, 50);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadCSV = () => {
    if (wallets.length === 0) return;
    
    const headers = ['Index', 'Address', 'Mnemonic', 'Private Key'];
    const csvContent = [
      headers.join(','),
      ...wallets.map(w => `${w.index},${w.address},"${w.mnemonic}",${w.privateKey}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wallets_${count}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-widest mb-2">
            MULTI-WALLET
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            Batch generate secure cryptocurrency wallets offline.
          </p>
        </div>
      </div>

      <div className="border border-neutral-800 bg-[#111] p-6">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
              Number of Wallets
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          
          <div className="flex-1 w-full">
            <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
              Mnemonic Length
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setWords(12)}
                className={`flex-1 p-3 border transition-colors ${
                  words === 12 ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-500 hover:text-white'
                }`}
              >
                12 WORDS
              </button>
              <button
                onClick={() => setWords(24)}
                className={`flex-1 p-3 border transition-colors ${
                  words === 24 ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-[#0a0a0a] border-neutral-800 text-neutral-500 hover:text-white'
                }`}
              >
                24 WORDS
              </button>
            </div>
          </div>

          <button
            onClick={generateWallets}
            disabled={isGenerating}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            GENERATE
          </button>
        </div>
      </div>

      {wallets.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-neutral-800 bg-[#111] flex flex-col"
        >
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1a1a1a]">
            <div className="text-xs text-neutral-500 uppercase tracking-widest">
              Generated {wallets.length} Wallets
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-neutral-500 uppercase tracking-widest bg-[#0a0a0a]">
                <tr>
                  <th className="p-4 font-normal border-b border-neutral-800 w-16">#</th>
                  <th className="p-4 font-normal border-b border-neutral-800">Address</th>
                  <th className="p-4 font-normal border-b border-neutral-800">Mnemonic</th>
                  <th className="p-4 font-normal border-b border-neutral-800">Private Key</th>
                  <th className="p-4 font-normal border-b border-neutral-800 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {wallets.map((wallet, idx) => (
                  <tr key={idx} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4 text-neutral-500">{wallet.index}</td>
                    <td className="p-4 font-mono text-neutral-300">{wallet.address}</td>
                    <td className="p-4 font-mono text-neutral-400 truncate max-w-[200px]" title={wallet.mnemonic}>
                      {wallet.mnemonic}
                    </td>
                    <td className="p-4 font-mono text-neutral-500 truncate max-w-[150px]" title={wallet.privateKey}>
                      {wallet.privateKey.substring(0, 10)}...{wallet.privateKey.substring(wallet.privateKey.length - 8)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => copyToClipboard(`${wallet.address}\n${wallet.mnemonic}\n${wallet.privateKey}`, idx)}
                        className="text-neutral-500 hover:text-white transition-colors p-2"
                        title="Copy all details"
                      >
                        {copiedIndex === idx ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
