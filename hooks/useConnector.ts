import { useMemo } from 'react';
import { Connector, useAccount } from 'wagmi';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  zora,
} from 'wagmi/chains';
import { WalletType } from '@/cases/types';
import { formatConnectorId } from '@/utils/formatConnectorId';
import { CHAINS } from '@/utils/generateHttpEndpoint';
import { walletTypes } from '@/utils/wagmi';

const coinbaseSupportedChains: number[] = [
  arbitrum.id,
  optimism.id,
  zora.id,
  polygon.id,
  base.id,
  bsc.id,
  avalanche.id,
  mainnet.id,
];

export const getWalletSupportChain = (id: string, chainId: number) => {
  if (id === 'coinbaseWallet') {
    return coinbaseSupportedChains.includes(chainId);
  }
  return CHAINS.some((c) => c.id === chainId);
};

interface ConnectorType {
  isBlocto: boolean;
  isMetaMask: boolean;
  isCoinbase: boolean;
  isEOAWallet: boolean;
  isAAWallet: boolean;
  isSupportChain: (caseId: number) => boolean;
}

const defaultData: ConnectorType = {
  isBlocto: false,
  isMetaMask: false,
  isCoinbase: false,
  isEOAWallet: false,
  isAAWallet: false,
  isSupportChain: () => false,
};

const buildConnectorTypes = (
  walletTypes: Record<string, WalletType>
): { [key: string]: ConnectorType } => {
  return Object.entries(walletTypes).reduce(
    (acc, [key, walletType]) => {
      acc[key] = {
        ...defaultData,
        isBlocto: key === 'blocto',
        isCoinbase: key === 'coinbaseWallet',
        isMetaMask: key === 'metaMask',
        isEOAWallet: walletType === WalletType.EOA,
        isAAWallet: walletType === WalletType.AA,
      };
      return acc;
    },
    {} as { [key: string]: ConnectorType }
  );
};

const connectorTypes = buildConnectorTypes(walletTypes);

const useConnector = (): { isConnected: boolean } & ConnectorType &
  Partial<ReturnType<typeof useAccount>['connector']> => {
  const { connector } = useAccount();

  return useMemo(() => {
    if (!connector) {
      return { ...defaultData, isConnected: false };
    }

    const id = formatConnectorId(connector.id);
    const isSupportChain = (caseId: number) =>
      getWalletSupportChain(id, caseId);

    // Automatically bind all methods to the correct context
    const boundConnector = Object.keys(connector).reduce((acc, key) => {
      const value = connector[key as keyof Connector];
      acc[key as keyof Connector] =
        typeof value === 'function' ? value.bind(connector) : value;
      return acc;
    }, {} as Connector);

    return {
      ...connectorTypes[id],
      ...boundConnector,
      isSupportChain,
      isConnected: !!connector,
    };
  }, [connector]);
};

export default useConnector;
