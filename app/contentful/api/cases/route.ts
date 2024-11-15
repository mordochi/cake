export const dynamic = 'force-dynamic';

import { BatchCaseInContentful } from '@/cases/types';
import { formatCases } from '@/services/case/formatCase';
import { BATCH_CONTENTS, BatchContentsEntrySkeleton } from '@/types/contentful';
import client from '@/utils/contentfulClient';

export type GetCasesResponse = {
  cases: BatchCaseInContentful[];
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const response = await client.getEntries<BatchContentsEntrySkeleton>({
      content_type: BATCH_CONTENTS,
      ...(id && { 'fields.id': id }),
      limit: 1000,
    });

    return Response.json({ cases: formatCases(response) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
