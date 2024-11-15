import { Options } from '@layerzerolabs/lz-v2-utilities';
import {
  Address,
  Hex,
  encodeAbiParameters,
  getContract,
  parseAbiParameters,
} from 'viem';
import { StakeChainType } from '@/cases/types';
import { getDecimals } from '@/cases/utils';
import StargatePoolMigratable from '@/cases/yearn/abi/StargatePoolMigratable.json';
import UniversalComposer from '@/cases/yearn/abi/UniversalComposer.json';
import PublicClient from '@services/publicClient';

interface SendParam {
  dstEid: bigint;
  to: `0x${string}`;
  amountLD: bigint;
  minAmountLD: bigint;
  extraOptions: Hex;
  composeMsg: Hex;
  oftCmd: Hex;
}

interface MessagingFee {
  nativeFee: bigint;
  lzTokenFee: bigint;
}

interface OFTReceipt {
  amountReceivedLD: bigint;
}

export const getOperationCalldata = async (
  chain: StakeChainType,
  composer: Address,
  txs: {
    to: Address;
    value: bigint;
    data: Hex;
  }[]
): Promise<Hex> => {
  const client = PublicClient.get(chain);

  const contract = getContract({
    address: composer,
    abi: UniversalComposer,
    client,
  });

  const operationCalldata = (await contract.read.encodeOperation([txs])) as Hex;
  return operationCalldata;
};

export const getSendParam = (
  dstEid: bigint,
  composer: Address,
  amountLD: bigint,
  executorLzComposeGasLimit: bigint,
  composeMsg: Hex
): SendParam => {
  const extraOptions =
    composeMsg.length > 2
      ? (Options.newOptions()
          .addExecutorComposeOption(0, executorLzComposeGasLimit, 0n)
          .toHex() as Hex)
      : '0x';
  return {
    dstEid,
    to: addressToBytes32(composer),
    amountLD,
    minAmountLD: amountLD, // just a placeholder
    extraOptions,
    composeMsg,
    oftCmd: '0x',
  };
};

export const getMinimumReceivedAmount = async (
  chain: StakeChainType,
  stargate: Address,
  dstEid: bigint,
  amount: bigint,
  composer: Address
): Promise<bigint> => {
  const client = PublicClient.get(chain);

  const sendParam: SendParam = getSendParam(dstEid, composer, amount, 0n, '0x');

  // Create contract instance
  const contract = getContract({
    address: stargate,
    abi: StargatePoolMigratable,
    client,
  });

  // Call the quoteOFT function on the contract
  const [, , receipt] = (await contract.read.quoteOFT([sendParam])) as [
    unknown,
    unknown,
    OFTReceipt,
  ];

  return receipt.amountReceivedLD;
};

export const prepareTakeTaxiAndAMMSwap = async (
  chain: StakeChainType,
  stargate: Address,
  dstEid: bigint,
  amount: bigint,
  composer: Address,
  executorLzComposeGasLimit: bigint,
  composeMsg: Hex
): Promise<{
  valueToSend: bigint;
  sendParam: SendParam;
  messagingFee: MessagingFee;
  decimals: number;
}> => {
  const client = PublicClient.get(chain);

  const sendParam: SendParam = getSendParam(
    dstEid,
    composer,
    amount,
    executorLzComposeGasLimit,
    composeMsg
  );

  // Create contract instance
  const contract = getContract({
    address: stargate,
    abi: StargatePoolMigratable,
    client,
  });

  // Call the quoteOFT function on the contract
  const [, , receipt] = (await contract.read.quoteOFT([sendParam])) as [
    unknown,
    unknown,
    OFTReceipt,
  ];

  sendParam.minAmountLD = receipt.amountReceivedLD;

  // Call the quoteSend function on the contract
  const messagingFee = (await contract.read.quoteSend([
    sendParam,
    false,
  ])) as MessagingFee;

  let valueToSend = messagingFee.nativeFee;

  // Call the token function on the contract
  const token = (await contract.read.token()) as Address;

  let decimals: number = chain.nativeCurrency.decimals;
  if (token === '0x0000000000000000000000000000000000000000') {
    valueToSend += sendParam.amountLD;
  } else {
    decimals = await getDecimals(token, chain);
  }

  return { valueToSend, sendParam, messagingFee, decimals };
};

// Helper function to convert address to bytes32
const addressToBytes32 = (address: Address): Hex => {
  return encodeAbiParameters(parseAbiParameters('address'), [address]) as Hex;
};
