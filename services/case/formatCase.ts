import { Asset, EntryCollection } from 'contentful';
import { BatchCaseInContentful, Tag } from '@/cases/types';
import {
  BatchContentsEntrySkeleton,
  BenefitEntrySkeleton,
  CuratorEntrySkeleton,
  ProtocolEntrySkeleton,
  TagEntrySkeleton,
  WebsiteEntrySkeleton,
} from '@/types/contentful';
import { forceType } from '@/utils/forceType';

export const formatCases = (
  rawCases: EntryCollection<BatchContentsEntrySkeleton, undefined, string>
) => {
  return rawCases.items.map((rawCase) => {
    const curator = forceType<CuratorEntrySkeleton>(rawCase.fields.curator);
    const website = forceType<WebsiteEntrySkeleton>(rawCase.fields.website);
    const tags = forceType<TagEntrySkeleton[]>(rawCase.fields.tags) ?? [];
    const protocols =
      forceType<ProtocolEntrySkeleton[]>(rawCase.fields.protocols) ?? [];
    const benefits =
      forceType<BenefitEntrySkeleton[]>(rawCase.fields.benefits) ?? [];
    const avatarurl = forceType<Asset>(curator.fields.avatarurl);

    const result: BatchCaseInContentful = {
      id: rawCase.fields.id,
      name: rawCase.fields.name,
      description: rawCase.fields.description,
      details: rawCase.fields.details,
      website: forceType<{ title: string; url: string }>(website.fields),
      tags: tags.reduce<Tag[]>((prev, tag) => {
        return tag.fields ? [...prev, forceType<Tag>(tag.fields)] : prev;
      }, []),
      curatorTwitter: {
        name: forceType<string>(curator.fields?.name),
        url: forceType<string>(curator.fields.url),
        avatarUrl: forceType<string>(avatarurl?.fields?.file?.url) ?? '',
      },
      protocols: protocols.reduce((prev, protocol) => {
        return protocol.fields
          ? [...prev, forceType<string>(protocol.fields.name)]
          : prev;
      }, [] as string[]),
      benefits: benefits.reduce((prev, benefit) => {
        return benefit.fields
          ? [...prev, forceType<string>(benefit.fields.title)]
          : prev;
      }, [] as string[]),
      ...(rawCase.fields.label &&
        rawCase.fields.labelDescription && {
          label: {
            [rawCase.fields.label]: rawCase.fields.labelDescription,
          },
        }),
    };

    return result;
  });
};
