import { Address, encodeFunctionData, erc20Abi } from 'viem';
import { Tx } from '@/cases/types';

const generatePlatformFeeTx = ({
  receiver,
  amount,
  tokenAddress,
}: {
  receiver: Address;
  amount: bigint;
  tokenAddress?: Address;
}): { tx: Omit<Tx, 'name' | 'description'> } => {
  const isTransferringNativeToken = !tokenAddress || tokenAddress === '0x0';

  if (isTransferringNativeToken) {
    return { tx: { to: receiver, value: amount, abi: undefined } };
  }

  return {
    tx: {
      to: tokenAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [receiver, amount],
      }),
      abi: erc20Abi,
    },
  };
};

export default generatePlatformFeeTx;
