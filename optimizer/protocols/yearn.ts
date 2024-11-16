import { Address, encodeFunctionData, getAddress } from 'viem';
import { StakeChainType } from '@/models/cases/v3/types';
import {
  Category,
  DefiProtocol,
  Token,
  TxInfo,
  VaultMetadata,
} from '../types';
import { arbitrum, mainnet, polygon } from 'viem/chains';
import { getAPR, YEARN_V3, YearnVault } from './yearnUtils';
import YearnV3Abi from './abi/YearnV3.json';
import TOKEN_IMAGES from '../tokenImages';

export default class YearnV3 implements DefiProtocol {
  id = YEARN_V3.id;
  isWithdrawalSupported = YEARN_V3.isWithdrawalSupported;

  cachedVaults: YearnVault[] = [];

  getVaults = async (relatedTokens: Address[]): Promise<YearnVault[]> => {
    if (this.cachedVaults.length) return this.cachedVaults;
    const query = new URLSearchParams({
      hideAlways: 'true',
      orderBy: 'featuringScore',
      orderDirection: 'desc',
      strategiesDetails: 'withDetails',
      strategiesCondition: 'inQueue',
      chainIDs: [mainnet, arbitrum, polygon]
        .map((value) => value.id.toString())
        .join(','),
      limit: '1000',
    });
    const url = `https://ydaemon.yearn.fi/vaults?` + query;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const vaults = (await response.json()) as YearnVault[];

    let cachedVaults = vaults.filter((vault) => {
      const apr = getAPR(vault);
      return (
        vault.version.split('.')[0] === '3' &&
        apr > 0.01 &&
        relatedTokens
          .map((value) => value.toLowerCase())
          .includes(vault.token.address.toLowerCase())
      );
    });

    return cachedVaults;
  };

  async getWithdrawalAmount(
    _chain: StakeChainType,
    _inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<bigint> {
    return amount;
  }

  getPositionInfo = async (
    chain: StakeChainType,
    inputTokenAddress: Address,
    outputTokenAddress: Address
  ): Promise<VaultMetadata> => {
    throw new Error('Method not implemented.');
  };

  // `to` side - deposit
  getVaultsInfo = async (
    chain: StakeChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]> => {
    const vaults = await this.getVaults([inputTokenAddress]);

    return vaults
      .filter(
        (vault) =>
          vault.chainID === chain.id &&
          getAddress(vault.token.address) === inputTokenAddress
      )
      .map((vault) => this.formatVaultMetadata(vault));
  };

  withdraw = async (
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> => {
    const vaults = await this.getVaults([inputToken.address]);
    const vault = vaults.find(
      (vault) =>
        vault.chainID === chain.id &&
        getAddress(vault.address) === getAddress(outputToken.address)
    );
    if (!vault) throw new Error('Vault not found');
    const maxLoss = 1n;
    const data = encodeFunctionData({
      abi: YearnV3Abi,
      functionName: 'redeem',
      args: [amount, userAddress, userAddress, maxLoss],
    });
    return [
      {
        description: `Withdraw ${amount} ${inputToken.symbol} from ${vault.name} on Yearn V3`,
        displayAmount: amount.toString(),
        to: vault.address,
        value: BigInt(0),
        data,
      },
    ];
  };

  deposit = async (
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> => {
    throw new Error('Method not implemented.');
  };

  private formatVaultMetadata(vault: YearnVault): VaultMetadata {
    return {
      protocol: {
        id: YEARN_V3.id,
        name: YEARN_V3.name,
        siteUrl: YEARN_V3.siteUrl,
        isWithdrawalSupported: YEARN_V3.isWithdrawalSupported,
      },
      name: `${vault.name} Pool`,
      category: Category.YIELD,
      siteUrl: `https://yearn.fi/v3/${vault.chainID}/${vault.address}`,
      inputToken: {
        name: vault.token.name,
        symbol: vault.token.symbol,
        decimals: vault.token.decimals,
        address: vault.token.address,
        logoUrl:
          TOKEN_IMAGES[
            vault.token.address.toLowerCase() as keyof typeof TOKEN_IMAGES
          ],
      },
      outputToken: {
        name: vault.symbol,
        symbol: vault.symbol,
        decimals: vault.decimals,
        address: vault.address,
        logoUrl: undefined,
      },
      tvl: vault.tvl.tvl,
      apy: getAPR(vault) / 100,
      rewards: [],
    };
  }
}
