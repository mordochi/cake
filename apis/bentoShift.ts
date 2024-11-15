import { Address } from 'viem';
import { baseApiCaller } from '@/utils/apiCaller';

export type availableTokens = {
  contract_address: Address;
  chain_id: number;
  symbol: string;
  name: string;
  amount: string;
};

export type availableVaults = {
  amount: string;
  apy: string;
  chain_id: number;
  protocol: string;
  symbol: string;
  contract_address: Address;
};

export type ShiftFromResponse = {
  available_tokens: availableTokens[];
  available_vaults: availableVaults[];
};

export type ShiftDestination = {
  protocol: string;
  chain_id: number;
  name: string;
  apy: string;
  underlying_token: {
    contract_address: Address;
    symbol: string;
    name: string;
  };
};
export type ShiftToResponse = {
  shift_destinations: ShiftDestination[];
};

export async function refinanceFromAccount({
  address,
  queryPath,
}: {
  address: string;
  queryPath: string;
}) {
  const response = await baseApiCaller.get<ShiftFromResponse>(
    `/account/${address}/refinance/${queryPath}`
  );
  return response.data;
}

export async function shiftFrom({
  address = '0x0',
  queryPath,
}: {
  address: `0x${string}`;
  queryPath: string;
}) {
  const response = await baseApiCaller.get<ShiftFromResponse>(
    `/shift/address/${address}/source?protocol=${queryPath}`
  );

  return response.data;
}

export async function shiftTo({
  address = '0x0',
  protocol,
}: {
  address?: `0x${string}`;
  protocol: string;
}) {
  const response = await baseApiCaller.get<ShiftToResponse>(
    `/shift/address/${address}/destination?protocol=${protocol}`
  );

  return response.data;
}
