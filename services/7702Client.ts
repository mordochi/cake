import { Address, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip7702Actions } from 'viem/experimental';
import { anvilMainnet } from '@/utils/generateHttpEndpoint';

// Address: 0x0A6F8e429B1aF453892A9c77ba8ea537913a05e7
export const _7702Account = privateKeyToAccount(
  (process.env.NEXT_PUBLIC_7702_PRIVATE as Address) || '0x0'
);

const walletClient = createWalletClient({
  chain: anvilMainnet,
  transport: http(),
  account: _7702Account,
}).extend(eip7702Actions());

export default walletClient;

// curl -X POST \
// http://127.0.0.1:8545 \
//  -H "Content-Type: application/json" \
//  -d '{
//    "jsonrpc": "2.0",
//    "method": "eth_getCode",
//    "params": ["0x0A6F8e429B1aF453892A9c77ba8ea537913a05e7", "latest"],
//    "id": 1
//  }'
