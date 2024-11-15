import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { GetCarouselResponse } from '@/app/contentful/api/carousel/route';
import { GetCaseFiltersResponse } from '@/app/contentful/api/cases-filters/route';
import { BatchCase, BatchCaseInContentful } from '@/cases/types';

interface CommonContentfulData {
  carousels: GetCarouselResponse;
  protocols: GetCaseFiltersResponse['protocols'];
  tags: GetCaseFiltersResponse['tags'];
}

interface IState extends CommonContentfulData {
  cases: BatchCase[];
}

const DEFAULT_STATE: IState = {
  cases: [],
  carousels: [],
  protocols: [],
  tags: [],
};

const ContentfulContext = createContext<IState>(DEFAULT_STATE);

export const useContentfulData = () => useContext(ContentfulContext);

type ContentfulProviderProps = PropsWithChildren<{
  data: CommonContentfulData & {
    cases: BatchCaseInContentful[];
  };
}>;

export const ContentfulProvider = ({
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data: { cases, ...rest },
}: ContentfulProviderProps) => {
  const value = useMemo(() => {
    return {
      ...rest,
      cases: [],
    };
  }, [rest]);

  return (
    <ContentfulContext.Provider value={value}>
      {children}
    </ContentfulContext.Provider>
  );
};
