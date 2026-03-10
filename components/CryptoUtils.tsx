import React, { useState } from 'react';
import { ethers } from 'ethers';
import { RefreshCw, CheckCircle, AlertTriangle, Key, Hash } from 'lucide-react';

export const CryptoUtils: React.FC = () => {
  const [generatedPhrase, setGeneratedPhrase] = useState<string>('');
  const [validateInput, setValidateInput] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [derivedAddress, setDerivedAddress] = useState<string>('');

  const handleGenerate = (words: 12 | 24) => {
    const entropySize = words === 12 ? 16 : 32;
    const entropy = ethers.randomBytes(entropySize);
    const mnemonic = ethers.Mnemonic.fromEntropy(entropy);
    setGeneratedPhrase(mnemonic.phrase);
  };

  const handleValidate = (val: string) => {
    setValidateInput(val);
    if (!val.trim()) {
      setIsValid(null);
      setDerivedAddress('');
      return;
    }
    try {
      const isValidMnemonic = ethers.Mnemonic.isValidMnemonic(val.trim());
      setIsValid(isValidMnemonic);
      if (isValidMnemonic) {
        const wallet = ethers.Wallet.fromPhrase(val.trim());
        setDerivedAddress(wallet.address);
      } else {
        setDerivedAddress('');
      }
    } catch (e) {
      setIsValid(false);
      setDerivedAddress('');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Generator Tool */}
      <div className="border border-neutral-800 bg-[#111] p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
          <RefreshCw className="w-4 h-4 text-red-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Generator</h3>
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleGenerate(12)}
            className="flex-1 py-2 border border-neutral-700 hover:border-red-500 text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            12 Words
          </button>
          <button
            onClick={() => handleGenerate(24)}
            className="flex-1 py-2 border border-neutral-700 hover:border-red-500 text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            24 Words
          </button>
        </div>
        {generatedPhrase && (
          <div className="p-3 bg-[#0a0a0a] border border-neutral-800 text-xs text-neutral-300 font-mono break-words leading-relaxed">
            {generatedPhrase}
          </div>
        )}
      </div>

      {/* Validator & Derivation Tool */}
      <div className="border border-neutral-800 bg-[#111] p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
          <CheckCircle className="w-4 h-4 text-red-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Validator</h3>
        </div>
        <textarea
          value={validateInput}
          onChange={(e) => handleValidate(e.target.value)}
          placeholder="PASTE PHRASE TO VALIDATE..."
          className="w-full h-20 bg-[#0a0a0a] border border-neutral-800 p-3 text-white placeholder-neutral-700 focus:border-red-600 font-mono outline-none resize-none transition-colors uppercase text-xs tracking-widest mb-3"
          spellCheck={false}
        />
        
        {validateInput && (
          <div className="flex flex-col gap-2">
            <div className={`flex items-center gap-2 text-xs uppercase tracking-widest p-2 border ${isValid ? 'border-green-900/50 bg-green-900/10 text-green-500' : 'border-red-900/50 bg-red-900/10 text-red-500'}`}>
              {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {isValid ? 'Valid BIP39 Phrase' : 'Invalid Phrase'}
            </div>
            
            {isValid && derivedAddress && (
              <div className="mt-2">
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3" /> ETH Address (m/44'/60'/0'/0/0)
                </div>
                <div className="p-2 bg-[#0a0a0a] border border-neutral-800 text-[10px] text-neutral-300 font-mono break-all">
                  {derivedAddress}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Info Widget */}
      <div className="border border-neutral-800 bg-[#111] p-5">
        <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-3">
          <Hash className="w-4 h-4 text-red-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">Local Tools</h3>
        </div>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed">
          All utilities run locally in your browser. Keys and phrases are never transmitted over the network.
        </p>
      </div>
    </div>
  );
};
