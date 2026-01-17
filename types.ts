export type MnemonicPhrase = string[];

export interface Share {
  id: number;
  label: string;
  words: MnemonicPhrase;
}

export enum Tab {
  SPLIT = 'SPLIT',
  RECOVER = 'RECOVER'
}