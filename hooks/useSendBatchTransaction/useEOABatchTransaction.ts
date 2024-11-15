import { useCallback } from 'react';
import {
  BaseError,
  ReplacementReturnType,
  WaitForTransactionReceiptReturnType,
} from 'viem';
import { getPublicClient, getWalletClient } from 'wagmi/actions';
import invariant from '@/utils/invariant';
import isUserRejectedError from '@/utils/isUserRejectedError';
import {
  BatchTxSteps,
  SendBatchTransactionParameters,
  SendBatchTransactionReturns,
} from './';

export function useEOABatchTransaction() {
  const handleReplacementFailure = useCallback(
    (
      {
        reason,
        replacedTransaction,
        transactionReceipt,
        transaction,
      }: ReplacementReturnType<any>,
      batchTxSteps: BatchTxSteps
    ) => {
      batchTxSteps.push({
        tx_hash: transactionReceipt.transactionHash,
        status: 'failed',
        step: String(batchTxSteps.length + 1),
      });

      invariant(reason !== 'cancelled', 'Transaction cancelled');
      invariant(reason !== 'replaced', 'Transaction replaced');
      invariant(
        replacedTransaction.to === transaction.to &&
          replacedTransaction.input === transaction.input,
        'Repriced transaction mismatch'
      );
      invariant(
        transactionReceipt.status !== 'reverted',
        'Transaction reverted'
      );

      batchTxSteps.pop();
    },
    []
  );

  const getErrorMsgStatus = useCallback((error: Error | BaseError) => {
    return isUserRejectedError(error) ? 'rejected' : 'failed';
  }, []);

  const sendBatchTransaction = useCallback(
    async ({
      transactions,
      config,
      callbacks: {
        onBeforeSendBatchTransaction,
        onBeforeEachTransaction,
        onAfterSendBatchTransaction,
      } = {},
    }: SendBatchTransactionParameters<'eoa'>): Promise<SendBatchTransactionReturns> => {
      const walletClient = await getWalletClient(config);
      const publicClient = getPublicClient(config);

      let error: Error | undefined;
      const batchTxSteps: BatchTxSteps = [];
      try {
        onBeforeSendBatchTransaction?.({ total: transactions.length });

        for (let index = 0; index < transactions.length; index++) {
          let intoReplace = false;
          onBeforeEachTransaction?.({
            total: transactions.length,
            count: index + 1,
          });

          const hash = await walletClient.sendTransaction(transactions[index]);
          const txReceipt = (await publicClient.waitForTransactionReceipt({
            hash,
            confirmations: 1,
            onReplaced: (replacement) => {
              handleReplacementFailure(replacement, batchTxSteps);

              const { transactionReceipt } = replacement;
              intoReplace = true;
              batchTxSteps.push({
                tx_hash: transactionReceipt.transactionHash,
                status: transactionReceipt.status,
                step: String(index + 1),
              });
            },
            // NOTE: we occasionally encounter WaitForTransactionReceiptTimeoutError
            // due to transactions taking too long to be confirmed on the blockchain.
            // Therefore, we have increased the retryCount to try to resolve this issue.
            retryCount: 20,
            retryDelay: ({ count }) => ~~(1 << count) * 500,
          })) as WaitForTransactionReceiptReturnType;

          if (intoReplace) continue;

          batchTxSteps.push({
            tx_hash: hash,
            status: txReceipt.status === 'success' ? 'success' : 'failed',
            step: String(index + 1),
          });
          invariant(txReceipt.status !== 'reverted', 'Transaction reverted');
        }
      } catch (err: any) {
        error = new Error(
          err instanceof BaseError
            ? `${err.name}: ${err.shortMessage}`
            : (err?.message ?? 'Unknown error')
        );

        if (getErrorMsgStatus(error) === 'rejected') {
          // if the user rejected the first transaction , no need to record batchTxSteps for create history
          if (!batchTxSteps.length) throw error;

          batchTxSteps.push({
            tx_hash: '',
            status: 'rejected',
            step: String(batchTxSteps.length + 1),
          });
        }
      } finally {
        onAfterSendBatchTransaction?.();
      }

      if (!batchTxSteps[0]?.tx_hash)
        throw new Error('Transaction Hash Not Found');

      return {
        txHash: batchTxSteps[0].tx_hash,
        batchTxSteps,
        error,
      };
    },
    [handleReplacementFailure, getErrorMsgStatus]
  );

  return { sendBatchTransaction };
}
