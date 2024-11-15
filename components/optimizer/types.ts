import { Address, Chain } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';
import { NATIVE_TOKEN_ADDRESS } from '@/optimizer/consts';
import { PermitTx, Tx } from '../../optimizer/types';

export interface DebankPortfolio {
  [chainId: string]: DebankChainData;
}

export interface DebankChainData {
  usd_value: string;
  chain_logo_url: string;
  assets: DebankAsset[] | null;
}

export interface DebankAsset {
  asset: DebankTokenData;
  protocol?: DebankProtocolData;
}

export interface DebankTokenData {
  name: string;
  symbol: string;
  token_address: string;
  amount: number;
  decimals: number;
  logo_url: string;
  price: number;
}

export interface DebankProtocolData {
  id: string;
  name: string;
  category: string;
  site_url: string;
  logo_url: string;
  supply_tokens: DebankTokenData[];
  reward_tokens: DebankTokenData[];
  stats: {
    asset_usd_value: string;
    debt_usd_value: string;
    net_usd_value: string;
  };
}

export enum StepType {
  PERMIT_SIGN = 'permitSign',
  PERMIT_TX = 'permitTx',
  TX = 'tx',
}

// Could be permit or permit2
export type PermitSignStep = {
  type: StepType.PERMIT_SIGN;
  getDescription: () => string;
  permitTx: PermitTx;
};

export type PermitTxStep = {
  type: StepType.PERMIT_TX;
  getDescription: () => string;
  getTx: PermitTx['tx'];
};

export type TxStep = {
  type: StepType.TX;
  getDescription: () => string;
  getTx: () => Tx;
};

export type ActionStep = PermitSignStep | PermitTxStep | TxStep;
export const normalizeAddress = (address: string): Address => {
  if (!address) {
    throw new Error('Invalid address: address is empty');
  }
  if (
    address === 'eth' ||
    address === 'op' ||
    address === 'arb' ||
    address === 'base' ||
    address === 'zora' ||
    address === 'scrl' ||
    address === 'matic' ||
    address === 'avax' ||
    address === 'bsc'
  ) {
    return NATIVE_TOKEN_ADDRESS;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error('Invalid address format');
  }
  return address as Address;
};

export const formatTVL = (value: number): string => {
  if (value === 0) return '-';
  return value > 1_000_000
    ? `$ ${(value / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`
    : value > 1_000
      ? `$ ${(value / 1_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} K`
      : `$ ${Math.trunc(value).toLocaleString()}`;
};

export const formatAmount = (value: number): string => {
  if (value === 0) return '-';
  return value > 1_000_000
    ? `${(value / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`
    : value > 1_000
      ? `${(value / 1_000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} K`
      : value >= 1
        ? value.toFixed(2)
        : value.toFixed(6);
};

export const OptimizerSupportedChains = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  avalanche,
  bsc,
  base,
].reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as { [key: number]: Chain }
);

export const chainId2name = (id: number): string => {
  const chain = OptimizerSupportedChains[id];
  return chain?.name || 'Unknown Chain';
};
