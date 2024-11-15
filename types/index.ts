import { config } from '@/utils/wagmi';

export type ChainId = (typeof config)['chains'][number]['id'];
