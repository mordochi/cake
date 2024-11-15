import { Address } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';

export const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || '';

export const selfApiUrl = process.env.NEXT_PUBLIC_HOST_URL || '';

export const _1INCH_NATIVE_TOKEN_ADDRESS: Address =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const STAKE_CHAIN_ID_MAP: Record<string, 1 | 11155111> = {
  development: 1,
  release: 1,
  production: 1,
};

export const STAKE_CHAIN_ID =
  STAKE_CHAIN_ID_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

const STAKE_CHAIN_MAP: Record<string, typeof mainnet | typeof sepolia> = {
  development: mainnet,
  release: mainnet,
  production: mainnet,
};

export const STAKE_CHAIN =
  STAKE_CHAIN_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

export * from './contractAddresses';

// phase 1
export const POSITION_OPTIMIZER_OPTIONS = [
  {
    title: 'ETH Position Optimizer',
    description:
      'Move ETH Positions to recommended destination for Higher APY.',
    basePath: '/position-optimizer/',
    subPath: 'eth',
    queryPath: 'ETH',
    needPositionDropdown: true,
  },
  {
    title: 'Stablecoin Position Optimizer',
    description:
      'Move stable positions to recommended destination for Higher APY.',
    basePath: '/position-optimizer/',
    subPath: 'stablecoin',
    queryPath: 'Stablecoin',
    needPositionDropdown: true,
  },
];

interface TradingSuggestion {
  title: string;
  description: string;
  basePath: string;
  subPath: string;
  queryPath: string;
  needPositionDropdown: boolean;

  customIcon?: string;
  icon?: string;
}

export const HOME_PAGE_TRADING_SUGGESTIONS: TradingSuggestion[] = [
  ...POSITION_OPTIMIZER_OPTIONS,
];
