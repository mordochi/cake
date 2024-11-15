import PublicClient from '@services/publicClient';
import {
  Address,
  encodeFunctionData,
  formatUnits,
  getContract,
  isAddressEqual,
} from 'viem';
import { mainnet } from 'viem/chains';
import { StakeChainType } from '@/cases/types';
import { aprToApy } from '@/cases/utils';
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
import AavePoolV3 from './abi/AavePoolV3.json';
import AaveProtocolDataProvider from './abi/AaveProtocolDataProvider.json';
import AaveWrappedTokenGatewayV3 from './abi/AaveWrapedTokenGatewayV3.json';

export default class Aave implements DefiProtocol {
  id = 'aave3';
  name = 'Aave V3';
  siteUrl = 'https://app.aave.com';
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
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    if (inputToken.address === NATIVE_TOKEN_ADDRESS) {
      const txInfos: TxInfo[] = [];
      const approveTx = approveERC20Tx(
        outputToken,
        this.aaveContractAddrs[chain.id].WrappedTokenGateway,
        this.name,
        MAX_UINT256 // currently use max uint256 to withdraw all
      );
      txInfos.push(approveTx);
      txInfos.push(
        this.withdrawNativeToken(
          chain.id,
          userAddress,
          inputToken,
          outputToken,
          amount
        )
      );
      return txInfos;
    }
    return [
      this.withdrawERC20Token(
        chain.id,
        userAddress,
        inputToken,
        outputToken,
        amount
      ),
    ];
  }

  private withdrawNativeToken(
    chainId: number,
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
      to: this.aaveContractAddrs[chainId].WrappedTokenGateway,
      value: 0n,
      data: encodeFunctionData({
        abi: AaveWrappedTokenGatewayV3,
        functionName: 'withdrawETH',
        args: [
          this.aaveContractAddrs[chainId].Pool, // pool
          MAX_UINT256, // amount, currently use max uint256 to withdraw all
          userAddress, // to
        ],
      }),
    };
  }

  private withdrawERC20Token(
    chainId: number,
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
      to: this.aaveContractAddrs[chainId].Pool,
      value: 0n,
      data: encodeFunctionData({
        abi: AavePoolV3,
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
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    _outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    if (inputToken.address === NATIVE_TOKEN_ADDRESS) {
      return [
        this.depositNativeToken(chain.id, userAddress, inputToken, amount),
      ];
    }
    const txInfos: TxInfo[] = [];
    const approveTx = approveERC20Tx(
      inputToken,
      this.aaveContractAddrs[chain.id].Pool,
      this.name,
      amount
    );
    txInfos.push(
      approveTx,
      this.depositERC20Token(chain.id, userAddress, inputToken, amount)
    );
    return txInfos;
  }

  private depositNativeToken(
    chainId: number,
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
      to: this.aaveContractAddrs[chainId].WrappedTokenGateway,
      value: amount,
      data: encodeFunctionData({
        abi: AaveWrappedTokenGatewayV3,
        functionName: 'depositETH',
        args: [
          this.aaveContractAddrs[chainId].Pool, // pool
          userAddress, // onBehalfOf
          0, // referralCode, is currently inactive
        ],
      }),
    };
  }

  private depositERC20Token(
    chainId: number,
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
      to: this.aaveContractAddrs[chainId].Pool,
      value: 0n,
      data: encodeFunctionData({
        abi: AavePoolV3,
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
      address: this.aaveContractAddrs[chain.id].ProtocolDataProvider,
      abi: AaveProtocolDataProvider,
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
      address: this.aaveContractAddrs[chain.id].ProtocolDataProvider,
      abi: AaveProtocolDataProvider,
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
      address: this.aaveContractAddrs[chain.id].Oracle,
      abi: Oracle,
      client: client,
    });

    return (await oracle.read.getAssetPrice([inputTokenAddress])) as bigint;
  }

  private aaveContractAddrs: Record<number, Record<string, Address>> = {
    [mainnet.id]: {
      Oracle: '0x54586bE62E3c3580375aE3723C145253060Ca0C2',
      Pool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
      PoolAddressesProvider: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
      ProtocolDataProvider: '0x41393e5e337606dc3821075Af65AeE84D7688CBD',
      UiPoolDataProvider: '0x194324C9Af7f56E22F1614dD82E18621cb9238E7',
      WrappedTokenGateway: '0xA434D495249abE33E031Fe71a969B81f3c07950D',
    },
  };

  private tokenMapping: Partial<Record<Address, Address>> = {
    // ETH -> aEthWETH
    [NATIVE_TOKEN_ADDRESS]: '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
    // WETH -> aEthWETH
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      '0x4d5f47fa6a74757f35c14fd3a6ef8e3c9bc514e8',
    // wstETH -> aEthwstETH
    '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0':
      '0x0b925ed163218f6662a35e0f0371ac234f9e9371',
    // weETH -> aEthweETH
    '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee':
      '0xbdfa7b7893081b35fb54027489e2bc7a38275129',
    // rETH -> aEthrETH
    '0xae78736cd615f374d3085123a210448e74fc6393':
      '0xcc9ee9483f662091a1de4795249e24ac0ac2630f',
    // cbETH -> aEthcbETH
    '0xbe9895146f7af43049ca1c1ae358b0541ea49704':
      '0x977b6fc5de62598b08c85ac8cf2b745874e8b78c',
    // osETH -> aEthosETH
    '0xf1c9acdc66974dfb6decb12aa385b9cd01190e38':
      '0x927709711794f3de5ddbf1d176bee2d55ba13c21',
    // USDT -> aEthUSDT
    '0xdac17f958d2ee523a2206206994597c13d831ec7':
      '0x23878914efe38d27c4d67ab83ed1b93a74d4086a',
    // USDC -> aEthUSDC
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':
      '0x98c23e9d8f34fefb1b7bd6a91b7ff122f4e16f5c',
    // USDe -> aEthUSDe
    '0x4c9edd5852cd905f086c759e8383e09bff1e68b3':
      '0x4f5923fc5fd4a93352581b38b7cd26943012decf',
    // DAI -> aEthDAI
    '0x6b175474e89094c44da98b954eedeac495271d0f':
      '0x018008bfb33d285247a21d44e50697654f754e63',
    // sDAI -> aEthsDAI
    '0x83f20f44975d03b1b09e64809b757c47f942beea':
      '0x4c612e3b15b96ff9a6faed838f8d07d479a8dd4c',
    // PYUSD -> aEthPYUSD
    '0x6c3ea9036406852006290770bedfcaba0e23a0e8':
      '0x0c0d01abf3e6adfca0989ebba9d6e85dd58eab1e',
    // LUSD -> aEthLUSD
    '0x5f98805a4e8be255a32880fdec7f6728c6568ba0':
      '0x3fe6a295459fae07df8a0cecc36f37160fe86aa9',
    // crvUSD -> aEthcrvUSD
    '0xf939e0a03fb07f59a73314e73794be0e57ac1b4e':
      '0xb82fa9f31612989525992fcfbb09ab22eff5c85a',
    // USDS -> aEthUSDS
    '0xdc035d45d973e3ec169d2276ddab16f1e407384f':
      '0x32a6268f9ba3642dda7892add74f1d34469a4259',
  };
}
