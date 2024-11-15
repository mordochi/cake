import { useConnectModal } from '@rainbow-me/rainbowkit';
import { switchChain } from '@wagmi/core';
import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { config as staticConfig } from '@/utils/wagmi';

export default function useTrackableConnectModal() {
  const { openConnectModal } = useConnectModal();
  const config = useConfig();

  const connect = useCallback(
    async ({
      chainId,
    }: {
      chainId?: (typeof staticConfig)['chains'][number]['id'];
    } = {}) => {
      try {
        if (chainId) {
          await switchChain(config, { chainId });
        }
        openConnectModal?.();
      } catch (error) {}
    },
    [config, openConnectModal]
  );

  return { connect };
}
