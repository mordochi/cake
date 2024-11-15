export const dynamic =
  process.env.NEXT_PUBLIC_APP_ENV !== 'production' ? 'force-dynamic' : 'auto';

import { Asset } from 'contentful';
import {
  BATCH_PROTOCOL,
  BATCH_TAG,
  ProtocolEntrySkeleton,
  TagEntrySkeleton,
} from '@/types/contentful';
import client from '@/utils/contentfulClient';

type Protocol = {
  id: string;
  name: string;
  link: string;
  icon: { title: string; url: string } | undefined;
};

type Tag = string;

export type GetCaseFiltersResponse = {
  protocols: Protocol[];
  tags: Tag[];
};

export async function GET(_: Request) {
  try {
    const [protocols, tags] = await Promise.all([
      client
        .getEntries<ProtocolEntrySkeleton>({
          content_type: BATCH_PROTOCOL,
        })
        .then((res) =>
          res.items.map(({ fields: { icon: _icon, ...rests } }) => {
            const icon = _icon as Asset;
            return {
              ...rests,
              ...(icon && {
                icon: {
                  title: icon.fields?.title ?? '',
                  url: icon.fields?.file?.url ?? '',
                },
              }),
            };
          })
        ),
      client
        .getEntries<TagEntrySkeleton>({
          content_type: BATCH_TAG,
        })
        .then((res) => res.items.map((tag) => tag.fields.title)),
      ,
    ]);

    return Response.json({ protocols, tags });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
