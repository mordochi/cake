import { Address } from 'viem';
import { arbitrum, mainnet, optimism, polygon } from 'viem/chains';

enum UniversalComposerSupportedToken {
  ETH = 'ETH',
  USDT = 'USDT',
  USDC = 'USDC',
}

export type UniversalComposerType = Record<number, Record<string, Address>>;

// DOCS: https://www.notion.so/portto/75ffed98a6f64815b1cfb6803302f80c?v=a7fbc022805044c9813bba5085c26d50
export const universalComposer: UniversalComposerType = {
  [arbitrum.id]: {
    [UniversalComposerSupportedToken.ETH]:
      '0x20D711a3019114aC5f58e0003e99d9CB77C44796',
    [UniversalComposerSupportedToken.USDT]:
      '0x797d1b5308A8caf71fcadedF14422C6af678B501',
    [UniversalComposerSupportedToken.USDC]:
      '0xfDA0BFA12f5Fb698f03546dB6d1D3e826A8817eF',
  },
  [optimism.id]: {
    [UniversalComposerSupportedToken.ETH]:
      '0x648CAd82944eDe9149556bd01fD9B3F437A87B9e',
    [UniversalComposerSupportedToken.USDT]:
      '0xcF3e6CEc8E78409065F1FDf938717Cd351dADe73',
    [UniversalComposerSupportedToken.USDC]:
      '0x336FD68e735D4803F9AC3fC7D52B95C4Db0F278E',
  },
  [mainnet.id]: {
    [UniversalComposerSupportedToken.ETH]:
      '0xCEd6a5CEA82D87f2a5Dff9f439A25b6609b2Bedd',
    [UniversalComposerSupportedToken.USDT]:
      '0x65F328bC098316301EFb25790B2b7ED6C9b8006D',
    [UniversalComposerSupportedToken.USDC]:
      '0xDb5a2007DA4dbd8EF20FE0B75471CD8192AE70F1',
  },
  [polygon.id]: {
    [UniversalComposerSupportedToken.USDT]:
      '0x108877f830F2D15A8FB7D74991B00A5c4D480b63',
    [UniversalComposerSupportedToken.USDC]:
      '0x5f09912Fa6d8870Bd807f8e0D8e54EFD31E25Ced',
  },
};
