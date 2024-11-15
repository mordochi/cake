import { PropsWithChildren, createContext, useContext } from 'react';

interface CaseStat {
  bento_id: string;
  unique_address_count: number;
  total_history_count: number;
}
export interface CaseStatsResponse {
  cases: CaseStat[];
}

type IState = CaseStatsResponse;

const DEFAULT_STATE: IState = {
  cases: [],
};

const CaseStatsContext = createContext<IState>(DEFAULT_STATE);

export const useCaseStats = () => useContext(CaseStatsContext);

type CaseStatsProvider = PropsWithChildren<{ data: IState }>;

export const CaseStatsProvider = ({ children, data }: CaseStatsProvider) => {
  return (
    <CaseStatsContext.Provider value={data}>
      {children}
    </CaseStatsContext.Provider>
  );
};
