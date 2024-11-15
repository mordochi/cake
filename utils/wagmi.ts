import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  mainnet,
  merlin,
  optimism,
  polygon,
  scroll,
  sepolia,
  zora,
} from 'wagmi/chains';
import { WalletType } from '@/cases/types';
import generateHttpEndpoint, { CHAINS, pectra } from './generateHttpEndpoint';

export const walletTypes: Record<string, WalletType> = {
  metaMask: WalletType.EOA,
};

// NOTE: make sure to update the walletTypes object above when adding new wallets
const connectors = connectorsForWallets(
  [
    {
      groupName: 'EOA',
      wallets: [metaMaskWallet],
    },
  ],
  {
    projectId: '5cccbcf841ef793ac62a7d2ee52665f3',
    appName: 'Cake Stake',
  }
);

export const config = createConfig({
  chains: CHAINS,
  multiInjectedProviderDiscovery: false,
  connectors,
  ssr: true,
  transports: {
    [mainnet.id]: generateHttpEndpoint(mainnet.id),
    [polygon.id]: generateHttpEndpoint(polygon.id),
    [arbitrum.id]: generateHttpEndpoint(arbitrum.id),
    [optimism.id]: generateHttpEndpoint(optimism.id),
    [base.id]: generateHttpEndpoint(base.id),
    [scroll.id]: generateHttpEndpoint(scroll.id),
    [avalanche.id]: generateHttpEndpoint(avalanche.id),
    [bsc.id]: generateHttpEndpoint(bsc.id),
    [zora.id]: generateHttpEndpoint(zora.id),
    [merlin.id]: generateHttpEndpoint(merlin.id),
    [blast.id]: generateHttpEndpoint(blast.id),
    [sepolia.id]: generateHttpEndpoint(sepolia.id),
    [pectra.id]: generateHttpEndpoint(pectra.id),
  },
});
