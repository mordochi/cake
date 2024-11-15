import { Hex } from 'viem';
import { getWalletClient } from 'wagmi/actions';
import {
  SendBatchTransactionParameters,
  SendBatchTransactionReturns,
} from './';

export function useBloctoBatchTransaction() {
  const sendBatchTransaction = async ({
    transactions,
    config,
    revertFlag,
  }: SendBatchTransactionParameters<'blocto'>): Promise<SendBatchTransactionReturns> => {
    const client = await getWalletClient(config);
    const formattedTxs = transactions.map((tx: any) =>
      Object.keys(tx).reduce((initial: any, current: any) => {
        initial[current] =
          typeof tx[current] === 'bigint' && current === 'gas'
            ? `0x${tx[current].toString(16)}`
            : tx[current];
        return initial;
      }, {})
    );
    const txHash = (await client.request({
      // @ts-ignore
      method: 'wallet_sendMultiCallTransaction',
      // @ts-ignore
      params: [formattedTxs, revertFlag],
    })) as Hex;
    return { txHash };
  };

  return { sendBatchTransaction };
}
