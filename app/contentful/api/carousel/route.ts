export const dynamic =
  process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? 'force-dynamic' : 'auto';

import { Asset } from 'contentful';
import { BATCH_CAROUSEL, CarouselEntrySkeleton } from '@/types/contentful';
import client from '@/utils/contentfulClient';

export type GetCarouselResponse = {
  id: string;
  order: number;
  bgImage: string;
}[];

export async function GET() {
  try {
    const response = await client
      .getEntries<CarouselEntrySkeleton>({ content_type: BATCH_CAROUSEL })
      .then((res) =>
        res.items
          .map(({ fields: { id, bgImage, order } }) => ({
            id,
            order,
            bgImage: (bgImage as Asset)?.fields?.file?.url || '',
          }))
          .sort((a, b) => a.order - b.order)
      );

    return Response.json(response);
  } catch (error: any) {
    return Response.json(
      { error: error?.message || 'Get Contentful Unknown error' },
      { status: 500 }
    );
  }
}
