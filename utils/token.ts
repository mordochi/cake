import { Address, erc20Abi, getContract } from 'viem';
import { StakeChainType } from '@/cases/types';
import { _1INCH_NATIVE_TOKEN_ADDRESS } from '@/constants';
import PublicClient from '@services/publicClient';

class PlatformFeeExceededError extends Error {
  constructor() {
    super('Platform fee exceeded.');
  }
}

const getTokenDecimals = async ({
  chain,
  tokenAddress,
}: {
  chain: StakeChainType;
  tokenAddress: Address;
}) => {
  const client = PublicClient.get(chain);
  const erc20Contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client,
  });

  return erc20Contract.read.decimals();
};

const getTokenSymbol = async ({
  chain,
  tokenAddress,
}: {
  chain: StakeChainType;
  tokenAddress: Address;
}) => {
  const client = PublicClient.get(chain);
  const erc20Contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client,
  });

  return erc20Contract.read.symbol();
};

const isNativeAsset = (tokenAddress?: Address) =>
  !tokenAddress ||
  tokenAddress.toLowerCase() === _1INCH_NATIVE_TOKEN_ADDRESS ||
  tokenAddress === '0x';

const getTokenBalance = async ({
  chain,
  tokenAddress,
  address,
}: {
  chain: StakeChainType;
  tokenAddress: Address;
  address: Address;
}) => {
  const client = PublicClient.get(chain);
  const erc20Contract = getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client,
  });

  return erc20Contract.read.balanceOf([address]);
};

export {
  PlatformFeeExceededError,
  getTokenDecimals,
  getTokenSymbol,
  isNativeAsset,
  getTokenBalance,
};
