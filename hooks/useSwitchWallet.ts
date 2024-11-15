import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';

const useSwitchWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect({
    mutation: {
      onSettled: () => {
        openConnectModal?.();
      },
    },
  });

  return { switchWallet: disconnect };
};

export default useSwitchWallet;
