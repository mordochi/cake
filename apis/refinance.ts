import { baseApiCaller } from '@/utils/apiCaller';

export type RefinanceAsset = {
  chain_id: number;
  type: string;
  protocol: string;
  asset: string;
  detail: {
    withdraw_case_id: string;
    supply_case_id: string;
  };
  amount: string;
};

type RefinanceResponse = {
  assets: RefinanceAsset[];
};

export type RefinanceToResponse = {
  cases: Omit<RefinanceAsset, 'Amount'>[];
};

export async function refinanceFromAccount({
  address,
  queryPath,
}: {
  address: string;
  queryPath: string;
}) {
  const response = await baseApiCaller.get<RefinanceResponse>(
    `/account/${address}/refinance/${queryPath}`
  );
  return response.data;
}

export async function refinanceTo({
  chainId,
  queryPath,
}: {
  chainId?: number;
  queryPath: string;
}) {
  const chainParam = chainId !== undefined ? `?chain_id=${chainId}` : '';
  const response = await baseApiCaller.get(
    `/refinance/${queryPath}${chainParam}`
  );

  return response.data;
}
