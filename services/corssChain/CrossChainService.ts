import { Address } from 'viem';
import {
  StargatePoolType,
  stargatePools,
} from '@/constants/crossChain/stargatePools';
import {
  UniversalComposerType,
  universalComposer,
} from '@/constants/crossChain/universalComposer';

class CrossChainService {
  pools: StargatePoolType[];
  composers: UniversalComposerType;

  constructor(pools: StargatePoolType[], composers: UniversalComposerType) {
    this.pools = pools;
    this.composers = composers;
  }

  getComposerByChainIdAndSymbol(
    chainId: number,
    tokenSymbol: string
  ): Address | undefined {
    return this.composers[chainId]?.[tokenSymbol];
  }

  getPoolByChainIdAndSymbol(
    chainId: number,
    tokenSymbol: string
  ): StargatePoolType | undefined {
    return this.pools.find(
      (pool) => pool.chainId === chainId && pool.symbol === tokenSymbol
    );
  }

  getAvailablePoolsByDestSymbol(tokenSymbol: string): StargatePoolType[] {
    return this.pools.filter((pool) => pool.symbol === tokenSymbol);
  }

  getAvailablePoolsChainIdsByDestSymbol(tokenSymbol: string): number[] {
    return Array.from(
      new Set(
        this.getAvailablePoolsByDestSymbol(tokenSymbol).map(
          (pool) => pool.chainId
        )
      )
    );
  }

  isPassingChainIdSupportDestSymbol(chainId: number, tokenSymbol: string) {
    return this.getAvailablePoolsChainIdsByDestSymbol(tokenSymbol).includes(
      chainId
    );
  }
}

const service = new CrossChainService(stargatePools, universalComposer);

export default service;
