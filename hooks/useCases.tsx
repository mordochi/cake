import { useMemo } from 'react';
import { BatchCase } from '@/cases/types';
import { useContentfulData } from '@/context/contentfulContext';

const useCases = () => {
  const { cases } = useContentfulData();

  return useMemo(() => {
    const casesMap = cases.reduce<Record<BatchCase['id'], BatchCase>>(
      (prev, curr) => ({
        ...prev,
        [curr.id]: curr,
      }),
      {}
    );

    return {
      cases,
      casesMap,
    };
  }, [cases]);
};

export default useCases;
