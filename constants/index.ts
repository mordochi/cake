import { Address } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';

export const baseApiUrl =
  process.env.NEXT_PUBLIC_API_URL || 'https://api-dev.bentobatch.com/v1';

export const selfApiUrl =
  process.env.NEXT_PUBLIC_HOST_URL || 'https://bento-batch-dev.netlify.app';

export const _1INCH_NATIVE_TOKEN_ADDRESS: Address =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

// $BENTO token chain id
const BENTO_CHAIN_ID_MAP: Record<string, 1 | 11155111> = {
  development: 11155111,
  release: 11155111,
  production: 1,
};

export const BENTO_CHAIN_ID =
  BENTO_CHAIN_ID_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

const BENTO_CHAIN_MAP: Record<string, typeof mainnet | typeof sepolia> = {
  development: sepolia,
  release: sepolia,
  production: mainnet,
};

export const BENTO_CHAIN =
  BENTO_CHAIN_MAP[process.env.NEXT_PUBLIC_APP_ENV || 'development'];

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

// phase 2
export const SHIFT_OPTIONS = [
  {
    title: 'Bento Shift to Rho Market',
    description: 'Shift your position to Rho Market with a single click',
    basePath: '/bento-shift',
    subPath: '?to=rho',
    queryPath: 'rho_market',
    customIcon: 'Rho',
    icon: 'rho_market', // mapping from contentful id
    needPositionDropdown: false,
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
  ...SHIFT_OPTIONS,
];
