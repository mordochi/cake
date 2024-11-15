import PublicClient from '@services/publicClient';
import {
  Abi,
  Address,
  EncodeFunctionDataReturnType,
  Hex,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionData,
  formatUnits,
  getAbiItem,
  getContract,
  keccak256,
  parseAbiParameters,
} from 'viem';
import { mainnet } from 'viem/chains';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import {
  Rounding,
  mulDivWithRounding,
  toAssetsUp,
  toSharesDown,
} from '../math';
import { BentoChainType, PreviewTx, Tx } from '../types';
import EthereumBundlerV2 from './abi/EthereumBundlerV2.json';
import MetaMorpho from './abi/MetaMorpho.json';
import Morpho from './abi/Morpho.json';
import { balanceOf } from './ERC20';

export const morpho = '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb';
export const ethereumBundlerV2 = '0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077';

export const protocolName = 'Morpho Blue';

/**
 * symbol: The name of token. Used for display.
 * inputAmount: The input amount of token.
 * decimals: The decimals of token.
 */
export type InputToken = {
  symbol: string;
  inputAmount: bigint;
  decimals: number;
};

/**
 * Create preview tx for depositing token to Morpho vault.
 * @param inputTokenSymbol The name of input token. e.g. ETH
 * @param vaultName The name of the Morpho vault. e.g. Gauntlet LRT Core
 * @returns PreviewTx
 */
export const depositPreviewTx = ({
  inputTokenSymbol,
  vaultName,
}: {
  inputTokenSymbol: string;
  vaultName: string;
}): PreviewTx => {
  return {
    name: 'Deposit',
    description: `${inputTokenSymbol} to ${vaultName} on ${protocolName}`,
    to: ethereumBundlerV2,
    meta: {
      highlights: [protocolName],
      tokenSymbols: [inputTokenSymbol],
    },
  };
};

/**
 * Create preview tx for depositing token to Morpho vault.
 * @param inputTokenSymbol The name of input token. e.g. ETH
 * @param vaultName The name of the Morpho vault. e.g. Gauntlet LRT Core
 * @returns PreviewTx
 */
export const redeemPreviewTx = ({
  inputTokenSymbol,
  vaultName,
}: {
  inputTokenSymbol: string;
  vaultName: string;
}): PreviewTx => {
  return {
    name: 'Redeem',
    description: `${inputTokenSymbol} to ${vaultName} on ${protocolName}`,
    to: ethereumBundlerV2,
    meta: {
      highlights: [protocolName],
      tokenSymbols: [inputTokenSymbol],
    },
  };
};

/**
 * Get vault address from the multicall call data for develop purpose.
 * @param multicallData The call data of transaction initiated from Morpho website.
 * @returns Address
 */
export const getVaultAddress = (
  multicallData: `0x${string}`
): Address | undefined => {
  const decodedFnData = decodeFunctionData({
    abi: EthereumBundlerV2,
    data: multicallData,
  }) as any;

  let vaultAddress = undefined;

  for (const arg of decodedFnData.args[0]) {
    const decodedFnData = decodeFunctionData({
      abi: EthereumBundlerV2,
      data: arg,
    });
    const abiItem = getAbiItem({
      abi: EthereumBundlerV2,
      name: decodedFnData.functionName,
    }) as any;
    (abiItem.inputs as any[]).forEach((element, index) => {
      if (element.name === 'vault') {
        vaultAddress = decodedFnData.args?.[index] as Address;
      }
    });
  }
  return vaultAddress;
};

/**
 * Create a tx for depositing token to Morpho erc4626 vault.
 * @param chain The chain that interacting with.
 * @param inputToken The info of input token.
 * @param morphoVault The vault address of Morpho, can be got from the getVaultAddress above.
 * @param vaultName The name of the current vault, used to display for the user.
 * @param userAddress The user's address.
 * @returns Tx
 */
export const erc4626DepositCallData = async ({
  chain,
  inputToken,
  morphoVault,
  userAddress,
}: {
  chain: BentoChainType;
  inputToken: InputToken;
  morphoVault: Address;
  userAddress: Address;
}): Promise<string> => {
  const client = PublicClient.get(chain);

  const vaultContract = getContract({
    address: morphoVault,
    abi: MetaMorpho,
    client: client,
  });

  const assetAddress = (await vaultContract.read.asset()) as Address;
  const vaultAssetBalance = await balanceOf({
    chain,
    userAddress: morphoVault,
    tokenAddress: assetAddress,
  });

  // Fetch the total supply of the vault tokens
  const totalSupply = (await vaultContract.read.totalSupply()) as bigint;
  const decimalsOffset = (await vaultContract.read.DECIMALS_OFFSET()) as number;
  const totalAssets = (await vaultContract.read.totalAssets()) as bigint;

  const minShares = calculateMinShares({
    assetBalance: vaultAssetBalance,
    inputAmount: inputToken.inputAmount,
    totalSupply,
    newTotalAssets: totalAssets,
    decimalsOffset,
  });
  const erc4626DepositCalldata = encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'erc4626Deposit',
    args: [morphoVault, inputToken.inputAmount, minShares, userAddress],
  });
  return erc4626DepositCalldata;
};

/**
 * Create a tx for depositing token to Morpho erc4626 vault.
 * @param chain The chain that interacting with.
 * @param inputToken The info of input token.
 * @param morphoVault The vault address of Morpho, can be got from the getVaultAddress above.
 * @param vaultName The name of the current vault, used to display for the user.
 * @param userAddress The user's address.
 * @returns Tx
 */
export const erc4626RedeemCallData = async ({
  chain,
  morphoVault,
  shares,
  receiver,
  owner,
}: {
  chain: BentoChainType;
  morphoVault: Address;
  shares: bigint;
  receiver: Address;
  owner: Address;
}): Promise<string> => {
  const client = PublicClient.get(chain);

  const vaultContract = getContract({
    address: morphoVault,
    abi: MetaMorpho,
    client: client,
  });

  const ownerAssetBalance = (await vaultContract.read.balanceOf([
    owner,
  ])) as bigint;

  // Fetch the total supply of the vault tokens
  const totalSupply = (await vaultContract.read.totalSupply()) as bigint;
  const decimalsOffset = (await vaultContract.read.DECIMALS_OFFSET()) as number;
  const totalAssets = (await vaultContract.read.totalAssets()) as bigint;

  const minShares = calculateMinAssets({
    assetBalance: ownerAssetBalance,
    shares,
    totalSupply,
    newTotalAssets: totalAssets,
    decimalsOffset,
  });
  const erc4626DepositCalldata = encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'erc4626Redeem',
    args: [morphoVault, shares, minShares, receiver, owner],
  });
  return erc4626DepositCalldata;
};

/**
 * Create a multicall tx for depositing token to Morpho vault.
 * @param chain The chain that interacting with.
 * @param inputToken The info of input token.
 * @param morphoVault The vault address of Morpho, can be got from the getVaultAddress above.
 * @param vaultName The name of the current vault, used to display for the user.
 * @param userAddress The user's address.
 * @returns Tx
 */
export const depositEthMulticallTx = async ({
  chain,
  inputAmount,
  morphoVault,
  vaultName,
  userAddress,
}: {
  chain: BentoChainType;
  inputAmount: bigint;
  morphoVault: Address;
  vaultName: string;
  userAddress: Address;
}): Promise<Tx> => {
  const wrapNativeCalldata = encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'wrapNative',
    args: [inputAmount],
  });

  const inputToken: InputToken = {
    symbol: 'ETH',
    inputAmount,
    decimals: 18,
  };

  const depositCalldata = await erc4626DepositCallData({
    chain,
    inputToken,
    morphoVault,
    userAddress,
  });

  return wrapToMulticallTx({
    name: 'Deposit',
    calldatas: [wrapNativeCalldata, depositCalldata],
    ethValue: inputAmount,
    inputToken,
    vaultName,
  });
};

/**
 *
 * @param chain
 * @param shares basically the amount of token to redeem back to the original token
 * @returns
 */
export const erc4626RedeemMulticallTx = async ({
  chain,
  shares,
  redeemVault,
  vaultName,
  receiver,
  owner,
}: {
  chain: BentoChainType;
  shares: bigint;
  redeemVault: Address;
  vaultName: string;
  receiver: Address;
  owner: Address;
}): Promise<Tx> => {
  const client = PublicClient.get(chain);

  const redeemCalldata = await erc4626RedeemCallData({
    chain,
    morphoVault: redeemVault,
    shares,
    receiver,
    owner,
  });

  const vaultContract = getContract({
    address: redeemVault,
    abi: MetaMorpho,
    client: client,
  });

  const symbol = (await vaultContract.read.symbol()) as Address;
  const decimal = (await vaultContract.read.decimals()) as number;

  return wrapToMulticallTx({
    name: 'Redeem',
    calldatas: [redeemCalldata],
    ethValue: 0n,
    inputToken: {
      symbol,
      inputAmount: shares,
      decimals: decimal,
    },
    vaultName,
  });
};

/**
 * Wrap calldata into a multicall Tx.
 * Since the modifier protected will check whether _initiator is UNINITIATED, we need to use multicall instead of calling the erc4626Deposit directly.
 * @param name The name for the multicall.
 * @param calldatas The call data array wants to put into the multicall.
 * @param ethValue The transaction value of the multicall.
 * @param inputToken The info of input token.
 * @param vaultName The name of the current vault, used to display for the user.
 * @returns Tx
 */
export const wrapToMulticallTx = ({
  name,
  calldatas,
  ethValue,
  inputToken,
  vaultName,
}: {
  name: string;
  calldatas: string[];
  ethValue: bigint;
  inputToken: InputToken;
  vaultName: string;
}): Tx => {
  return {
    name,
    description: `${formatUnits(inputToken.inputAmount, inputToken.decimals)} ${inputToken.symbol} to ${vaultName} on ${protocolName}`,
    to: ethereumBundlerV2,
    value: ethValue,
    data: encodeFunctionData({
      abi: EthereumBundlerV2,
      functionName: 'multicall',
      args: [calldatas],
    }),
    abi: EthereumBundlerV2 as Abi,
    meta: {
      highlights: [protocolName],
      tokenSymbols: [inputToken.symbol],
    },
  };
};

export const isAuthorized: (params: {
  chain: BentoChainType;
  userAddress: Address;
  bundlerAddress: Address;
}) => Promise<boolean> = async (params) => {
  const { chain, userAddress, bundlerAddress } = params;
  const client = PublicClient.get(chain);

  const morphoContract = getContract({
    address: morpho,
    abi: Morpho,
    client: client,
  });

  return (await morphoContract.read.isAuthorized([
    userAddress,
    bundlerAddress,
  ])) as boolean;
};

export const setAuthorizationPreviewTx = (): PreviewTx => {
  return {
    name: 'Authorize',
    description: `the Morpho bundler to manage position`,
    to: morpho,
    meta: {
      highlights: ['Morpho bundler'],
    },
  };
};

export const setAuthorizationTx: (params: {
  bundler: Address;
  isAuthorized: boolean;
}) => Tx = (params) => {
  const { bundler, isAuthorized } = params;
  return {
    name: 'Authorize',
    description: `the Morpho bundler to manage position`,
    to: morpho,
    value: 0n,
    data: encodeFunctionData({
      abi: Morpho,
      functionName: 'setAuthorization',
      args: [bundler, isAuthorized],
    }),
    abi: Morpho as Abi,
    meta: {
      highlights: ['Morpho bundler'],
    },
  };
};

export const supplyAndBorrowPreviewTx: (params: {
  supplyTokenSymbol: string;
  borrowTokenSymbol: string;
}) => PreviewTx = (params) => {
  const { supplyTokenSymbol, borrowTokenSymbol } = params;
  return {
    name: 'Supply',
    description: `${supplyTokenSymbol} and borrow ${borrowTokenSymbol} on Morpho`,
    to: ethereumBundlerV2,
    meta: {
      highlights: ['Morpho'],
      tokenSymbols: [supplyTokenSymbol, borrowTokenSymbol],
    },
  };
};

export const repayPreviewTx: (params: {
  loanTokenSymbol: string;
}) => PreviewTx = (params) => {
  const { loanTokenSymbol } = params;
  return {
    name: 'Repay',
    description: `${loanTokenSymbol} on Morpho`,
    to: ethereumBundlerV2,
    meta: {
      highlights: ['Morpho'],
      tokenSymbols: [loanTokenSymbol],
    },
  };
};

export const erc20TransferCalldata: (params: {
  asset: Address;
  recipient: Address;
  amount: bigint;
}) => EncodeFunctionDataReturnType = (params) => {
  return encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'erc20Transfer',
    args: [params.asset, params.recipient, params.amount],
  });
};

export const erc20TransferFromCalldata: (params: {
  supplyTokenAddress: Address;
  supplyAmount: bigint;
}) => EncodeFunctionDataReturnType = (params) => {
  return encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'erc20TransferFrom',
    args: [params.supplyTokenAddress, params.supplyAmount],
  });
};

export type MarketParams = {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
};

export const calculateMarketId = (
  marketParams: MarketParams
): `0x${string}` => {
  const encodedParams = encodeAbiParameters(
    parseAbiParameters('address, address, address, address, uint256'),
    [
      marketParams.loanToken,
      marketParams.collateralToken,
      marketParams.oracle,
      marketParams.irm,
      marketParams.lltv,
    ]
  );
  return keccak256(encodedParams);
};

export const getMarketInfo = async (
  params: MarketParams,
  chain: BentoChainType
): Promise<{
  totalSupplyAssets: bigint;
  totalSupplyShares: bigint;
  totalBorrowAssets: bigint;
  totalBorrowShares: bigint;
  lastUpdate: bigint;
  fee: bigint;
}> => {
  const client = PublicClient.get(chain);

  const morphoContract = getContract({
    address: morpho, // Assuming 'morpho' is defined elsewhere in your code
    abi: Morpho,
    client: client,
  });

  const marketId = calculateMarketId(params);

  console.log('marketId', marketId);

  const [
    totalSupplyAssets,
    totalSupplyShares,
    totalBorrowAssets,
    totalBorrowShares,
    lastUpdate,
    fee,
  ] = (await morphoContract.read.market([marketId])) as [
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
  ];

  return {
    totalSupplyAssets,
    totalSupplyShares,
    totalBorrowAssets,
    totalBorrowShares,
    lastUpdate,
    fee,
  };
};

export const repayCalldata: (params: {
  chain: BentoChainType;
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: bigint;
  assets: bigint;
  shares: bigint;
  onBehalf: Address;
}) => Promise<Hex> = async (params) => {
  const marketParams: MarketParams = {
    loanToken: params.loanToken,
    collateralToken: params.collateralToken,
    oracle: params.oracle,
    irm: params.irm,
    lltv: params.lltv,
  };

  const marketInfo = await getMarketInfo(marketParams, params.chain);

  const fixedData =
    '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000';

  let repaidShares: bigint;
  let repaidAssets: bigint;
  if (params.assets > 0n) {
    repaidShares = toSharesDown(
      params.assets,
      marketInfo.totalBorrowAssets,
      marketInfo.totalBorrowShares
    );
    repaidAssets = params.assets;
  } else {
    repaidAssets = toAssetsUp(
      params.shares,
      marketInfo.totalBorrowAssets,
      marketInfo.totalBorrowShares
    );
    repaidShares = params.shares;
  }

  console.log('repaidShares', repaidShares);
  console.log('repaidAssets', repaidAssets);

  return encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'morphoRepay',
    args: [
      [
        params.loanToken,
        params.collateralToken,
        params.oracle,
        params.irm,
        params.lltv,
      ],
      params.assets,
      params.shares,
      params.assets > 0n
        ? (repaidShares * 995n) / 1000n
        : (repaidAssets * 1005n) / 1000n, // slippageAmount
      params.onBehalf,
      fixedData,
    ],
  });
};

export const supplyAndBorrowTx: (params: {
  supplyTokenAddress: Address;
  supplyTokenSymbol: string;
  supplyTokenDecimals: number;
  supplyAmount: bigint;
  borrowTokenAddress: Address;
  borrowTokenSymbol: string;
  borrowTokenDecimals: number;
  borrowAmount: bigint;
  shares: bigint;
  userAddress: Address;
  oracleAddress: Address;
  irmAddress: Address;
  lltv: bigint;
}) => Tx = (params) => {
  const {
    supplyTokenAddress,
    supplyTokenSymbol,
    supplyTokenDecimals,
    supplyAmount,
    borrowTokenAddress,
    borrowTokenSymbol,
    borrowTokenDecimals,
    borrowAmount,
    shares,
    userAddress,
    oracleAddress,
    irmAddress,
    lltv,
  } = params;

  const transferCalldata = erc20TransferFromCalldata({
    supplyTokenAddress,
    supplyAmount,
  });

  const marketParams = [
    borrowTokenAddress,
    supplyTokenAddress,
    oracleAddress,
    irmAddress,
    lltv,
  ];

  const data =
    '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000';

  const supplyCalldata = encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'morphoSupplyCollateral',
    args: [marketParams, supplyAmount, userAddress, data],
  });

  // Based on the on-chain data, the slippage amount is calculated as the borrow amount * 10^6
  const slippageAmount = borrowAmount * 10n ** 6n;

  const borrowCalldata = encodeFunctionData({
    abi: EthereumBundlerV2,
    functionName: 'morphoBorrow',
    args: [marketParams, borrowAmount, shares, slippageAmount, userAddress],
  });

  const calldatas = [transferCalldata, supplyCalldata, borrowCalldata];

  return {
    name: 'Supply',
    description: `${formatUnits(supplyAmount, supplyTokenDecimals)} ${supplyTokenSymbol} and borrow ${formatUnits(borrowAmount, borrowTokenDecimals)} ${borrowTokenSymbol} on Morpho`,
    to: ethereumBundlerV2,
    value: 0n,
    data: encodeFunctionData({
      abi: EthereumBundlerV2,
      functionName: 'multicall',
      args: [calldatas],
    }),
    abi: EthereumBundlerV2 as Abi,
    meta: {
      highlights: ['Morpho'],
      tokenSymbols: [supplyTokenSymbol, borrowTokenSymbol],
    },
  };
};

/**
 *
 * @param assetBalance
 * @returns
 */
const calculateMinAssets = ({
  assetBalance,
  shares,
  totalSupply,
  newTotalAssets,
  decimalsOffset,
}: {
  assetBalance: bigint;
  shares: bigint;
  totalSupply: bigint;
  newTotalAssets: bigint;
  decimalsOffset: number;
}): bigint => {
  let amountShares = shares;

  if (amountShares > assetBalance) {
    amountShares = assetBalance;
  }

  // Calculate the shares
  const assets = convertToAssetsWithTotals(
    amountShares,
    totalSupply,
    newTotalAssets,
    decimalsOffset,
    Rounding.Floor
  );

  // close to the buffer get from Morpho frontend.
  const minAssets = (assets * 9997n) / 10000n;
  if (assets * shares < amountShares * minAssets)
    throw new Error(`The assets has changed, please try again.`);

  return minAssets;
};

const calculateMinShares = ({
  assetBalance,
  inputAmount,
  totalSupply,
  newTotalAssets,
  decimalsOffset,
}: {
  assetBalance: bigint;
  inputAmount: bigint;
  totalSupply: bigint;
  newTotalAssets: bigint;
  decimalsOffset: number;
}): bigint => {
  let amountAsset = inputAmount;

  if (amountAsset > assetBalance) {
    amountAsset = assetBalance;
  }

  // Calculate the shares
  const shares = convertToSharesWithTotals(
    amountAsset,
    totalSupply,
    newTotalAssets,
    decimalsOffset,
    Rounding.Floor
  );

  // close to the buffer get from Morpho frontend.
  const minShares = (shares * 9997n) / 10000n;
  if (shares * inputAmount < amountAsset * minShares)
    throw new Error(`The share has changed, please try again.`);

  return minShares;
};

const convertToSharesWithTotals = (
  assets: bigint,
  totalSupply: bigint,
  newTotalAssets: bigint,
  decimalsOffset: number,
  rounding: Rounding
): bigint => {
  const denominator = newTotalAssets + 1n;

  const result = mulDivWithRounding(
    assets,
    totalSupply + BigInt(10 ** decimalsOffset),
    denominator,
    rounding
  );
  return result;
};

const convertToAssetsWithTotals = (
  shares: bigint,
  totalSupply: bigint,
  newTotalAssets: bigint,
  decimalsOffset: number,
  rounding: Rounding
): bigint => {
  const denominator = newTotalAssets + 1n;

  const result = mulDivWithRounding(
    shares,
    denominator,
    totalSupply + BigInt(10 ** decimalsOffset),
    rounding
  );
  return result;
};

export const getAPY = async (vaultAddress: Address) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const oneHourAgoTimestamp = currentTimestamp - 3600;

  const url = 'https://blue-api.morpho.org/graphql';
  const query = {
    operationName: 'getVaultApyTimeseries',
    variables: {
      address: vaultAddress,
      chainId: mainnet.id,
      options: {
        startTimestamp: oneHourAgoTimestamp,
        endTimestamp: currentTimestamp,
        interval: 'HALF_HOUR',
      },
    },
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash:
          '2f1d046aed1ef6ca9183e46eff0cab9041afe9d2cfaa4583651387e7a44d90f7',
      },
    },
  };

  const [res, err] = await tryExecuteRequest(() => apiCaller.post(url, query));

  if (err) {
    throw new Error(`Fail to fetch apy.(status code: ${err.status})`);
  }
  const rawApy = res.data.vaultByAddress.historicalState.netApy.pop().y;
  return parseFloat(rawApy);
};
