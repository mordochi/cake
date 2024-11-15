import { switchChain } from '@wagmi/core';
import { useEffect } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { config as staticConfig } from '@/utils/wagmi';

export default function useAutoSwitchChain(
  chainId: (typeof staticConfig)['chains'][number]['id']
) {
  const { address, chain } = useAccount();
  const config = useConfig();
  const connectedConnector = [...config.state.connections][0]?.[1]?.connector;

  useEffect(() => {
    if (
      window.ethereum?.isBlocto &&
      chain &&
      chainId &&
      chain?.id !== chainId &&
      connectedConnector?.id === 'blocto' &&
      connectedConnector?.switchChain
    ) {
      switchChain(config, { chainId }).catch(() => {});
    }
  }, [
    address,
    chainId,
    config,
    chain,
    connectedConnector?.id,
    connectedConnector?.switchChain,
  ]);
}
