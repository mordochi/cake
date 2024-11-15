import { Address, encodeFunctionData, formatUnits } from 'viem';
import EthereumBundlerV2 from '@/cases/prebuilt-tx/abi/EthereumBundlerV2.json';
import {
  erc20TransferFromCalldata,
  erc4626DepositCallData,
} from '@/cases/prebuilt-tx/morpho';
import { BentoChainType } from '@/cases/types';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import {
  Action,
  Category,
  LEARN_MORE_DESC,
  Reward,
  Token,
  TxInfo,
} from '../types';
import { generateDescription, getTokenInfo } from '../utils';

export const MORPHO = {
  id: 'morphoblue',
  name: 'Morpho',
  siteUrl: 'https://app.morpho.org',
  category: Category.LENDING,
  isWithdrawalSupported: false,

  // https://docs.morpho.org/addresses#bundlers
  ETHEREUM_V2_BUNDLER: '0x4095F064B8d3c3548A3bebfd0Bbfd04750E30077',
};

export type Vault = {
  name: string;
  inputToken: Token;
  outputToken: Token;
  tvl: number;
  apy: number;
  rewards: Reward[];
};

const MORPHO_API_URL = 'https://blue-api.morpho.org/graphql';

/**
 * GraphQL query for fetching vaults data
 */
const VAULTS_QUERY = `query Vaults($where: VaultFilters, $orderBy: VaultOrderBy){
    vaults(where: $where, orderBy: $orderBy) {
      items {
        name
        address
        asset {
          name
          symbol
          decimals
          address
          logoURI
        }
        state {
          netApy
          totalAssetsUsd
        }
      }
    }
  }`;

/**
 * Fetches vaults by input token
 * @param chain Chain to fetch the vaults from
 * @param inTokenAddress Input token address
 * @returns Vaults data
 */
export const fetchVaultsByInToken = async (
  chain: BentoChainType,
  inTokenAddress: Address
): Promise<Vault[]> => {
  const variables = {
    where: {
      chainId_in: [chain.id],
      assetAddress_in: inTokenAddress,
      whitelisted: true,
    },
    orderBy: 'TotalAssetsUsd',
  };

  const [res, err] = await tryExecuteRequest(() =>
    apiCaller.post(MORPHO_API_URL, { query: VAULTS_QUERY, variables })
  );

  if (err) throw new Error(`Failed to fetch market info: ${err.message}`);

  return extractVaultsData(chain, res.data.vaults.items);
};

/**
 * Fetches vault by input and output token
 * @param chain Chain to fetch the vault from
 * @param inTokenAddress Input token address
 * @param outTokenAddress Output token address
 * @returns Vault data
 */
export const fetchVaultByTokens = async (
  chain: BentoChainType,
  inTokenAddress: Address,
  outTokenAddress: Address
): Promise<Vault> => {
  const variables = {
    where: {
      chainId_in: [chain.id],
      assetAddress_in: inTokenAddress,
      address_in: outTokenAddress,
      whitelisted: true,
    },
    orderBy: 'TotalAssetsUsd',
  };

  const [res, err] = await tryExecuteRequest(() =>
    apiCaller.post(MORPHO_API_URL, { query: VAULTS_QUERY, variables })
  );

  if (err) throw new Error(`Failed to fetch market info: ${err.message}`);

  const vaults = await extractVaultsData(chain, res.data.vaults.items);
  if (vaults.length === 0) throw new Error('Vault not found');
  return vaults[0];
};

/**
 * Extracts vaults data from the Morpho API response
 * @param chain Chain to fetch the vaults from
 * @param vaults Data from the Morpho API
 * @returns Extracted vaults data
 */
const extractVaultsData = (
  chain: BentoChainType,
  vaults: any[]
): Promise<Vault[]> =>
  Promise.all(vaults.map((vault) => mapVaultData(chain, vault)));

/**
 * Maps raw vault data to a structured Vault object
 * @param chain Chain to fetch the vaults from
 * @param vault Single vault data item from the API response
 * @returns Structured Vault object
 */
const mapVaultData = async (
  chain: BentoChainType,
  vault: Record<string, any>
): Promise<Vault> => {
  const outputToken = await getTokenInfo(chain, vault.address);
  if (!outputToken)
    throw new Error(`Output token not found for vault ${vault.address}`);

  return {
    name: vault.name,
    inputToken: mapTokenData(vault.asset),
    outputToken: outputToken,
    apy: vault.state.netApy,
    tvl: vault.state.totalAssetsUsd,
    rewards: [
      {
        name: 'Morpho',
        desc: LEARN_MORE_DESC,
        logoUrl: 'https://cdn.morpho.org/assets/logos/morpho.svg',
      },
    ],
  };
};

/**
 * Maps raw token data to a Token object
 * @param tokenData Raw token data
 * @returns Structured Token object
 */
const mapTokenData = (tokenData: Record<string, any>): Token => ({
  name: tokenData.name,
  symbol: tokenData.symbol,
  decimals: tokenData.decimals,
  address: tokenData.address,
  logoUrl: tokenData.logoURI,
});

export const getMorphoMulticallTx = async (params: {
  chain: BentoChainType;
  inputToken: Token;
  outputToken: Token;
  userAddress: Address;
  amount: bigint;
}): Promise<TxInfo> => {
  const transferFromTx = await erc20TransferFromCalldata({
    supplyTokenAddress: params.inputToken.address,
    supplyAmount: params.amount,
  });

  const depositTx = await erc4626DepositCallData({
    chain: params.chain,
    inputToken: {
      symbol: params.inputToken.symbol,
      inputAmount: params.amount,
      decimals: params.inputToken.decimals,
    },
    morphoVault: params.outputToken.address,
    userAddress: params.userAddress,
  });

  return {
    description: generateDescription({
      type: Action.DEPOSIT,
      protocolName: MORPHO.name,
      displayAmount: formatUnits(params.amount, params.inputToken.decimals),
      pair: {
        inputTokenSymbol: params.inputToken.symbol,
      },
    }),
    displayAmount: formatUnits(params.amount, params.inputToken.decimals),
    value: 0n,
    to: MORPHO.ETHEREUM_V2_BUNDLER as Address,
    data: encodeFunctionData({
      abi: EthereumBundlerV2,
      functionName: 'multicall',
      args: [[transferFromTx, depositTx]],
    }),
  };
};
