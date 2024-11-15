import { PrepareTransactionRequestReturnType } from 'wagmi/actions';
import { baseApiCaller } from '@/utils/apiCaller';

export default function estimateGas({
  address,
  chainId,
  transactions,
}: {
  address: string;
  chainId: number;
  transactions: Array<
    { value: string } & Omit<PrepareTransactionRequestReturnType, 'value'>
  >;
}) {
  return baseApiCaller.post<{ gas_used: string }>(
    `/account/${address}/estimate/${chainId}/transactions`,
    { transactions }
  );
}
