import { useMemo } from 'react';
import useSWR from 'swr';
import { apiFetcher } from '@/utils/fetcher';

type Token = {
  contractAddress: string;
  symbol: string;
  name: string;
};

type useTokensReturnType = {
  tokens: Token[];
  isLoading: boolean;
  isError: boolean;
};

type GetTokensResponse = {
  chain_id: number;
  tokens: {
    contract_address: string;
    symbol: string;
    name: string;
  }[];
};

function useTokens({ chainId }: { chainId: number }): useTokensReturnType {
  const { data, error, isLoading } = useSWR<GetTokensResponse>(
    !!chainId ? `/tokens/${chainId}` : null,
    apiFetcher
  );
  return useMemo(() => {
    const tokens = data?.tokens?.length
      ? (data.tokens
          .map(({ contract_address, ...rests }) =>
            // This is a workaround to filter out MATIC ERC20 token: https://polygonscan.com/address/0x0000000000000000000000000000000000001010
            // This seems to be added after the polygon migration: https://polygon.technology/blog/save-the-date-matic-pol-migration-coming-september-4th-everything-you-need-to-know
            chainId !== 137 || rests.symbol !== 'MATIC'
              ? {
                  contractAddress: contract_address,
                  ...rests,
                }
              : undefined
          )
          .filter(Boolean) as Token[])
      : [];

    return {
      tokens,
      isLoading,
      isError: error,
    };
  }, [chainId, data?.tokens, error, isLoading]);
}

export default useTokens;
export type { useTokensReturnType };
