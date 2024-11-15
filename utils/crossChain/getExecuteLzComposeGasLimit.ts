import { Address, Hex } from 'viem';
import { apiCaller } from '../apiCaller';
import { CHAINS } from '../generateHttpEndpoint';

// estimate renderTransactions's gas limit
const getExecuteLzComposeGasLimit = async ({
  srcEid,
  destinationChainId,
  calldata,
  universalComposerAddress,
  dstTokenAddress,
  userAddress,
  minimumReceivedAmount,
}: {
  srcEid: bigint;
  destinationChainId: (typeof CHAINS)[number]['id'];
  calldata: Hex;
  universalComposerAddress: Address;
  dstTokenAddress: Address;
  userAddress: Address;
  minimumReceivedAmount: bigint;
}): Promise<bigint> => {
  const query = new URLSearchParams({
    srcEid: srcEid.toString(),
    chainId: destinationChainId.toString(),
    composerMessage: calldata,
    composerAddress: universalComposerAddress,
    tokenAddress: dstTokenAddress,
    userAddress,
    minimumReceiveAmount: minimumReceivedAmount.toString(),
  });

  const estimateGasLimitRes = await apiCaller.get(
    `/case/api/estimate?` + query
  );
  return estimateGasLimitRes.data.gasLimit;
};

export default getExecuteLzComposeGasLimit;
