import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { eip7702Actions } from 'viem/experimental';
import { anvilMainnet } from '@/utils/generateHttpEndpoint';

// Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export const _7702Account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
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
//    "params": ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "latest"],
//    "id": 1
//  }'
