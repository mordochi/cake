import { Address, formatUnits, getContract } from 'viem';
import { mainnet } from 'viem/chains';
import {
  APYProvider,
  NATIVE_TOKEN_ADDRESS,
  RAY_DECIMALS,
  Token,
  aprToApy,
  publicClient,
} from '../utils';
import AaveProtocolDataProvider from './abi/AaveProtocolDataProvider.json';

export default class Aave implements APYProvider {
  id = 'aave3';
  name = 'Aave V3';
  siteUrl = 'https://app.aave.com';

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

  async getReserveData(tokenAddress: Address): Promise<{
    accruedToTreasuryScaled: bigint;
    liquidityRate: bigint;
    liquidityIndex: bigint;
    variableBorrowIndex: bigint;
  }> {
    const client = publicClient;

    const dataProvider = getContract({
      address: this.aaveContractAddrs[mainnet.id].ProtocolDataProvider,
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
}
