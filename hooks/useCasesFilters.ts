import { useMemo } from 'react';
import { GetCaseFiltersResponse } from '@/app/contentful/api/cases-filters/route';
import { useContentfulData } from '@/context/contentfulContext';

type Protocol = GetCaseFiltersResponse['protocols'][number];
type Tag = GetCaseFiltersResponse['tags'][number];

const useCasesFilters = () => {
  const { protocols, tags } = useContentfulData();

  return useMemo(
    () => ({
      tags:
        tags.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())) ||
        [],
      protocols: protocols.reduce<Record<Protocol['id'], Protocol>>(
        (prev, curr) => ({ ...prev, [curr.id]: curr }),
        {}
      ),
    }),
    [protocols, tags]
  );
};

type useCasesFiltersReturnType = ReturnType<typeof useCasesFilters>;

export type { useCasesFiltersReturnType, Protocol, Tag };
export default useCasesFilters;
