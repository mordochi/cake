import { baseApiCaller, selfApiCaller } from './apiCaller';

const apiFetcher = (route: string) =>
  baseApiCaller.get(route).then((r) => r.data);

const selfFetcher = (route: string) =>
  selfApiCaller.get(route).then((r) => r.data);

export { selfFetcher, apiFetcher };
