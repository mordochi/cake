import { LRUCache } from 'lru-cache';
import {
  Address,
  createPublicClient,
  createWalletClient,
  erc20Abi,
  getContract,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet, sepolia } from 'viem/chains';
import 'dotenv/config';

const cache = new LRUCache({
  max: 1000,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export const publicClient = createPublicClient({
  batch: {
    multicall: true,
  },
  chain: mainnet,
  transport: http(),
});

export const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.NOTIF_PRIVATE_KEY as `0x${string}`),
  chain: sepolia,
  transport: http(),
});

export const aprToApy = (apr: number, compound: number): number => {
  return (1 + apr / compound) ** compound - 1;
};

export const NATIVE_TOKEN_ADDRESS =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const RAY_DECIMALS = 27;

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
}

export interface APYProvider {
  id: string;
  name: string;
  siteUrl: string;
  getAPY(inputToken: Token): Promise<number>;
}

export const getTokenInfo = async (
  tokenAddress: Address
): Promise<Token | null> => {
  const chain = mainnet;
  return getCachedData(`getTokenInfo-${chain.id}-${tokenAddress}`, async () => {
    try {
      if (tokenAddress === NATIVE_TOKEN_ADDRESS) {
        return {
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol,
          decimals: chain.nativeCurrency.decimals,
          address: tokenAddress,
        };
      }

      const client = publicClient;

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
      };
      return token;
    } catch (error) {
      console.error('Failed to get token info:', error);
      return null;
    }
  });
};

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
