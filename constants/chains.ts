import { config } from '@/utils/wagmi';

export const supportChains = config.chains?.reduce(
  (acc, chain) => {
    acc[chain.id] = chain.name;
    return acc;
  },
  {} as { [key: number]: string }
);

export const mapChainIdToName = (id: number) => {
  return supportChains[id];
};
