import PublicClient from '@services/publicClient';
import {
  Address,
  encodeFunctionData,
  formatUnits,
  getContract,
  isAddressEqual,
} from 'viem';
import { StakeChainType } from '@/cases/types';
import { aprToApy } from '@/cases/utils';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import { NATIVE_TOKEN_ADDRESS } from '../consts';
import {
  Action,
  Category,
  DefiProtocol,
  PermitTx,
  Token,
  TxInfo,
  VaultMetadata,
} from '../types';
import { generateDescription, getTokenInfo } from '../utils';
import RocketDepositPool from './abi/RocketDepositPool.json';
import RocketTokenRETH from './abi/RocketTokenRETH.json';

export default class RocketPool implements DefiProtocol {
  id = 'rocketpool';
  name = 'Rocket Pool';
  siteUrl = 'https://rocketpool.net/';
  category = Category.STAKED;
  isWithdrawalSupported = true;

  async getPositionInfo(
    chain: StakeChainType,
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
      siteUrl: 'https://stake.rocketpool.net/liquid-staking/unstake',
      inputToken,
      outputToken,
      tvl: await this.getTVL(),
      apy: await this.getAPY(),
      rewards: [],
    };
  }

  async getVaultsInfo(
    chain: StakeChainType,
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
        siteUrl: 'https://stake.rocketpool.net/liquid-staking/stake',
        inputToken,
        outputToken,
        tvl: await this.getTVL(),
        apy: await this.getAPY(),
        rewards: [],
      },
    ];
  }

  async getWithdrawalAmount(
    chain: StakeChainType,
    _inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<bigint> {
    const client = PublicClient.get(chain);
    const rETH = getContract({
      address: this.rETHAddress,
      abi: RocketTokenRETH,
      client,
    });
    return (await rETH.read.getEthValue([amount])) as bigint;
  }

  async withdraw(
    _chain: StakeChainType,
    _userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    return [
      {
        description: generateDescription({
          type: Action.WITHDRAW,
          protocolName: this.name,
          displayAmount: formatUnits(amount, outputToken.decimals),
          pair: {
            inputTokenSymbol: inputToken.symbol,
            outputTokenSymbol: outputToken.symbol,
          },
        }),
        displayAmount: formatUnits(amount, outputToken.decimals),
        to: this.rETHAddress,
        value: 0n,
        data: encodeFunctionData({
          abi: RocketTokenRETH,
          functionName: 'burn',
          args: [amount],
        }),
      },
    ];
  }

  async deposit(
    _chain: StakeChainType,
    _userAddress: Address,
    inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    return [
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
        to: this.rocketDepositPoolAddress,
        value: amount,
        data: encodeFunctionData({
          abi: RocketDepositPool,
          functionName: 'deposit',
        }),
      },
    ];
  }

  private rocketDepositPoolAddress =
    '0xDD3f50F8A6CafbE9b31a427582963f465E745AF8' as Address;

  private rETHAddress = '0xae78736Cd615f374D3085123A210448E74Fc6393' as Address;

  private async getAPY(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('https://stake.rocketpool.net/api/mainnet/payload')
    );

    if (err) return 0;

    const apr = parseFloat(res.rethAPR) / 100;
    return aprToApy(apr, 365);
  }

  private async getTVL(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('https://stake.rocketpool.net/api/mainnet/payload')
    );

    if (err) return 0;
    const totalStaked = parseFloat(res.stats.ethStakingTotal);
    const ethPrice = parseFloat(res.ethPrice);
    return totalStaked * ethPrice;
  }

  private tokenMapping: Partial<Record<Address, Address>> = {
    [NATIVE_TOKEN_ADDRESS]: '0xae78736cd615f374d3085123a210448e74fc6393',
  };
}
