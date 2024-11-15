import { Address } from 'viem';
import { StakeChainType } from '@/models/cases/v3/types';
import { DefiProtocol, PermitTx, Token, TxInfo, VaultMetadata } from '../types';
import { approveERC20Tx } from '../utils';
import {
  Market,
  PENDLE,
  fetchActiveMarkets,
  fetchMarketInfoByAddress,
  fetchMarketInfoByToken,
  getAddLiquidityTx,
} from './pendleUtils';

export default class Pendle implements DefiProtocol {
  id = PENDLE.id;
  isWithdrawalSupported = PENDLE.isWithdrawalSupported;

  async getPositionInfo(
    chain: StakeChainType,
    inputTokenAddress: Address,
    outputTokenAddress: Address
  ): Promise<VaultMetadata> {
    const marketInfo = await fetchMarketInfoByToken(
      chain.id,
      inputTokenAddress,
      outputTokenAddress
    );
    return this.formatVaultMetadata(marketInfo);
  }

  async getVaultsInfo(
    chain: StakeChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]> {
    // Fetch active markets filtered by input token address
    const activeMarkets = await fetchActiveMarkets(chain, inputTokenAddress);
    // Fetch market info for each active market
    const markets = await Promise.all(
      activeMarkets.map(async (marketAddress) => {
        const marketInfo = await fetchMarketInfoByAddress(
          chain.id,
          marketAddress
        );
        return this.formatVaultMetadata(marketInfo);
      })
    );
    return markets;
  }

  getWithdrawalAmount(
    _chain: StakeChainType,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<bigint> {
    throw new Error('Method not implemented.');
  }

  withdraw(
    _chain: StakeChainType,
    _userAddress: Address,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    throw new Error('Method not implemented.');
  }

  async deposit(
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    const approveTx = approveERC20Tx(
      inputToken,
      PENDLE.ROUTER_V4 as Address,
      PENDLE.name,
      amount
    );

    const addLiquidityTx = await getAddLiquidityTx(
      chain.id,
      userAddress,
      inputToken,
      outputToken,
      amount
    );

    return [approveTx, addLiquidityTx];
  }

  // Transform market info into VaultMetadata
  private formatVaultMetadata(market: Market): VaultMetadata {
    return {
      protocol: {
        id: PENDLE.id,
        name: PENDLE.name,
        siteUrl: PENDLE.siteUrl,
        isWithdrawalSupported: PENDLE.isWithdrawalSupported,
      },
      name: `${market.underlyingToken.name} Pool`,
      category: PENDLE.category,
      siteUrl: `${PENDLE.siteUrl}/trade/pools/${market.address}`,
      inputToken: market.underlyingToken,
      outputToken: market.lpToken,
      tvl: market.liquidity.usd,
      apy: market.apy.max / 100,
      rewards: market.rewards,
    };
  }
}
