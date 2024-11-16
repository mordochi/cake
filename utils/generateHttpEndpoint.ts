import { defineChain } from 'viem';
import { http } from 'wagmi';
import {
  Chain,
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  merlin,
  optimism,
  polygon,
  scroll,
  sepolia,
  zora,
} from 'wagmi/chains';
import { StakeChainType } from '@/cases/types';

export const anvilMainnet = defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: {
      name: 'Story Explorer',
      url: 'https://odyssey.storyscan.xyz',
    },
  },
});

const CHAINS_CONFIG = [
  anvilMainnet,
  polygon,
  arbitrum,
  optimism,
  base,
  scroll,
  avalanche,
  bsc,
  zora,
  blast,
  merlin,
  // For testing token pages on dev/QA environments
  ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? [sepolia] : []),
  // For demo 7702 behavior
  ...(process.env.NEXT_PUBLIC_7702_DEMO === 'true' ? [anvilMainnet] : []),
];

const TYPED_CHAINS = CHAINS_CONFIG as unknown as Readonly<
  typeof CHAINS_CONFIG
> &
  readonly [Chain, ...Chain[]];

const chainIdRpcMapping: {
  [key in (typeof TYPED_CHAINS)[number]['id']]?: string;
} = {
  // [mainnet.id]: 'https://mainnet.infura.io/v3/',
  [sepolia.id]: 'https://sepolia.infura.io/v3/',
  [polygon.id]: 'https://polygon-mainnet.infura.io/v3/',
  [arbitrum.id]: 'https://arbitrum-mainnet.infura.io/v3/',
  [optimism.id]: 'https://optimism-mainnet.infura.io/v3/',
  [base.id]: 'https://base-mainnet.infura.io/v3/',
  [avalanche.id]: 'https://avalanche-mainnet.infura.io/v3/',
  [blast.id]: 'https://blast-mainnet.infura.io/v3/',
};

export const chainIdChainMapping = CHAINS_CONFIG.reduce<
  Record<number, StakeChainType>
>((acc, chain) => ({ ...acc, [chain.id]: chain }), {});

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

const generateHttpEndpoint = (
  chainId: (typeof TYPED_CHAINS)[number]['id'],
  key: string | undefined = INFURA_KEY
) => {
  const endpoint = chainIdRpcMapping[chainId];
  if (!key || !endpoint) return http();
  return http(`${endpoint}${key}`, { batch: true });
};

export { TYPED_CHAINS as CHAINS };
export default generateHttpEndpoint;
