import PublicClient from '@services/publicClient';
import { LRUCache } from 'lru-cache';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getContract,
} from 'viem';
import { BentoChainType } from '@/models/cases/v3/types';
import { NATIVE_TOKEN_ADDRESS } from './consts';
import TOKEN_IMAGES from './tokenImages';
import { Action, ActionType, Token, TxInfo } from './types';

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5, // 5 minutes
});

/**
 * Fetches data from the cache or API
 * @param cacheKey The cache key. Should be function name + args. e.g. getTokenInfo-{chainId}-{tokenAddress}
 * @param fetchDataCallback The callback to fetch the data
 * @returns The fetched data
 */
export const getCachedData = async <T>(
  cacheKey: string,
  fetchDataCallback: () => Promise<T>
): Promise<T> => {
  const cachedData = cache.get(cacheKey) as T;
  if (cachedData) {
    return cachedData;
  }
  const data = await fetchDataCallback();
  if (data) {
    cache.set(cacheKey, data);
    return data;
  }
  throw new Error('No data');
};

/**
 * Fetches token info
 * @param chain The blockchain chain
 * @param tokenAddress The token address
 * @returns Token info or null if the token info is not found
 */
export const getTokenInfo = async (
  chain: BentoChainType,
  tokenAddress: Address
): Promise<Token | null> => {
  return getCachedData(`getTokenInfo-${chain.id}-${tokenAddress}`, async () => {
    try {
      if (tokenAddress === NATIVE_TOKEN_ADDRESS) {
        return {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol,
          decimals: chain.nativeCurrency.decimals,
          address: tokenAddress,
          logoUrl: TOKEN_IMAGES[tokenAddress],
        };
      }

      const client = PublicClient.get(chain);

      const tokenContract = getContract({
        address: tokenAddress,
        abi: erc20Abi,
        client,
      });

      const [name, symbol, decimals] = await Promise.all([
        tokenContract.read.name(),
        tokenContract.read.symbol(),
        tokenContract.read.decimals(),
      ]);

      const token = {
        name,
        symbol,
        decimals,
        address: tokenAddress,
        logoUrl: TOKEN_IMAGES[tokenAddress],
      };
      return token;
    } catch (error) {
      console.error('Failed to get token info:', error);
      return null;
    }
  });
};

export const approveERC20TxIfNeeded = async (
  chain: BentoChainType,
  userAddress: Address,
  token: Token,
  spenderAddress: Address,
  spenderName: string,
  amount: bigint
): Promise<TxInfo | undefined> => {
  const tokenAllowance = await allowance(
    chain,
    userAddress,
    token.address,
    spenderAddress
  );
  if (tokenAllowance < amount) {
    return approveERC20Tx(token, spenderAddress, spenderName, amount);
  }
  return undefined;
};

export const approveERC20Tx = (
  token: Token,
  spenderAddress: Address,
  spenderName: string,
  amount: bigint
): TxInfo => {
  return {
    description: generateDescription({
      type: Action.APPROVE,
      spenderName,
      displayAmount: formatUnits(amount, token.decimals),
      tokenSymbol: token.symbol,
    }),
    displayAmount: formatUnits(amount, token.decimals),
    to: token.address,
    value: 0n,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: 'approve',
      args: [spenderAddress, amount],
    }),
  };
};

export const allowance = async (
  chain: BentoChainType,
  userAddress: Address,
  tokenAddress: Address,
  spenderAddress: Address
): Promise<bigint> => {
  const client = PublicClient.get(chain);
  const contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client: client,
  });
  return (await contract.read.allowance([
    userAddress,
    spenderAddress,
  ])) as bigint;
};

export const generateDescription = (action: ActionType): string => {
  switch (action.type) {
    case Action.WITHDRAW:
      return `Withdraw ${action.displayAmount} ${action.pair.outputTokenSymbol} to ${action.pair.inputTokenSymbol} on ${action.protocolName}`;
    case Action.DEPOSIT:
      return `Deposit ${action.displayAmount ? action.displayAmount + ' ' : ''}${action.pair.inputTokenSymbol} to ${action.protocolName}`;
    case Action.APPROVE:
      return `Approve ${action.spenderName ? action.spenderName + ' ' : ''}to spend ${action.displayAmount} ${action.tokenSymbol}`;
    case Action.PERMIT:
    case Action.PERMIT2:
      return `Approve ${action.spenderName ? action.spenderName + ' ' : ''}to spend ${action.displayAmount} ${action.tokenSymbol} (via ${action.type})`;
    default:
      throw new Error('Invalid action');
  }
};
