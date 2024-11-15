import { useCallback } from 'react';
import { Hex, erc20Abi } from 'viem';
import { useCallsStatus, useWriteContracts } from 'wagmi/experimental';
import {
  SendBatchTransactionParameters,
  SendBatchTransactionReturns,
} from './';

export function useCoinbaseBatchTransaction() {
  const { data: id, writeContractsAsync } = useWriteContracts();
  const { refetch: refetchCallsStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
    },
  });

  const sendBatchTransaction = useCallback(
    async ({
      transactions,
    }: SendBatchTransactionParameters<'coinbase'>): Promise<SendBatchTransactionReturns> => {
      try {
        const formattedContracts = transactions.map((tx) => {
          const { functionName, args } = tx?.data || {
            functionName: 'transfer',
            args: [tx.to, tx.value],
          };
          return {
            address: tx.to as `0x${string}`,
            abi: tx.abi || erc20Abi, // native token need provide erc20Abi
            functionName,
            args,
            value: tx?.value,
          };
        });

        await writeContractsAsync({
          contracts: formattedContracts,
        });
        const waitForConfirmation = async () => {
          return new Promise<Hex>((resolve, reject) => {
            const interval = setInterval(async () => {
              try {
                const { data } = await refetchCallsStatus();
                if (data?.status === 'CONFIRMED') {
                  clearInterval(interval);
                  const { transactionHash } = data.receipts?.[0] || {};
                  if (!transactionHash)
                    throw new Error('Transaction Hash Not Found');
                  resolve(transactionHash);
                }
              } catch (error) {
                clearInterval(interval);
                reject(error);
              }
            }, 1500); // Poll every 1.5 seconds
          });
        };
        const txHash = await waitForConfirmation();

        return {
          txHash,
        };
      } catch (err: any) {
        throw new Error(err);
      }
    },
    [writeContractsAsync, refetchCallsStatus]
  );

  return { sendBatchTransaction };
}
