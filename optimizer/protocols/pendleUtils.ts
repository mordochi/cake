import { Address, formatUnits } from 'viem';
import { StakeChainType } from '@/cases/types';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import {
  Action,
  Category,
  LEARN_MORE_DESC,
  Reward,
  Token,
  TxInfo,
} from '../types';
import { generateDescription } from '../utils';

export const PENDLE = {
  id: 'pendle2',
  name: 'Pendle V2',
  siteUrl: 'https://app.pendle.finance',
  category: Category.YIELD,
  isWithdrawalSupported: false,
  ROUTER_V4: '0x888888888889758F76e7103c6CbF23ABbF58F946',
};

export type Market = {
  address: Address;
  underlyingToken: Token;
  lpToken: Token;
  apy: { min: number; max: number }; // aggregated, max boosted
  liquidity: { usd: number; acc: number }; // current, accumulated
  rewards: Reward[];
};

const PENDLE_API_BASE_URL = 'https://api-v2.pendle.finance/core/v1';

/**
 * Fetches all active Pendle markets with a given chain ID
 * @param chainId The blockchain chain ID
 * @param inputTokenAddress The input token address
 * @returns Array of active market
 * @throws Error if the API request fails
 */
export const fetchActiveMarkets = async (
  chain: StakeChainType,
  inputTokenAddress: Address
): Promise<Address[]> => {
  const url = `${PENDLE_API_BASE_URL}/${chain.id}/markets/active`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();

    // Get the active markets where the underlying token address matches the input token address
    const activeMarkets = data.markets
      .filter((market: Record<string, string>) => {
        const underlyingTokenAddress = parseKey(market.underlyingAsset)?.[1];
        if (!underlyingTokenAddress) {
          console.warn(
            `Skipping market due to invalid underlying asset address: ${market.underlyingAsset}`
          );
          return false;
        }
        return (
          underlyingTokenAddress.toLowerCase() ===
          inputTokenAddress.toLowerCase()
        );
      })
      .map((market: Record<string, string>) => market.address);
    return activeMarkets;
  } catch (error) {
    console.error('Failed to fetch Pendle active markets:', error);
    return [];
  }
};

/**
 * Fetches market information by market address
 * @param chainId Blockchain chainID
 * @param marketAddress Market address
 * @returns Market information including underlying token, LP token, APY and liquidity details
 * @throws Error if the API request fails or market info cannot be retrieved
 */
export const fetchMarketInfoByAddress = async (
  chainId: number,
  marketAddress: Address
): Promise<Market> => {
  const url = `${PENDLE_API_BASE_URL}/${chainId}/markets/${marketAddress}`;
  const [res, err] = await tryExecuteRequest(() => apiCaller.get(url));
  if (err) {
    throw new Error(`Failed to fetch market info: ${err.message}`);
  }
  return extractMarketInfo(res);
};

/**
 * Fetches market information by underlying token address & LP token address
 * @param chainId Blockchain chainID
 * @param underlyingTokenAddress Underlying token address, aka input token address
 * @param lpTokenAddress LP token address, aka output token address
 * @returns Market information including underlying token, LP token, APY and liquidity details
 * @throws Error if no markets are found, if the specific market is not found, or if the API request fails
 */
export const fetchMarketInfoByToken = async (
  chainId: number,
  underlyingTokenAddress: Address,
  lpTokenAddress: Address
): Promise<Market> => {
  const limit = 50;
  let offset = 0;
  try {
    while (true) {
      const url = `${PENDLE_API_BASE_URL}/${chainId}/markets?q=${underlyingTokenAddress}&limit=${limit}&skip=${offset}`;
      const [res, err] = await tryExecuteRequest(() => apiCaller.get(url));
      if (err) {
        throw new Error(`Failed to fetch market info: ${err.message}`);
      }
      const total = res.total;
      if (total === 0 || res.results.length === 0) {
        throw new Error('No markets found');
      }

      for (let i = 0; i < res.results.length; i++) {
        const market = res.results[i];
        if (lpTokenAddress.toLowerCase() === market.address.toLowerCase()) {
          return extractMarketInfo(market);
        }
      }

      // Check if we've reached the end of available data
      if (offset + limit >= total) {
        throw new Error('Market with given token not found'); // Throwing an error instead of returning undefined
      }

      offset += limit;
    }
  } catch (error) {
    console.error('Failed to fetch market info:', error);
    throw error;
  }
};

/**
 * Fetches the add liquidity transaction details
 * @param chainId Blockchain chainID
 * @param receiverAddress User address
 * @param underlyingTokenAddress Input token address
 * @param marketAddress Output token address
 * @param amount Amount to add
 * @returns Transaction details
 */
export const getAddLiquidityTx = async (
  chainId: number,
  receiverAddress: Address, // User address
  underlyingToken: Token, // Input token
  lpToken: Token, // Output token
  amount: bigint
): Promise<TxInfo> => {
  const url = `${PENDLE_API_BASE_URL}/sdk/${chainId}/markets/${lpToken.address}/add-liquidity`;
  const params = new URLSearchParams({
    receiver: receiverAddress,
    slippage: '0.05', // 0 to 1; (0.01 is 1%)
    tokenIn: underlyingToken.address,
    amountIn: amount.toString(),
  });
  const [res, err] = await tryExecuteRequest(() =>
    apiCaller.get(`${url}?${params}`)
  );

  if (err) {
    // If amount is too small, it's possible to get an error about Slippage
    throw new Error(`Fail to fetch add liquidity tx ${err.message}`);
  }
  return {
    description: generateDescription({
      type: Action.DEPOSIT,
      protocolName: PENDLE.name,
      displayAmount: formatUnits(amount, underlyingToken.decimals),
      pair: {
        inputTokenSymbol: underlyingToken.symbol,
      },
    }),
    displayAmount: formatUnits(amount, underlyingToken.decimals),
    to: res.tx.to,
    data: res.tx.data,
    value: 0n,
  };
};

/**
 * Parses a key, {chainId}-{address}, into a tuple of two strings.
 * @param key The key string to parse
 * @returns A tuple of chainId and address or null if the key is invalid
 */
const parseKey = (key: string): [string, Address] | null => {
  const parts = key.split('-');
  try {
    return parts.length === 2 ? (parts as [string, Address]) : null;
  } catch (error) {
    console.error('Failed to parse key:', error);
    return null;
  }
};

/**
 * Extracts market information from the API response.
 * @param data The API response
 * @returns Market information
 */
const extractMarketInfo = (data: Record<string, any>): Market => {
  const underlyingToken = {
    name: data.underlyingAsset.name,
    symbol: data.underlyingAsset.symbol,
    decimals: data.underlyingAsset.decimals,
    address: data.underlyingAsset.address,
    logoUrl: data.underlyingAsset.simpleIcon,
  };

  const lpToken = {
    name: data.lp.name,
    symbol: data.lp.symbol,
    decimals: data.lp.decimals,
    address: data.lp.address,
    logoUrl: data.lp.proIcon,
  };

  const liquidity = data.liquidity;
  const minApy = Number((data.aggregatedApy * 100).toFixed(2));
  const maxApy = Number((data.maxBoostedApy * 100).toFixed(2));

  return {
    address: data.address,
    underlyingToken,
    lpToken,
    apy: { min: minApy, max: maxApy },
    liquidity,
    rewards: [
      {
        name: 'Pendle',
        desc: LEARN_MORE_DESC,
        logoUrl:
          'https://storage.googleapis.com/prod-pendle-bucket-a/images/assets/pro/ea33e392-1876-46a5-b7ce-c8434b5a7e71.svg',
      },
    ],
  };
};
