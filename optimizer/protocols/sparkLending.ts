import {
  Address,
  encodeFunctionData,
  formatUnits,
  getContract,
  isAddressEqual,
} from 'viem';
import { aprToApy } from '@/cases/utils';
import { StakeChainType } from '@/models/cases/v3/types';
import PublicClient from '@services/publicClient';
import { MAX_UINT256, NATIVE_TOKEN_ADDRESS, RAY_DECIMALS } from '../consts';
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
import Oracle from './abi/AaveOracle.json';
import Pool from './abi/AavePoolV3.json';
import ProtocolDataProvider from './abi/AaveProtocolDataProvider.json';
import WrappedTokenGatewayV3 from './abi/AaveWrapedTokenGatewayV3.json';

export default class SparkLending implements DefiProtocol {
  id = 'spark';
  name = 'Spark';
  siteUrl = 'https://app.spark.fi/markets';
  category = Category.LENDING;
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
      siteUrl: this.siteUrl,
      inputToken,
      outputToken,
      tvl: await this.getTVL(chain, inputToken),
      apy: await this.getAPY(chain, inputToken),
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
        siteUrl: this.siteUrl,
        inputToken,
        outputToken,
        tvl: await this.getTVL(chain, inputToken),
        apy: await this.getAPY(chain, inputToken),
        rewards: [],
      },
    ];
  }

  async getWithdrawalAmount(
    _chain: StakeChainType,
    _inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<bigint> {
    return amount;
  }

  async withdraw(
    _chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    if (inputToken.address === NATIVE_TOKEN_ADDRESS) {
      const txs: TxInfo[] = [];
      const approveTx = approveERC20Tx(
        outputToken,
        this.wrappedTokenGatewayAddr,
        this.name,
        MAX_UINT256 // currently use max uint256 to withdraw all
      );
      txs.push(approveTx);
      txs.push(
        this.withdrawNativeToken(userAddress, inputToken, outputToken, amount)
      );
      return txs;
    }
    return [
      this.withdrawERC20Token(userAddress, inputToken, outputToken, amount),
    ];
  }

  private withdrawNativeToken(
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): TxInfo {
    return {
      description: generateDescription({
        type: Action.WITHDRAW,
        protocolName: this.name,
        displayAmount: formatUnits(amount, inputToken.decimals),
        pair: {
          inputTokenSymbol: inputToken.symbol,
          outputTokenSymbol: outputToken.symbol,
        },
      }),
      displayAmount: formatUnits(amount, inputToken.decimals),
      to: this.wrappedTokenGatewayAddr,
      value: 0n,
      data: encodeFunctionData({
        abi: WrappedTokenGatewayV3,
        functionName: 'withdrawETH',
        args: [
          this.poolAddr, // pool
          MAX_UINT256, // amount, currently use max uint256 to withdraw all
          userAddress, // to
        ],
      }),
    };
  }

  private withdrawERC20Token(
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): TxInfo {
    return {
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
      to: this.poolAddr,
      value: 0n,
      data: encodeFunctionData({
        abi: Pool,
        functionName: 'withdraw',
        args: [
          inputToken.address, // asset
          MAX_UINT256, // amount, currently use max uint256 to withdraw all
          userAddress, // to
        ],
      }),
    };
  }

  async deposit(
    _chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    if (inputToken.address === NATIVE_TOKEN_ADDRESS) {
      return [this.depositNativeToken(userAddress, inputToken, amount)];
    }
    const txs: TxInfo[] = [];
    const approveTx = approveERC20Tx(
      inputToken,
      this.poolAddr,
      this.name,
      amount
    );
    txs.push(
      approveTx,
      this.depositERC20Token(userAddress, inputToken, amount)
    );
    return txs;
  }

  private depositNativeToken(
    userAddress: Address,
    inputToken: Token,
    amount: bigint
  ): TxInfo {
    return {
      description: generateDescription({
        type: Action.DEPOSIT,
        protocolName: this.name,
        displayAmount: formatUnits(amount, inputToken.decimals),
        pair: {
          inputTokenSymbol: inputToken.symbol,
        },
      }),
      displayAmount: formatUnits(amount, inputToken.decimals),
      to: this.wrappedTokenGatewayAddr,
      value: amount,
      data: encodeFunctionData({
        abi: WrappedTokenGatewayV3,
        functionName: 'depositETH',
        args: [
          this.poolAddr, // pool
          userAddress, // onBehalfOf
          0, // referralCode, is currently inactive
        ],
      }),
    };
  }

  private depositERC20Token(
    userAddress: Address,
    inputToken: Token,
    amount: bigint
  ): TxInfo {
    return {
      description: generateDescription({
        type: Action.DEPOSIT,
        protocolName: this.name,
        displayAmount: formatUnits(amount, inputToken.decimals),
        pair: {
          inputTokenSymbol: inputToken.symbol,
        },
      }),
      displayAmount: formatUnits(amount, inputToken.decimals),
      to: this.poolAddr,
      value: 0n,
      data: encodeFunctionData({
        abi: Pool,
        functionName: 'supply',
        args: [
          inputToken.address, // asset
          amount, // amount
          userAddress, // onBehalfOf
          0, // referralCode, is currently inactive
        ],
      }),
    };
  }

  private async getAPY(
    chain: StakeChainType,
    inputToken: Token
  ): Promise<number> {
    const address =
      inputToken.address === NATIVE_TOKEN_ADDRESS
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : inputToken.address;
    const { liquidityRate } = await this.getReserveData(chain, address);
    const apr = Number(formatUnits(liquidityRate, RAY_DECIMALS));
    const secondsInYear = 31536000;
    return aprToApy(apr, secondsInYear);
  }

  private async getTVL(
    chain: StakeChainType,
    inputToken: Token
  ): Promise<number> {
    const address =
      inputToken.address === NATIVE_TOKEN_ADDRESS
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : inputToken.address;
    const totalSupply = await this.getATokenTotalSupply(chain, address);
    const price = await this.getTokenPrice(chain, address);
    return (
      Number(formatUnits(totalSupply, inputToken.decimals)) *
      Number(formatUnits(price, 8))
    );
  }

  private async getReserveData(
    chain: StakeChainType,
    tokenAddress: Address
  ): Promise<{
    accruedToTreasuryScaled: bigint;
    liquidityRate: bigint;
    liquidityIndex: bigint;
    variableBorrowIndex: bigint;
  }> {
    const client = PublicClient.get(chain);

    const dataProvider = getContract({
      address: this.protocolDataProviderAddr,
      abi: ProtocolDataProvider,
      client: client,
    });

    const data = (await dataProvider.read.getReserveData([
      tokenAddress,
    ])) as bigint[];

    return {
      accruedToTreasuryScaled: data[1],
      liquidityRate: data[5],
      liquidityIndex: data[9],
      variableBorrowIndex: data[10],
    };
  }

  private async getATokenTotalSupply(
    chain: StakeChainType,
    tokenAddress: Address
  ): Promise<bigint> {
    const client = PublicClient.get(chain);

    const dataProvider = getContract({
      address: this.protocolDataProviderAddr,
      abi: ProtocolDataProvider,
      client: client,
    });

    return (await dataProvider.read.getATokenTotalSupply([
      tokenAddress,
    ])) as bigint;
  }

  private async getTokenPrice(
    chain: StakeChainType,
    inputTokenAddress: Address
  ): Promise<bigint> {
    const client = PublicClient.get(chain);

    const oracle = getContract({
      address: this.oracleAddr,
      abi: Oracle,
      client: client,
    });

    return (await oracle.read.getAssetPrice([inputTokenAddress])) as bigint;
  }

  private wrappedTokenGatewayAddr =
    '0xBD7D6a9ad7865463DE44B05F04559f65e3B11704' as Address;
  private poolAddr = '0xC13e21B648A5Ee794902342038FF3aDAB66BE987' as Address;
  private protocolDataProviderAddr =
    '0xFc21d6d146E6086B8359705C8b28512a983db0cb' as Address;
  private oracleAddr = '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9' as Address;

  private tokenMapping: Partial<Record<Address, Address>> = {
    // ETH -> spWETH
    [NATIVE_TOKEN_ADDRESS]: '0x59cd1c87501baa753d0b5b5ab5d8416a45cd71db',
    // WETH -> spWETH
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      '0x59cd1c87501baa753d0b5b5ab5d8416a45cd71db',
    // DAI -> spDAI
    '0x6b175474e89094c44da98b954eedeac495271d0f':
      '0x4dedf26112b3ec8ec46e7e31ea5e123490b05b8b',
    // sDAI -> spsDAI
    '0x83f20f44975d03b1b09e64809b757c47f942beea':
      '0x78f897f0fe2d3b5690ebae7f19862deacedf10a7',
    // USDC -> spUSDC
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
      '0x377c3bd93f2a2984e1e7be6a5c22c525ed4a4815',
    // wstETH -> spwstETH
    '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0':
      '0x12b54025c112aa61face2cdb7118740875a566e9',
    // rETH -> sprETH
    '0xae78736cd615f374d3085123a210448e74fc6393':
      '0x9985df20d7e9103ecbceb16a84956434b6f06ae8',
    // USDT -> spUSDT
    '0xdac17f958d2ee523a2206206994597c13d831ec7':
      '0xe7df13b8e3d6740fe17cbe928c7334243d86c92f',
  };
}
