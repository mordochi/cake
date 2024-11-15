import { createClient as _createClient } from 'contentful';
import invariant from '@/utils/invariant';

const createClient = () => {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

  invariant(SPACE_ID, 'Missing environment variable: CONTENTFUL_SPACE_ID');
  invariant(
    ACCESS_TOKEN,
    'Missing environment variable: CONTENTFUL_ACCESS_TOKEN'
  );

  return _createClient({
    space: SPACE_ID!,
    accessToken: ACCESS_TOKEN!,
  });
};

const client = createClient();

export default client;
