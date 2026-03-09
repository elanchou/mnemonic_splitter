import { MnemonicPhrase, Share, SplitScheme } from '../types';

/**
 * Validates if the input string contains a valid number of words.
 * The word count must be divisible by the required block count for the scheme.
 */
export const validateInput = (input: string, scheme: SplitScheme): { valid: boolean; words: string[]; error?: string } => {
  const cleanInput = input.trim().replace(/\s+/g, ' ');
  if (!cleanInput) {
    return { valid: false, words: [], error: 'Please enter a mnemonic phrase.' };
  }
  
  const words = cleanInput.split(' ');
  const len = words.length;

  let divisor = 1;
  switch (scheme) {
    case SplitScheme.TWO_OF_TWO: divisor = 2; break;
    case SplitScheme.TWO_OF_THREE: divisor = 3; break;
    case SplitScheme.THREE_OF_FOUR: divisor = 4; break;
  }

  if (len % divisor !== 0) {
    return { valid: false, words, error: `For ${scheme}, word count (${len}) must be divisible by ${divisor}.` };
  }

  const invalidWord = words.find(w => !/^[a-zA-Z]+$/.test(w));
  if (invalidWord) {
    return { valid: false, words, error: `Invalid word detected: "${invalidWord}".` };
  }

  return { valid: true, words: words.map(w => w.toLowerCase()) };
};

/**
 * Multi-scheme splitting logic
 */
export const splitSecret = (words: MnemonicPhrase, scheme: SplitScheme): Share[] => {
  const len = words.length;
  
  if (scheme === SplitScheme.TWO_OF_TWO) {
    const k = len / 2;
    return [
      { id: 1, label: "Part A", words: words.slice(0, k), scheme },
      { id: 2, label: "Part B", words: words.slice(k, len), scheme },
    ];
  }

  if (scheme === SplitScheme.TWO_OF_THREE) {
    const k = len / 3;
    const A = words.slice(0, k);
    const B = words.slice(k, k * 2);
    const C = words.slice(k * 2, len);
    return [
      { id: 1, label: "Shard 1", words: [...A, ...B], scheme },
      { id: 2, label: "Shard 2", words: [...B, ...C], scheme },
      { id: 3, label: "Shard 3", words: [...C, ...A], scheme },
    ];
  }

  if (scheme === SplitScheme.THREE_OF_FOUR) {
    const k = len / 4;
    const A = words.slice(0, k);
    const B = words.slice(k, k * 2);
    const C = words.slice(k * 2, k * 3);
    const D = words.slice(k * 3, len);
    return [
      { id: 1, label: "Shard 1", words: [...A, ...B], scheme },
      { id: 2, label: "Shard 2", words: [...B, ...C], scheme },
      { id: 3, label: "Shard 3", words: [...C, ...D], scheme },
      { id: 4, label: "Shard 4", words: [...D, ...A], scheme },
    ];
  }

  throw new Error("Unsupported scheme");
};

/**
 * Advanced recovery that attempts to find overlaps across multiple possible block sizes
 */
export const recoverSecret = (shares: string[]): { success: boolean; words: string[]; error?: string } => {
  const activeShares = shares.map(s => s.trim().replace(/\s+/g, ' ').toLowerCase().split(' ')).filter(s => s.length > 0 && s[0] !== '');

  if (activeShares.length < 2) {
    return { success: false, words: [], error: "At least 2 shares are required." };
  }

  // Ensure all shares have the same length
  const shareLen = activeShares[0].length;
  if (!activeShares.every(s => s.length === shareLen)) {
    return { success: false, words: [], error: "All shares must have the same word count." };
  }

  const checkJoin = (current: string[], remaining: string[][]): string[] | null => {
    if (remaining.length === 0) return current;

    for (let i = 0; i < remaining.length; i++) {
        const next = remaining[i];
        const others = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
        
        // Try different overlap sizes: 0 (2-of-2) or k (overlap schemes)
        // Since we split into n blocks, overlap is usually some multiple of block size
        // We iterate through possible block sizes
        for (let overlap = 0; overlap <= shareLen; overlap++) {
            const tail = current.slice(current.length - overlap);
            const head = next.slice(0, overlap);
            
            if (overlap === 0 || tail.every((v, idx) => v === head[idx])) {
                const combined = [...current, ...next.slice(overlap)];
                // Valid mnemonics are usually 12, 15, 18, 21, 24
                if ([12, 15, 18, 21, 24].includes(combined.length)) {
                    return combined;
                }
                const result = checkJoin(combined, others);
                if (result) return result;
            }
        }
    }
    return null;
  };

  // Try all permutations
  for (let i = 0; i < activeShares.length; i++) {
    const start = activeShares[i];
    const others = [...activeShares.slice(0, i), ...activeShares.slice(i + 1)];
    const result = checkJoin(start, others);
    if (result) return { success: true, words: result };
  }

  return { success: false, words: [], error: "Could not reconstruct phrase. Ensure the shares are correct and complete." };
};

export const rotateWords = (words: string[]): string[] => {
  // Try to find the smallest likely block size (Total / 3 or Total / 4)
  const rotationAmount = words.length % 4 === 0 ? words.length / 4 : words.length / 3;
  const part1 = words.slice(rotationAmount);
  const part2 = words.slice(0, rotationAmount);
  return [...part1, ...part2];
};
