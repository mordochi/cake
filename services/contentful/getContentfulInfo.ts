import getCarousel from '@/apis/getCarousel';
import getCaseFilters from '@/apis/getCaseFilters';
import getCases from '@/apis/getCases';

const OPTIONS = { next: { revalidate: 3600 } };

const extractFulfilledValue = <T>(
  result: PromiseSettledResult<T>,
  defaultValue: T
): T => {
  return result.status === 'fulfilled' ? result.value : defaultValue;
};

const getContentfulInfo = async () => {
  const casesRes = getCases(OPTIONS);
  const carouselRes = getCarousel(OPTIONS);
  const filtersRes = getCaseFilters(OPTIONS);

  const results = await Promise.allSettled([casesRes, carouselRes, filtersRes]);
  const [casesResult, carouselResult, filtersResult] = results;

  const cases = extractFulfilledValue<Pick<Awaited<typeof casesRes>, 'data'>>(
    casesResult,
    { data: { cases: [] } }
  ).data.cases;
  const carousels = extractFulfilledValue<
    Pick<Awaited<typeof carouselRes>, 'data'>
  >(carouselResult, { data: [] }).data;
  const { protocols, tags } = extractFulfilledValue<
    Pick<Awaited<typeof filtersRes>, 'data'>
  >(filtersResult, {
    data: {
      protocols: [],
      tags: [],
    },
  }).data;

  return { cases, carousels, protocols, tags };
};

export type ContentfulInfo = Awaited<ReturnType<typeof getContentfulInfo>>;
export default getContentfulInfo;
