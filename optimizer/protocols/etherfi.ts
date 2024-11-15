import { Address, encodeFunctionData, formatUnits, isAddressEqual } from 'viem';
import { aprToApy } from '@/cases/utils';
import { BentoChainType } from '@/models/cases/v3/types';
import { apiCaller } from '@/utils/apiCaller';
import { tryExecuteRequest } from '@/utils/tryExecute';
import { NATIVE_TOKEN_ADDRESS } from '../consts';
import {
  Action,
  Category,
  DefiProtocol,
  LEARN_MORE_DESC,
  PermitTx,
  Reward,
  Token,
  TxInfo,
  VaultMetadata,
} from '../types';
import { approveERC20Tx, generateDescription, getTokenInfo } from '../utils';
import EtherFiLiquidityPoolAbi from './abi/EtherFiLiquidityPool.json';
import EtherFiLiquifierAbi from './abi/EtherFiLiquifier.json';

export default class EtherFi implements DefiProtocol {
  id = 'etherfi';
  name = 'ether.fi';
  siteUrl = 'https://www.ether.fi/';
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
      siteUrl: 'https://app.ether.fi/',
      inputToken,
      outputToken,
      tvl: await this.getTVL(),
      apy: await this.getAPY(),
      rewards: this.rewards,
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
        siteUrl: 'https://app.ether.fi/',
        inputToken,
        outputToken,
        tvl: await this.getTVL(),
        apy: await this.getAPY(),
        rewards: this.rewards,
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
    _userAddress: Address,
    inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    switch (inputToken.address) {
      case NATIVE_TOKEN_ADDRESS:
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
            to: this.liquidityPoolAddr,
            value: amount,
            data: encodeFunctionData({
              abi: EtherFiLiquidityPoolAbi,
              functionName: 'deposit',
            }),
          },
        ];
      case '0xae7ab96520de3a18e5e111b5eaab095312d7fe84':
        return [
          approveERC20Tx(inputToken, this.liquifierAddr, this.name, amount),
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
            to: this.liquifierAddr,
            value: 0n,
            data: encodeFunctionData({
              abi: EtherFiLiquifierAbi,
              functionName: 'depositWithERC20',
              args: [
                inputToken.address, // token
                amount, // amount
                '0x0000000000000000000000000000000000000000', // referral
              ],
            }),
          },
        ];
      default:
        throw new Error(`Deposit not supported for ${inputToken.symbol}`);
    }
  }

  private async getAPY(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('/case/api/etherfi/apy')
    );

    if (err) {
      return 0;
    }
    const apr = res.latest_aprs.at(-1) as number;
    // This formula is found from code of https://app.ether.fi/eeth
    return aprToApy(apr / 0.9 / 100 / 100, 365);
  }

  private async getTVL(): Promise<number> {
    const [res, err] = await tryExecuteRequest(() =>
      apiCaller.get('/case/api/etherfi/tvl')
    );

    if (err) {
      return 0;
    }
    return res.tvl as number;
  }

  private liquidityPoolAddr =
    '0x308861A430be4cce5502d0A12724771Fc6DaF216' as Address;

  private liquifierAddr =
    '0x9FFDF407cDe9a93c47611799DA23924Af3EF764F' as Address;

  private eETHAddr = '0x35fA164735182de50811E8e2E824cFb9B6118ac2' as Address;

  private tokenMapping: Partial<Record<Address, Address>> = {
    // ETH -> eETH
    [NATIVE_TOKEN_ADDRESS]: this.eETHAddr,
    // stETH -> eETH
    '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': this.eETHAddr,
  };

  private rewards: Reward[] = [
    {
      name: 'Loyalty Point',
      desc: LEARN_MORE_DESC,
      logoUrl: 'https://app.ether.fi/images/liquid/loyalty-icon.svg',
    },
    {
      name: 'LRT2 Point',
      desc: LEARN_MORE_DESC,
      logoUrl: 'https://app.ether.fi/images/rewards/lrt2-icon.svg',
    },
  ];
}
