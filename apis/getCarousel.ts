import { GetCarouselResponse } from '@/app/contentful/api/carousel/route';
import { selfApiCaller } from '@/utils/apiCaller';

const getCarousel = (options?: RequestInit) =>
  selfApiCaller.get<GetCarouselResponse>('/contentful/api/carousel', options);

export default getCarousel;
