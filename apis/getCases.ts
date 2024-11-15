import { GetCasesResponse } from '@/app/contentful/api/cases/route';
import { selfApiCaller } from '@/utils/apiCaller';

const getCases = (options?: RequestInit) =>
  selfApiCaller.get<GetCasesResponse>('/contentful/api/cases', options);

export default getCases;
