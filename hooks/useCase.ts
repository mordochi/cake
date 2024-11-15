import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { BatchCase } from '@/cases/types';
import useCases from './useCases';

type useCaseReturnType = {
  batchCase: BatchCase;
  isEqualConnectedChain: boolean;
};

const useCase = (): useCaseReturnType => {
  const { caseId } = useParams<{ caseId: string }>();
  const { casesMap } = useCases();
  const { chainId, isConnected } = useAccount();

  return useMemo(() => {
    const batchCase = casesMap[caseId];
    return {
      batchCase,
      isEqualConnectedChain: isConnected && batchCase.networkId === chainId,
    };
  }, [casesMap, caseId, isConnected, chainId]);
};

export default useCase;
