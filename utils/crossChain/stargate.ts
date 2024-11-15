import { Address, formatUnits, getContract } from 'viem';
import { parseAbi } from 'viem/utils';
import { StakeChainType } from '@/cases/types';
import { getDecimals } from '@/cases/utils';
import PublicClient from '@services/publicClient';
import { Token } from '../approveAndSwapTx';
import { getTokenBalance } from '../token';

const abi = parseAbi(['function token() external view returns (address)']);

export const getStargatePoolToken = async (
  stargatePool: Address,
  chain: StakeChainType
) => {
  const client = PublicClient.get(chain);

  const tokenContract = getContract({
    address: stargatePool,
    abi: abi,
    client,
  });

  const token = (await tokenContract.read.token()) as Address;
  return token;
};

export const getStargatePoolTokenInfo = async ({
  stargatePoolAddress,
  chain,
  userAddress,
  symbol,
}: {
  stargatePoolAddress: Address;
  chain: StakeChainType;
  userAddress: Address;
  symbol: string;
}): Promise<Token> => {
  const dstTokenAddress = await getStargatePoolToken(
    stargatePoolAddress,
    chain
  );
  const [dstTokenDecimals, dstTokenBalance] = await Promise.all([
    getDecimals(dstTokenAddress, chain),
    getTokenBalance({
      tokenAddress: dstTokenAddress,
      address: userAddress,
      chain: chain,
    }),
  ]);

  return {
    address: dstTokenAddress,
    decimals: dstTokenDecimals,
    amount: formatUnits(dstTokenBalance, dstTokenDecimals),
    symbol: symbol,
    chainId: chain.id,
  };
};
