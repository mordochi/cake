import { Address, encodeFunctionData, getAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { StakeChainType } from '@/models/cases/v3/types';
import TOKEN_IMAGES from '../tokenImages';
import { Category, DefiProtocol, Token, TxInfo, VaultMetadata } from '../types';
import YearnV3Abi from './abi/YearnV3.json';
import GaugeV2Abi from './abi/GaugeV2.json';
import { YEARN_V3, YearnVault, getAPR } from './yearnUtils';

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
      chainIDs: [mainnet].map((value) => value.id.toString()).join(','),
      limit: '2500',
    });
    const url = `https://ydaemon.yearn.fi/vaults?` + query;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const vaults = (await response.json()) as YearnVault[];

    const cachedVaults = vaults.filter((vault) => {
      return (
        vault.version.split('.')[0] === '3' &&
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
    const vaults = await this.getVaults([inputTokenAddress]);

    const vault = vaults.find(
      (vault) =>
        getAddress(vault.address) === getAddress(outputTokenAddress) ||
        getAddress(vault.staking.address) === getAddress(outputTokenAddress)
    );

    if (!vault) throw new Error('Vault not found');

    return this.formatVaultMetadata(vault);
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
        getAddress(vault.address) === getAddress(outputToken.address) ||
        getAddress(vault.staking.address) === getAddress(outputToken.address)
    );
    if (!vault) throw new Error('Vault not found');
    let txs: TxInfo[] = [];

    if (getAddress(vault.staking.address) === getAddress(outputToken.address)) {
      txs.push({
        description: `Unstake ${amount} ${outputToken.symbol} from ${vault.name} on Yearn V3`,
        displayAmount: amount.toString(),
        to: vault.staking.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: GaugeV2Abi,
          functionName: 'withdraw',
          args: [amount, userAddress, userAddress, true],
        }),
      });
    }

    const maxLoss = 1n;
    const data = encodeFunctionData({
      abi: YearnV3Abi,
      functionName: 'redeem',
      args: [amount, userAddress, userAddress, maxLoss],
    });
    txs.push({
      description: `Withdraw ${amount} ${inputToken.symbol} from ${vault.name} on Yearn V3`,
      displayAmount: amount.toString(),
      to: vault.address,
      value: BigInt(0),
      data,
    });

    return txs;
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
      apy: getAPR(vault),
      rewards: [],
    };
  }
}
