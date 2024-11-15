import { useMemo } from 'react';
import { Abi, Hex, TransactionRequestLegacy, decodeFunctionData } from 'viem';
import useConnector from '@/hooks/useConnector';
import { config } from '@/utils/wagmi';
import { useBloctoBatchTransaction } from './useBloctoBatchTransaction';
import { useCoinbaseBatchTransaction } from './useCoinbaseBatchTransaction';
import { useEOABatchTransaction } from './useEOABatchTransaction';

type OnBeforeSendBatchTransaction = (data: { total: number }) => void;
type onBeforeEachTransaction = (data: { total: number; count: number }) => void;
type EOATransaction = object & TransactionRequestLegacy;
type BloctoTransaction = Omit<TransactionRequestLegacy, 'value'> & {
  value?: Hex;
}; // We have to overwrite the type because {client.request} cannot parse bigint numbers
type CoinbaseTransaction = Omit<TransactionRequestLegacy, 'data'> & {
  abi: Abi;
  data: ReturnType<typeof decodeFunctionData>;
};
type Transaction<type> = type extends 'blocto'
  ? BloctoTransaction
  : type extends 'coinbase'
    ? CoinbaseTransaction
    : EOATransaction;
type SendBatchTransactionParameters<
  type extends 'eoa' | 'blocto' | 'coinbase' = 'eoa' | 'blocto' | 'coinbase',
> = {
  transactions: Array<Transaction<type>>;
  config: typeof config;
  revertFlag?: boolean;
  callbacks?: {
    onBeforeSendBatchTransaction?: OnBeforeSendBatchTransaction;
    onBeforeEachTransaction?: onBeforeEachTransaction;
    onAfterSendBatchTransaction?: () => void;
  };
};

export type BatchTxSteps = {
  status: string;
  tx_hash: Hex | '';
  step: string;
}[];

type SendBatchTransactionReturns = {
  txHash: Hex;
  batchTxSteps?: BatchTxSteps;
  error?: Error;
};

export function useSendBatchTransaction() {
  const coinbaseBatchTransaction = useCoinbaseBatchTransaction();
  const bloctoBatchTransaction = useBloctoBatchTransaction();
  const eoaBatchTransaction = useEOABatchTransaction();
  const { isBlocto, isMetaMask, isCoinbase } = useConnector();

  return useMemo((): {
    sendBatchTransaction: (
      params: SendBatchTransactionParameters
    ) => Promise<SendBatchTransactionReturns>;
  } => {
    if (isBlocto) {
      return bloctoBatchTransaction;
    }
    if (isMetaMask) {
      return eoaBatchTransaction;
    }
    if (isCoinbase) {
      return coinbaseBatchTransaction;
    }
    return {
      sendBatchTransaction: async () => {
        throw new Error('Unsupported connector');
      },
    };
  }, [
    isBlocto,
    isMetaMask,
    isCoinbase,
    bloctoBatchTransaction,
    eoaBatchTransaction,
    coinbaseBatchTransaction,
  ]);
}

export default useSendBatchTransaction;
export type {
  SendBatchTransactionParameters,
  SendBatchTransactionReturns,
  OnBeforeSendBatchTransaction,
  onBeforeEachTransaction,
};
