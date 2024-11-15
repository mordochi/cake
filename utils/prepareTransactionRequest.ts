import { Hex, decodeFunctionData, toHex } from 'viem';
import {
  PrepareTransactionRequestReturnType,
  getWalletClient,
} from 'wagmi/actions';
import { Tx } from '@/cases/types';
import { config } from '@/utils/wagmi';

export const prepareTransactionRequest = async (
  tx: Omit<Tx, 'name' | 'description'>,
  isCoinbase: boolean
) => {
  const client = await getWalletClient(config);
  return client.prepareTransactionRequest({
    to: tx.to,
    // We force the value to be a hex string to be able to send the request through method {client.request}
    // @ts-ignore
    value: toHex(tx.value),
    // @ts-ignore
    data:
      isCoinbase && tx?.data
        ? decodeFunctionData({
            abi: tx.abi!,
            data: tx.data!,
          })
        : tx.data,
    gas: tx.gas,
    parameters: [],
    abi: isCoinbase ? tx.abi : undefined,
  }) as unknown as { value?: Hex } & Omit<
    PrepareTransactionRequestReturnType,
    'value'
  >; // We have to overwrite the type because we turn {value} into hex string
};
