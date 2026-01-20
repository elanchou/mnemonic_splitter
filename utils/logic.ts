import { MnemonicPhrase, Share } from '../types';

/**
 * Validates if the input string contains a valid number of words.
 * We support any length divisible by 3 (e.g., 12, 15, 18, 21, 24).
 */
export const validateInput = (input: string): { valid: boolean; words: string[]; error?: string } => {
  const cleanInput = input.trim().replace(/\s+/g, ' ');
  if (!cleanInput) {
    return { valid: false, words: [], error: 'Please enter a mnemonic phrase.' };
  }
  
  const words = cleanInput.split(' ');
  const len = words.length;

  if (len < 3) {
      return { valid: false, words, error: `Phrase is too short (${len} words).` };
  }
  
  if (len % 3 !== 0) {
    return { valid: false, words, error: `Word count (${len}) is not divisible by 3. Common lengths are 12, 15, 18, 21, 24.` };
  }

  // Basic check for alphabetical characters only
  const invalidWord = words.find(w => !/^[a-zA-Z]+$/.test(w));
  if (invalidWord) {
    return { valid: false, words, error: `Invalid word detected: "${invalidWord}". Only letters are allowed.` };
  }

  return { valid: true, words: words.map(w => w.toLowerCase()) };
};

/**
 * Splits a secret into 3 shares of overlapping blocks.
 * If length is L, block size k = L/3.
 * Share 1: Words 0 to 2k
 * Share 2: Words k to 3k
 * Share 3: Words 2k to 3k + 0 to k
 */
export const splitSecret = (words: MnemonicPhrase): Share[] => {
  const len = words.length;
  if (len % 3 !== 0) throw new Error("Input length must be divisible by 3");

  const k = len / 3;
  const blockA = words.slice(0, k);
  const blockB = words.slice(k, k * 2);
  const blockC = words.slice(k * 2, len);

  return [
    { id: 1, label: "Share 1", words: [...blockA, ...blockB] },
    { id: 2, label: "Share 2", words: [...blockB, ...blockC] },
    { id: 3, label: "Share 3", words: [...blockC, ...blockA] },
  ];
};

/**
 * Attempts to reconstruct the secret from any 2 shares.
 * Calculates overlap size based on share length.
 */
export const recoverSecret = (shareAStr: string, shareBStr: string): { success: boolean; words: string[]; error?: string } => {
  const cleanA = shareAStr.trim().replace(/\s+/g, ' ').toLowerCase().split(' ');
  const cleanB = shareBStr.trim().replace(/\s+/g, ' ').toLowerCase().split(' ');

  if (cleanA.length === 0 && cleanB.length === 0) return { success: false, words: [], error: "Please enter your shares." };
  if (cleanA.length !== cleanB.length) {
    return { success: false, words: [], error: `Shares mismatch: ${cleanA.length} vs ${cleanB.length} words. They must be equal length.` };
  }
  
  // Share length must be even because Share = 2 * block_size
  if (cleanA.length % 2 !== 0) {
      return { success: false, words: [], error: `Invalid share length (${cleanA.length}). Must be an even number.` };
  }

  const blockSize = cleanA.length / 2;

  const checkOverlap = (first: string[], second: string[]): string[] | null => {
    // Overlap size is half the share length
    const overlapSize = blockSize;
    
    // Check if tail of 'first' matches head of 'second'
    const tail = first.slice(first.length - overlapSize);
    const head = second.slice(0, overlapSize);
    
    const isMatch = tail.every((val, index) => val === head[index]);
    
    if (isMatch) {
      // Combine: First + (Second without the head)
      return [...first, ...second.slice(overlapSize)];
    }
    return null;
  };

  // Try A -> B
  let result = checkOverlap(cleanA, cleanB);
  if (result) return { success: true, words: result };

  // Try B -> A
  result = checkOverlap(cleanB, cleanA);
  if (result) return { success: true, words: result };

  return { success: false, words: [], error: "No valid overlap found. Ensure you are using two different shares from the same set." };
};

/**
 * Rotates an array to the left by 1 block size (L/3).
 */
export const rotateWords = (words: string[]): string[] => {
  const rotationAmount = Math.floor(words.length / 3);
  const part1 = words.slice(rotationAmount);
  const part2 = words.slice(0, rotationAmount);
  return [...part1, ...part2];
};
