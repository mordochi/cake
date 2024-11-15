import { Asset, EntryCollection } from 'contentful';
import { BatchCaseInContentful, Tag } from '@/cases/types';
import {
  BATCH_CONTENTS,
  BatchContentsEntrySkeleton,
  BenefitEntrySkeleton,
  CuratorEntrySkeleton,
  ProtocolEntrySkeleton,
  TagEntrySkeleton,
  WebsiteEntrySkeleton,
} from '@/types/contentful';
import client from '@/utils/contentfulClient';
const formatCases = (
  rawCases: EntryCollection<BatchContentsEntrySkeleton, undefined, string>
) => {
  return rawCases.items.map<BatchCaseInContentful>((rawCase) => {
    const curator = rawCase.fields.curator as unknown as CuratorEntrySkeleton;
    const website = rawCase.fields.website as unknown as WebsiteEntrySkeleton;
    const tags = (rawCase.fields.tags as unknown as TagEntrySkeleton[]) ?? [];
    const protocols =
      (rawCase.fields.protocols as unknown as ProtocolEntrySkeleton[]) ?? [];
    const benefits =
      (rawCase.fields.benefits as unknown as BenefitEntrySkeleton[]) ?? [];
    const avatarurl = curator.fields.avatarurl as unknown as Asset;

    return {
      id: rawCase.fields.id,
      name: rawCase.fields.name,
      description: rawCase.fields.description,
      details: rawCase.fields.details,
      website: website.fields as unknown as { title: string; url: string },
      tags: tags.reduce((prev, tag) => {
        return tag.fields ? [...prev, tag.fields as unknown as Tag] : prev;
      }, [] as Tag[]),
      curatorTwitter: {
        name: curator.fields?.name as unknown as string,
        url: curator.fields.url as unknown as string,
        avatarUrl: (avatarurl?.fields?.file?.url as unknown as string) ?? '',
      },
      protocols: protocols.reduce((prev, protocol) => {
        return protocol.fields
          ? [...prev, protocol.fields.name as unknown as string]
          : prev;
      }, [] as string[]),
      benefits: benefits.reduce((prev, benefit) => {
        return benefit.fields
          ? [...prev, benefit.fields.title as unknown as string]
          : prev;
      }, [] as string[]),
      ...(rawCase.fields.label &&
        rawCase.fields.labelDescription && {
          label: {
            [rawCase.fields.label]: rawCase.fields.labelDescription,
          },
        }),
    };
  });
};

export const getCases = async (): Promise<{
  cases: BatchCaseInContentful[];
}> => {
  const response = await client.getEntries<BatchContentsEntrySkeleton>({
    content_type: BATCH_CONTENTS,
    limit: 1000,
  });
  return { cases: formatCases(response) };
};
