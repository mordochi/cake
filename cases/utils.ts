import {
  Address,
  erc20Abi,
  formatUnits,
  getContract,
  numberToHex,
  parseUnits,
} from 'viem';
import PublicClient from '@services/publicClient';
import { ActionParam, ActionParamType, BentoChainType } from './types';

export const decimalValidator =
  (decimal: number, min?: bigint, max?: bigint) => (value: string) => {
    // validate
    // 1. is number
    // 2. is in range
    // 3. is with specified decimal places
    const num = parseUnits(value, decimal);
    if (min !== undefined && num < min) {
      throw new Error(
        `Number must be greater than or equal to ${formatUnits(min, decimal)}`
      );
    }
    if (max !== undefined && num > max) {
      throw new Error(
        `Number must be less than  or equal to ${formatUnits(max, decimal)}`
      );
    }
    const [, dec] = value.split('.');
    if (dec && dec.length > decimal) {
      throw new Error(`Number must have ${decimal} decimal places`);
    }
  };

export const integerValidator = (value: string) => {
  // check if string is a number
  if (isNaN(Number(value))) {
    throw new Error('Invalid number');
  }
  // check if number is integer
  if (value.includes('.')) {
    throw new Error('Only support integer');
  }
  return +value;
};

export const getDecimals = async (
  tokenAddress: Address,
  chain: BentoChainType
) => {
  const client = PublicClient.get(chain);

  const tokenContract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client,
  });

  const decimals = (await tokenContract.read.decimals()) as number;
  return decimals;
};

export const balance = {
  name: 'Balance',
  getValue: (param: ActionParam) =>
    param.inputType === ActionParamType.tokenInput ? param.token.balance : '',
};

export const max = {
  name: 'Max',
  getValue: (param: ActionParam) =>
    param.inputType === ActionParamType.tokenInput ? param.token.balance : '',
};

export const pasteMyAddress = {
  name: 'Paste My Address',
  getValue: (param: ActionParam) => param.userAddress,
};

// Seconds
export const deadlineSeconds = (minuteAfter: number): number => {
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  return currentTimeStamp + 60 * minuteAfter;
};

// Milliseconds
export const deadlineHex = (minuteAfter: number): string => {
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  return numberToHex(currentTimeStamp + 60 * minuteAfter);
};

/**
 * Calculate APY from APR
 * @param apr should be in percentage. e.g. 0.2 for 20%
 * @param compound compound times per year
 * @returns APY number
 */
export const aprToApy = (apr: number, compound: number): number => {
  return (1 + apr / compound) ** compound - 1;
};

export const toApyPercent = (apy: number) => `${(apy * 100).toFixed(2)}%`;

export const toGasSavedPercent = (gasSaved: number) => `~${gasSaved}%`;

export const withApyText = (apy: string): string => `${apy} APY`;
