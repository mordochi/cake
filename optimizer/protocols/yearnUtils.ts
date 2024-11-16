import { Address } from 'viem'
import { Category } from '../types'

export const YEARN_V3 = {
  id: 'yearnv3',
  name: 'Yearn V3',
  siteUrl: 'https://yearn.fi/v3',
  category: Category.YIELD,
  isWithdrawalSupported: true,
}

export type YearnVault = {
  address: Address;
  type: string;
  kind: string;
  symbol: string;
  name: string;
  category: string;
  version: string;
  description: string;
  decimals: number;
  chainID: number;
  token: {
    address: Address;
    name: string;
    symbol: string;
    description: string;
    decimals: number;
  };
  tvl: {
    totalAssets: string;
    tvl: number;
    price: number;
  };
  apr: {
    type: string;
    netAPR: number;
    fees: {
      performance: number;
      management: number;
    };
    points: {
      weekAgo: number;
      monthAgo: number;
      inception: number;
    };
    extra?: {
      stakingRewardAPR: number | null;
      gammaRewardAPR: number | null;
    };
    forwardAPR: {
      type: string;
      netAPR: number;
      composite: {
        boost: number | null;
        poolAPY: number | null;
        boostedAPR: number | null;
        baseAPR: number | null;
        cvxAPR: number | null;
        rewardsAPR: number | null;
        v3OracleCurrentAPR: number;
        v3OracleStratRatioAPR: number;
      };
    };
  };
  strategies: {
    address: string;
    name: string;
    details: {
      totalDebt: string;
      totalLoss: string;
      totalGain: string;
      performanceFee: number;
      lastReport: number;
      debtRatio: number;
    };
  };
  staking: {
    address: Address;
    available: boolean;
    source: string;
    rewards: number | null;
  };
  migration: {
    available: boolean;
    address: string;
    contract: string;
  };
  featuringScore: number;
  pricePerShare: string;
  info: {
    riskLevel: number;
    isRetired: boolean;
    isBoosted: boolean;
    isHighlighted: boolean;
    riskScore: number[];
  };
};

export const getAPR = (vault: YearnVault) => {
  let apr = floor(
    Object.values(vault.apr.extra ?? {}).reduce((acc, value) => {
      return (acc ?? 0) + (value ?? 0);
    }, vault.apr.forwardAPR.netAPR),
    2
  );
  if (apr === 0) {
    apr = vault.apr.netAPR;
  }
  return apr;
};

export const floor = (value: number | null, decimals: number): number => {
  return Math.floor((value ?? 0) * 10 ** decimals) / 10 ** decimals;
}
