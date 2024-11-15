import { Address, encodeFunctionData, formatUnits, isAddressEqual } from 'viem';
import { ReferalAccount } from '@/cases/constants';
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
import LidoAbi from './abi/Lido.json';

export default class Lido implements DefiProtocol {
  id = 'lido';
  name = 'LIDO';
  siteUrl = 'https://lido.fi/';
  category = Category.STAKED;
  isWithdrawalSupported = false;

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
      siteUrl: 'https://stake.lido.fi/withdrawals/request',
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
        siteUrl: 'https://stake.lido.fi',
        inputToken,
        outputToken,
        tvl: await this.getTVL(),
        apy: await this.getAPY(),
        rewards: [],
      },
    ];
  }

  getWithdrawalAmount(
    _chain: StakeChainType,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<bigint> {
    throw new Error(`Withdrawal not supported for ${this.name}`);
  }

  async withdraw(
    _chain: StakeChainType,
    _userAddress: Address,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    throw new Error(`Withdrawal not supported for ${this.name}`);
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
        to: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        value: amount,
        data: encodeFunctionData({
          abi: LidoAbi,
          functionName: 'submit',
          args: [ReferalAccount],
        }),
      },
    ];
  }

  private async getAPY() {
    const [res, _] = await tryExecuteRequest(() =>
      apiCaller.get('https://eth-api.lido.fi/v1/protocol/steth/apr/sma')
    );
    const apr = res.data.smaApr / 100;
    return aprToApy(apr, 365);
  }

  private async getTVL() {
    const [res, _] = await tryExecuteRequest(() =>
      apiCaller.get('https://eth-api.lido.fi/v1/protocol/steth/stats')
    );
    return parseFloat(res.marketCap);
  }

  private tokenMapping: Partial<Record<Address, Address>> = {
    [NATIVE_TOKEN_ADDRESS]: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  };
}
