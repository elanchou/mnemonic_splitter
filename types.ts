export type MnemonicPhrase = string[];

export enum SplitScheme {
  TWO_OF_TWO = '2-of-2',
  TWO_OF_THREE = '2-of-3',
  THREE_OF_FOUR = '3-of-4'
}

export interface Share {
  id: number;
  label: string;
  words: MnemonicPhrase;
  scheme: SplitScheme;
}

export enum Tab {
  SPLIT = 'SPLIT',
  RECOVER = 'RECOVER'
}