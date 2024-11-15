import * as contentful from 'contentful';
import client from '@/utils/contentfulClient';

export type ClientReturnType = typeof client;

export type EntryReturnType<
  T extends contentful.EntrySkeletonType = contentful.EntrySkeletonType,
> = Awaited<ReturnType<typeof client.getEntry<T>>>;

export type EntriesReturnType<
  T extends contentful.EntrySkeletonType = contentful.EntrySkeletonType,
> = Awaited<ReturnType<typeof client.getEntries<T>>>;

export const BATCH_CONTENTS = 'batchContents';
export type BatchContentsEntrySkeleton = {
  contentTypeId: typeof BATCH_CONTENTS;
  fields: {
    name: contentful.EntryFieldTypes.Text;
    id: contentful.EntryFieldTypes.Text;
    curator: contentful.EntryFieldTypes.EntryLink<CuratorEntrySkeleton>;
    website: contentful.EntryFieldTypes.EntryLink<WebsiteEntrySkeleton>;
    protocols: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<ProtocolEntrySkeleton>
    >;
    tags: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<TagEntrySkeleton>
    >;
    label: contentful.EntryFieldTypes.Text;
    labelDescription: contentful.EntryFieldTypes.Text;
    description: contentful.EntryFieldTypes.Text;
    benefits: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<BenefitEntrySkeleton>
    >;
    details: contentful.EntryFieldTypes.RichText;
  };
};

export const BATCH_CURATOR = 'batchCurator';
export type CuratorEntrySkeleton = {
  contentTypeId: typeof BATCH_CURATOR;
  fields: {
    name: contentful.EntryFieldTypes.Text;
    url: contentful.EntryFieldTypes.Text;
    avatarurl: contentful.EntryFieldTypes.AssetLink;
  };
};

export const BATCH_WEBSITE = 'batchWebsite';
export type WebsiteEntrySkeleton = {
  contentTypeId: typeof BATCH_WEBSITE;
  fields: {
    title: contentful.EntryFieldTypes.Text;
    url: contentful.EntryFieldTypes.Text;
  };
};

export const BATCH_PROTOCOL = 'batchProtocols';
export type ProtocolEntrySkeleton = {
  contentTypeId: typeof BATCH_PROTOCOL;
  fields: {
    name: contentful.EntryFieldTypes.Text;
    id: contentful.EntryFieldTypes.Text;
    link: contentful.EntryFieldTypes.Text;
    icon: contentful.EntryFieldTypes.AssetLink;
  };
};

export const BATCH_TAG = 'batchTags';
export type TagEntrySkeleton = {
  contentTypeId: typeof BATCH_TAG;
  fields: {
    title: contentful.EntryFieldTypes.Text;
  };
};

export const BATCH_BENEFIT = 'batchBenefits';
export type BenefitEntrySkeleton = {
  contentTypeId: typeof BATCH_BENEFIT;
  fields: {
    title: contentful.EntryFieldTypes.Text;
  };
};

export const BATCH_CAROUSEL = 'batchCarousel';
export type CarouselEntrySkeleton = {
  contentTypeId: typeof BATCH_CAROUSEL;
  fields: {
    id: contentful.EntryFieldTypes.Text;
    bgImage: contentful.EntryFieldTypes.AssetLink;
    order: contentful.EntryFieldTypes.Number;
  };
};
