import { Address } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  scroll,
} from 'viem/chains';
import { ChainId } from '@/types';

export type StargatePoolType = {
  chainId: ChainId;
  address: Address;
  symbol: string;
  endpointID: bigint;
};

// DOCS: https://stargateprotocol.gitbook.io/stargate/v/v2-developer-docs/technical-reference/mainnet-contracts#ethereum
export const stargatePools: StargatePoolType[] = [
  // mainnet
  {
    chainId: mainnet.id,
    address: '0x77b2043768d28E9C9aB44E1aBfC95944bcE57931',
    symbol: 'ETH',
    endpointID: 30101n,
  },
  {
    chainId: mainnet.id,
    address: '0xc026395860Db2d07ee33e05fE50ed7bD583189C7',
    symbol: 'USDC',
    endpointID: 30101n,
  },
  {
    chainId: mainnet.id,
    address: '0x933597a323Eb81cAe705C5bC29985172fd5A3973',
    symbol: 'USDT',
    endpointID: 30101n,
  },

  // bsc
  {
    chainId: bsc.id,
    address: '0x962Bd449E630b0d928f308Ce63f1A21F02576057',
    symbol: 'USDC',
    endpointID: 30102n,
  },
  {
    chainId: bsc.id,
    address: '0x138EB30f73BC423c6455C53df6D89CB01d9eBc63',
    symbol: 'USDT',
    endpointID: 30102n,
  },

  // avalanche
  {
    chainId: avalanche.id,
    address: '0x5634c4a5FEd09819E3c46D86A965Dd9447d86e47',
    symbol: 'USDC',
    endpointID: 30106n,
  },
  {
    chainId: avalanche.id,
    address: '0x12dC9256Acc9895B076f6638D628382881e62CeE',
    symbol: 'USDT',
    endpointID: 30106n,
  },

  // polygon
  {
    chainId: polygon.id,
    address: '0x9Aa02D4Fae7F58b8E8f34c66E756cC734DAc7fe4',
    symbol: 'USDC',
    endpointID: 30109n,
  },
  {
    chainId: polygon.id,
    address: '0xd47b03ee6d86Cf251ee7860FB2ACf9f91B9fD4d7',
    symbol: 'USDT',
    endpointID: 30109n,
  },

  // arbitrum
  {
    chainId: arbitrum.id,
    address: '0xA45B5130f36CDcA45667738e2a258AB09f4A5f7F',
    symbol: 'ETH',
    endpointID: 30110n,
  },
  {
    chainId: arbitrum.id,
    address: '0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
    symbol: 'USDC',
    endpointID: 30110n,
  },
  {
    chainId: arbitrum.id,
    address: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
    symbol: 'USDT',
    endpointID: 30110n,
  },

  // optimism
  {
    chainId: optimism.id,
    address: '0xe8CDF27AcD73a434D661C84887215F7598e7d0d3',
    symbol: 'ETH',
    endpointID: 30111n,
  },
  {
    chainId: optimism.id,
    address: '0xcE8CcA271Ebc0533920C83d39F417ED6A0abB7D0',
    symbol: 'USDC',
    endpointID: 30111n,
  },
  {
    chainId: optimism.id,
    address: '0x19cFCE47eD54a88614648DC3f19A5980097007dD',
    symbol: 'USDT',
    endpointID: 30111n,
  },

  // base
  {
    chainId: base.id,
    address: '0xdc181Bd607330aeeBEF6ea62e03e5e1Fb4B6F7C7',
    symbol: 'ETH',
    endpointID: 30184n,
  },
  {
    chainId: base.id,
    address: '0x27a16dc786820B16E5c9028b75B99F6f604b5d26',
    symbol: 'USDC',
    endpointID: 30184n,
  },

  // scroll
  {
    chainId: scroll.id,
    address: '0xC2b638Cb5042c1B3c5d5C969361fB50569840583',
    symbol: 'ETH',
    endpointID: 30214n,
  },
  {
    chainId: scroll.id,
    address: '0x3Fc69CC4A842838bCDC9499178740226062b14E4',
    symbol: 'USDC',
    endpointID: 30214n,
  },
] as const;
