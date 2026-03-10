import React, { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Hash, PenTool, CheckCircle2, Copy } from 'lucide-react';

export function CryptoTools() {
  // Unit Converter State
  const [ethValue, setEthValue] = useState('1');
  const [gweiValue, setGweiValue] = useState('1000000000');
  const [weiValue, setWeiValue] = useState('1000000000000000000');

  // Hash Generator State
  const [hashInput, setHashInput] = useState('');
  const [hashOutput, setHashOutput] = useState('');

  // Signer State
  const [signMessage, setSignMessage] = useState('');
  const [signPrivateKey, setSignPrivateKey] = useState('');
  const [signature, setSignature] = useState('');

  // Verifier State
  const [verifyMessage, setVerifyMessage] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [recoveredAddress, setRecoveredAddress] = useState('');

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handlers for Unit Converter
  const handleEthChange = (val: string) => {
    setEthValue(val);
    try {
      if (!val) {
        setGweiValue('');
        setWeiValue('');
        return;
      }
      const wei = ethers.parseEther(val);
      setWeiValue(wei.toString());
      setGweiValue(ethers.formatUnits(wei, 'gwei'));
    } catch (e) {
      // ignore invalid input
    }
  };

  const handleGweiChange = (val: string) => {
    setGweiValue(val);
    try {
      if (!val) {
        setEthValue('');
        setWeiValue('');
        return;
      }
      const wei = ethers.parseUnits(val, 'gwei');
      setWeiValue(wei.toString());
      setEthValue(ethers.formatEther(wei));
    } catch (e) {
      // ignore
    }
  };

  const handleWeiChange = (val: string) => {
    setWeiValue(val);
    try {
      if (!val) {
        setEthValue('');
        setGweiValue('');
        return;
      }
      setEthValue(ethers.formatEther(val));
      setGweiValue(ethers.formatUnits(val, 'gwei'));
    } catch (e) {
      // ignore
    }
  };

  // Handlers for Hash Generator
  const handleHashGenerate = () => {
    try {
      const hash = ethers.keccak256(ethers.toUtf8Bytes(hashInput));
      setHashOutput(hash);
    } catch (e) {
      setHashOutput('Error generating hash');
    }
  };

  // Handlers for Signer
  const handleSignMessage = async () => {
    try {
      if (!signPrivateKey || !signMessage) return;
      const wallet = new ethers.Wallet(signPrivateKey);
      const sig = await wallet.signMessage(signMessage);
      setSignature(sig);
    } catch (e) {
      setSignature('Error: Invalid private key or message');
    }
  };

  // Handlers for Verifier
  const handleVerifyMessage = () => {
    try {
      if (!verifyMessage || !verifySignature) return;
      const address = ethers.verifyMessage(verifyMessage, verifySignature);
      setRecoveredAddress(address);
    } catch (e) {
      setRecoveredAddress('Error: Invalid signature or message');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-display uppercase tracking-widest mb-2">
            CRYPTO TOOLS
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest">
            Essential utilities for Ethereum developers and users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Unit Converter */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-neutral-800 bg-[#111] p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-red-500 uppercase tracking-widest text-sm font-bold border-b border-neutral-800 pb-4">
            <ArrowRightLeft className="w-5 h-5" />
            Unit Converter
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Ether (ETH)</label>
              <input
                type="text"
                value={ethValue}
                onChange={(e) => handleEthChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Gwei</label>
              <input
                type="text"
                value={gweiValue}
                onChange={(e) => handleGweiChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="1000000000"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Wei</label>
              <input
                type="text"
                value={weiValue}
                onChange={(e) => handleWeiChange(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="1000000000000000000"
              />
            </div>
          </div>
        </motion.div>

        {/* Keccak256 Hash Generator */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-neutral-800 bg-[#111] p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-red-500 uppercase tracking-widest text-sm font-bold border-b border-neutral-800 pb-4">
            <Hash className="w-5 h-5" />
            Keccak256 Hash
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Input String</label>
              <textarea
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  if (e.target.value) {
                    try {
                      setHashOutput(ethers.keccak256(ethers.toUtf8Bytes(e.target.value)));
                    } catch (err) {
                      setHashOutput('Error generating hash');
                    }
                  } else {
                    setHashOutput('');
                  }
                }}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors min-h-[100px] resize-y"
                placeholder="Enter text to hash..."
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Output Hash (Hex)</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={hashOutput}
                  className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-neutral-400 font-mono focus:outline-none pr-12"
                  placeholder="0x..."
                />
                {hashOutput && !hashOutput.startsWith('Error') && (
                  <button
                    onClick={() => copyToClipboard(hashOutput, 'hash')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {copiedField === 'hash' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Signer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-neutral-800 bg-[#111] p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-red-500 uppercase tracking-widest text-sm font-bold border-b border-neutral-800 pb-4">
            <PenTool className="w-5 h-5" />
            Sign Message
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Private Key</label>
              <input
                type="password"
                value={signPrivateKey}
                onChange={(e) => setSignPrivateKey(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Message</label>
              <textarea
                value={signMessage}
                onChange={(e) => setSignMessage(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors min-h-[80px] resize-y"
                placeholder="Message to sign..."
              />
            </div>
            <button
              onClick={handleSignMessage}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 font-bold tracking-widest uppercase transition-colors"
            >
              Sign Message
            </button>
            {signature && (
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Signature</label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={signature}
                    className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-neutral-400 font-mono focus:outline-none min-h-[80px] pr-12"
                  />
                  {!signature.startsWith('Error') && (
                    <button
                      onClick={() => copyToClipboard(signature, 'signature')}
                      className="absolute right-3 top-3 text-neutral-500 hover:text-white transition-colors"
                    >
                      {copiedField === 'signature' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Message Verifier */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-neutral-800 bg-[#111] p-6 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-red-500 uppercase tracking-widest text-sm font-bold border-b border-neutral-800 pb-4">
            <CheckCircle2 className="w-5 h-5" />
            Verify Signature
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Message</label>
              <textarea
                value={verifyMessage}
                onChange={(e) => setVerifyMessage(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors min-h-[80px] resize-y"
                placeholder="Original message..."
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Signature</label>
              <textarea
                value={verifySignature}
                onChange={(e) => setVerifySignature(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-neutral-800 p-3 text-white font-mono focus:outline-none focus:border-red-500 transition-colors min-h-[80px] resize-y"
                placeholder="0x..."
              />
            </div>
            <button
              onClick={handleVerifyMessage}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 font-bold tracking-widest uppercase transition-colors"
            >
              Recover Address
            </button>
            {recoveredAddress && (
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">Recovered Signer Address</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={recoveredAddress}
                    className={`w-full bg-[#0a0a0a] border p-3 font-mono focus:outline-none pr-12 ${
                      recoveredAddress.startsWith('Error') ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                    }`}
                  />
                  {!recoveredAddress.startsWith('Error') && (
                    <button
                      onClick={() => copyToClipboard(recoveredAddress, 'recovered')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      {copiedField === 'recovered' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
