import { formatUnits, parseUnits } from 'viem';
import {
  arbitrum,
  aurora,
  avalanche,
  base,
  bsc,
  fantom,
  gnosis,
  klaytn,
  mainnet,
  optimism,
  polygon,
  zkSync,
} from 'viem/chains';
import ONEINCH from '@/cases/abi/1inch.json';
import { PreviewTx, Tx } from '@/models/cases/v3/types';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import { CHAINS } from '../../utils/generateHttpEndpoint';
import { getDecimals } from '../utils';
import type { Abi, Address } from 'abitype';

export const oneinchNativeTokenAddress =
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export enum ActionType {
  Swap = 'swap',
  Quote = 'quote',
}

export class InputAmountTooSmall extends Error {
  constructor(
    message: string = 'Might be input amount too small, try using bigger amount.'
  ) {
    super(message);
  }
}

/**
 * Returns the 1inch address based on the provided chainId.
 * @param chainId - The chainId for which to retrieve the OneInch address.
 * @returns The OneInch address corresponding to the given chainId.
 * @throws Error if the provided chainId is not supported by 1inch.
 */
export const getOneInchAddress = (chainId: number) => {
  let oneInchAddress: Address;
  switch (chainId) {
    case mainnet.id:
    case arbitrum.id:
    case avalanche.id:
    case base.id:
    case bsc.id:
    case optimism.id:
    case polygon.id:
    case fantom.id:
    case gnosis.id:
    case klaytn.id:
    case aurora.id:
      oneInchAddress = '0x111111125421ca6dc452d289314280a0f8842a65';
      break;
    case zkSync.id:
      oneInchAddress = '0x6fd4383cb451173d5f9304f041c7bcbf27d561ff';
      break;
    default:
      throw Error(`Chain Id ${chainId} is not supported by 1inch`);
  }
  return oneInchAddress;
};

/**
 * Create preview tx for token swap.
 * @param chainId Chain id with decimal format.
 * @param srcTokenSymbol Symbol of source token, e.g. USDC.
 * @param dstTokenSymbol Symbol of destination token, e.g. USDT.
 * @return PreviewTx
 */
export const swapPreviewTx: (params: {
  chainId: number;
  srcTokenSymbol: string;
  dstTokenSymbol: string;
}) => PreviewTx = (params) => {
  const { chainId, srcTokenSymbol, dstTokenSymbol } = params;
  const oneInchAddress: Address = getOneInchAddress(chainId);
  return {
    name: 'Swap',
    description: `${srcTokenSymbol} to ${dstTokenSymbol} at 1inch`,
    to: oneInchAddress,
    meta: {
      highlights: ['1inch'],
      tokenSymbols: [srcTokenSymbol, dstTokenSymbol],
    },
  };
};

/**
 * Create tx for token swap using 1inch.
 * @param chainId Chain id with decimal format.
 * @param userAddress User account address.
 * @param srcTokenAddress Contract address of source token, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for native token.
 * @param srcTokenSymbol Symbol of source token, e.g. USDC.
 * @param srcTokenDecimals Decimals of source token, e.g. 6.
 * @param srcAmount Amount of source token with wei format, e.g. 1000000.
 * @param dstTokenAddress Contract address of destination token, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for native token.
 * @param dstTokenSymbol Symbol of destination token, e.g. USDT.
 * @param dstTokenDecimals Decimals of destination token, e.g. 6.
 * @return Promise of Tx
 */
export const swapTx: (params: {
  chainId: number;
  userAddress: Address;
  srcTokenAddress: Address;
  srcTokenSymbol: string;
  srcTokenDecimals: number;
  srcAmount: bigint;
  dstTokenAddress: Address;
  dstTokenSymbol: string;
  dstTokenDecimals: number;
  slippageStr?: string;
}) => Promise<{
  tx: Tx;
  dstAmount: bigint;
}> = async (params) => {
  const {
    chainId,
    userAddress,
    srcTokenAddress,
    srcTokenSymbol,
    srcTokenDecimals,
    srcAmount,
    dstTokenAddress,
    dstTokenSymbol,
    dstTokenDecimals,
    slippageStr,
  } = params;
  const query = new URLSearchParams({
    action: ActionType.Swap,
    src: srcTokenAddress,
    dst: dstTokenAddress,
    amount: srcAmount.toString(),
    from: userAddress,
    slippage: slippageStr == undefined ? '0.5' : slippageStr,
    disableEstimate: 'true',
  });
  try {
    const { dstAmount, to, value, data } = await getSwapCalldata(
      chainId,
      query
    );
    return {
      tx: {
        name: 'Swap',
        description: `${formatUnits(srcAmount, srcTokenDecimals)} ${srcTokenSymbol} to ${formatUnits(dstAmount, dstTokenDecimals)} ${dstTokenSymbol} at 1inch`,
        to: to,
        value: value,
        data: data,
        abi: ONEINCH as Abi,
        meta: {
          highlights: ['1inch'],
          tokenSymbols: [srcTokenSymbol, dstTokenSymbol],
        },
      },
      dstAmount: BigInt(dstAmount),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const err = getError(error);
    throw err;
  }
};

/**
 * Find the best quote to swap with 1inch Router.
 * @param chainId Chain id with decimal format.
 * @param srcTokenAddress Contract address of source token, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for native token.
 * @param srcAmount Amount of source token with wei format, e.g. 1000000.
 * @param dstTokenAddress Contract address of destination token, use 0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee for native token.
 * @return Promise of Tx
 */
export const getQuote: (params: {
  chainId: number;
  srcTokenAddress: Address;
  srcAmount: bigint;
  dstTokenAddress: Address;
}) => Promise<bigint> = async (params) => {
  const { chainId, srcTokenAddress, srcAmount, dstTokenAddress } = params;
  const query = new URLSearchParams({
    action: ActionType.Quote,
    src: srcTokenAddress,
    dst: dstTokenAddress,
    amount: srcAmount.toString(),
  });
  const { dstAmount } = await getQuoteData(chainId, query);
  return dstAmount;
};

/**
 * Base on the dev of 1inch, v6 api doesn't support asking src token amount by fixed dstToken amount, so we infer the value with slippage.
 */
export const getSrcTokenAmount = async (param: {
  chainId: number;
  srcTokenAddress: Address;
  dstAmount: bigint;
  dstTokenAddress: Address;
  buffer: number;
}): Promise<bigint> => {
  const chain = CHAINS.find((chain) => chain.id === param.chainId);
  if (!chain) throw new Error(`Chain id not found: ${param.chainId}`);
  const decimals = await getDecimals(param.srcTokenAddress, chain);

  const trialBase = parseUnits('1', decimals);
  const trialQuote = await getQuote({
    chainId: param.chainId,
    srcTokenAddress: param.srcTokenAddress,
    srcAmount: trialBase,
    dstTokenAddress: param.dstTokenAddress,
  });

  const multiplier = 10n ** BigInt(decimals);

  const buffer = BigInt(multiplier) + BigInt(param.buffer * Number(multiplier));
  const srcAmount =
    (param.dstAmount * trialBase * buffer) / trialQuote / multiplier;

  const base = await getQuote({
    chainId: param.chainId,
    srcTokenAddress: param.srcTokenAddress,
    srcAmount: srcAmount,
    dstTokenAddress: param.dstTokenAddress,
  });
  if (base > param.dstAmount) {
    return srcAmount;
  } else {
    throw new InputAmountTooSmall();
  }
};

const getSwapCalldata = async (chainId: number, query: URLSearchParams) => {
  const [res, err] = await tryExecuteRequest(() =>
    apiCaller.get(`/case/api/1inch/${chainId}?` + query)
  );

  if (err) {
    const error = getError(err.data);
    throw error;
  }
  return {
    dstAmount: res.dstAmount as bigint,
    to: res.tx.to as Address,
    value: BigInt(res.tx.value),
    data: res.tx.data as `0x${string}`,
  };
};

const getQuoteData = async (chainId: number, query: URLSearchParams) => {
  const [res, err] = await tryExecuteRequest(() =>
    apiCaller.get(`/case/api/1inch/${chainId}?` + query)
  );
  if (err) {
    const error = getError(err.data);
    throw error;
  }
  return {
    dstAmount: BigInt(res.dstAmount),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getError = (errorRes: any): Error => {
  if (errorRes.error === 'insufficient liquidity') {
    return new InputAmountTooSmall();
  }
  return new Error(`${errorRes.message}`);
};
