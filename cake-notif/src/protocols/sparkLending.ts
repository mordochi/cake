import { Address, formatUnits, getContract } from 'viem';
import {
  APYProvider,
  NATIVE_TOKEN_ADDRESS,
  RAY_DECIMALS,
  Token,
  aprToApy,
  publicClient,
} from '../utils';
import Oracle from './abi/AaveOracle.json';
import ProtocolDataProvider from './abi/AaveProtocolDataProvider.json';

export default class SparkLending implements APYProvider {
  id = 'spark';
  name = 'Spark';
  siteUrl = 'https://app.spark.fi/markets';

  async getAPY(inputToken: Token): Promise<number> {
    const address =
      inputToken.address === NATIVE_TOKEN_ADDRESS
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : inputToken.address;
    const { liquidityRate } = await this.getReserveData(address);
    const apr = Number(formatUnits(liquidityRate, RAY_DECIMALS));
    const secondsInYear = 31536000;
    return aprToApy(apr, secondsInYear);
  }

  async getTVL(inputToken: Token): Promise<number> {
    const address =
      inputToken.address === NATIVE_TOKEN_ADDRESS
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : inputToken.address;
    const totalSupply = await this.getATokenTotalSupply(address);
    const price = await this.getTokenPrice(address);
    return (
      Number(formatUnits(totalSupply, inputToken.decimals)) *
      Number(formatUnits(price, 8))
    );
  }

  private async getReserveData(tokenAddress: Address): Promise<{
    accruedToTreasuryScaled: bigint;
    liquidityRate: bigint;
    liquidityIndex: bigint;
    variableBorrowIndex: bigint;
  }> {
    const client = publicClient;

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

  private async getATokenTotalSupply(tokenAddress: Address): Promise<bigint> {
    const client = publicClient;

    const dataProvider = getContract({
      address: this.protocolDataProviderAddr,
      abi: ProtocolDataProvider,
      client: client,
    });

    return (await dataProvider.read.getATokenTotalSupply([
      tokenAddress,
    ])) as bigint;
  }

  private async getTokenPrice(inputTokenAddress: Address): Promise<bigint> {
    const client = publicClient;

    const oracle = getContract({
      address: this.oracleAddr,
      abi: Oracle,
      client: client,
    });

    return (await oracle.read.getAssetPrice([inputTokenAddress])) as bigint;
  }

  private protocolDataProviderAddr =
    '0xFc21d6d146E6086B8359705C8b28512a983db0cb' as Address;
  private oracleAddr = '0x8105f69D9C41644c6A0803fDA7D03Aa70996cFD9' as Address;
}
