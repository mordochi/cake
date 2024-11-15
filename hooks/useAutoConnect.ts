import { track } from '@amplitude/analytics-browser';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';

export default function useAutoConnect() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect({
    mutation: {
      onSuccess({}) {
        track('connect_wallet_success', {
          wallet: 'blocto',
        });
      },
    },
  });

  useEffect(() => {
    try {
      if (window.ethereum?.isBlocto && !address) {
        const blocto = connectors?.find(
          (connector) => connector.id === 'blocto'
        );
        if (!blocto) return;
        connect({ connector: blocto });
      }
    } catch (error) {}
  }, [address, connect, connectors]);
}
