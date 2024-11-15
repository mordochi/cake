import {
  PublicClient as PublicClientType,
  Transport,
  createPublicClient,
} from 'viem';
import generateHttpEndpoint, { CHAINS } from '@/utils/generateHttpEndpoint';

class PublicClient {
  private clients = {} as Record<
    (typeof CHAINS)[number]['id'],
    PublicClientType<Transport, (typeof CHAINS)[number]>
  >;

  get(chain: (typeof CHAINS)[number]) {
    if (!this.clients[chain.id]) {
      this.clients[chain.id] = createPublicClient({
        batch: {
          multicall: true,
        },
        chain,
        transport: generateHttpEndpoint(chain.id),
      });
    }
    return this.clients[chain.id];
  }
}

const client = new PublicClient();

export default client;
