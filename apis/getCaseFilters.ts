import { GetCaseFiltersResponse } from '@/app/contentful/api/cases-filters/route';
import { selfApiCaller } from '@/utils/apiCaller';

const getCaseFilters = (options?: RequestInit) =>
  selfApiCaller.get<GetCaseFiltersResponse>(
    '/contentful/api/cases-filters',
    options
  );

export default getCaseFilters;
