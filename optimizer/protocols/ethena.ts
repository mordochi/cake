import PublicClient from '@services/publicClient';
import {
  Address,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getContract,
  isAddressEqual,
} from 'viem';
import { BentoChainType } from '@/models/cases/v3/types';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import {
  Action,
  Category,
  DefiProtocol,
  PermitTx,
  Token,
  TxInfo,
  VaultMetadata,
} from '../types';
import { approveERC20Tx, generateDescription, getTokenInfo } from '../utils';
import StakedUSDeV2 from './abi/StakedUSDeV2.json';

export default class Ethena implements DefiProtocol {
  id = 'ethena';
  name = 'Ethena';
  siteUrl = 'https://www.ethena.fi';
  category = Category.STAKED;
  isWithdrawalSupported = false;

  async getPositionInfo(
    chain: BentoChainType,
    inputTokenAddress: Address,
    outputTokenAddress: Address
  ): Promise<VaultMetadata> {
    const mappedTokenAddress = this.tokenMapping[inputTokenAddress];
    if (
      mappedTokenAddress === undefined ||
      !isAddressEqual(mappedTokenAddress, outputTokenAddress)
    ) {
      throw new Error(
        `${inputTokenAddress} -> ${outputTokenAddress} mapping is not supported`
      );
    }
    const inputToken = await getTokenInfo(chain, inputTokenAddress);
    const outputToken = await getTokenInfo(chain, outputTokenAddress);
    if (!inputToken || !outputToken) {
      throw new Error('Failed to get token info');
    }
    return {
      protocol: {
        id: this.id,
        name: this.name,
        siteUrl: this.siteUrl,
        isWithdrawalSupported: this.isWithdrawalSupported,
      },
      name: inputToken.symbol,
      category: this.category,
      siteUrl: 'https://app.ethena.fi/earn',
      inputToken,
      outputToken,
      tvl: await this.getTVL(chain),
      apy: await this.getAPY(),
      rewards: [],
    };
  }

  async getVaultsInfo(
    chain: BentoChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]> {
    const inputToken = await getTokenInfo(chain, inputTokenAddress);
    const outputTokenAddress = this.tokenMapping[inputTokenAddress];
    if (!outputTokenAddress) return [];
    const outputToken = await getTokenInfo(chain, outputTokenAddress);
    if (!inputToken || !outputToken) {
      throw new Error('Failed to get token info');
    }
    return [
      {
        protocol: {
          id: this.id,
          name: this.name,
          siteUrl: this.siteUrl,
          isWithdrawalSupported: this.isWithdrawalSupported,
        },
        name: inputToken.symbol,
        category: this.category,
        siteUrl: 'https://app.ethena.fi/earn',
        inputToken,
        outputToken,
        tvl: await this.getTVL(chain),
        apy: await this.getAPY(),
        rewards: [],
      },
    ];
  }

  async getWithdrawalAmount(
    _chain: BentoChainType,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<bigint> {
    throw new Error(`Withdrawal not supported for ${this.name}`);
  }

  async withdraw(
    _chain: BentoChainType,
    _userAddress: Address,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    throw new Error(`Withdrawal not supported for ${this.name}`);
  }

  async deposit(
    _chain: BentoChainType,
    userAddress: Address,
    inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    return [
      approveERC20Tx(inputToken, this.sUsdeAddr, this.name, amount),
      {
        description: generateDescription({
          type: Action.DEPOSIT,
          protocolName: this.name,
          displayAmount: formatUnits(amount, inputToken.decimals),
          pair: {
            inputTokenSymbol: inputToken.symbol,
          },
        }),
        displayAmount: formatUnits(amount, inputToken.decimals),
        to: this.sUsdeAddr,
        value: 0n,
        data: encodeFunctionData({
          abi: StakedUSDeV2,
          functionName: 'deposit',
          args: [amount, userAddress],
        }),
      },
    ];
  }

  private async getAPY(): Promise<number> {
    const [res, _] = await tryExecuteRequest(() =>
      apiCaller.get(
        'https://app.ethena.fi/api/yields/protocol-and-staking-yield'
      )
    );
    return res.stakingYield.value / 100;
  }

  private async getTVL(chain: BentoChainType): Promise<number> {
    const client = PublicClient.get(chain);
    const usde = getContract({
      address: this.usdeAddr,
      abi: erc20Abi,
      client,
    });
    const decimals = await usde.read.decimals();
    const totalSupply = (await usde.read.totalSupply()) as bigint;
    return Number(formatUnits(totalSupply, decimals));
  }

  private usdeAddr = '0x4c9edd5852cd905f086c759e8383e09bff1e68b3' as Address;
  private sUsdeAddr = '0x9d39a5de30e57443bff2a8307a4256c8797a3497' as Address;

  private tokenMapping: Partial<Record<Address, Address>> = {
    // USDe -> sUSDe
    '0x4c9edd5852cd905f086c759e8383e09bff1e68b3':
      '0x9d39a5de30e57443bff2a8307a4256c8797a3497',
  };
}
