import { Address } from 'viem';
import { BentoChainType } from '@/models/cases/v3/types';
import { DefiProtocol, PermitTx, Token, TxInfo, VaultMetadata } from '../types';
import { approveERC20Tx } from '../utils';
import {
  MORPHO,
  Vault,
  fetchVaultByTokens,
  fetchVaultsByInToken,
  getMorphoMulticallTx,
} from './morphoUtils';

export default class Morpho implements DefiProtocol {
  id = MORPHO.id;
  isWithdrawalSupported = MORPHO.isWithdrawalSupported;

  async getPositionInfo(
    chain: BentoChainType,
    inputTokenAddress: Address,
    outputTokenAddress: Address
  ): Promise<VaultMetadata> {
    const vault = await fetchVaultByTokens(
      chain,
      inputTokenAddress,
      outputTokenAddress
    );
    return this.formatVaultMetadata(vault);
  }

  async getVaultsInfo(
    chain: BentoChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]> {
    const vaults = await fetchVaultsByInToken(chain, inputTokenAddress);
    const vaultsMetadata = vaults.map((vault) =>
      this.formatVaultMetadata(vault)
    );
    return vaultsMetadata;
  }

  getWithdrawalAmount(
    _chain: BentoChainType,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<bigint> {
    throw new Error('Method not implemented.');
  }

  withdraw(
    _chain: BentoChainType,
    _userAddress: Address,
    _inputToken: Token,
    _outputToken: Token,
    _amount: bigint
  ): Promise<PermitTx | TxInfo[]> {
    throw new Error('Method not implemented.');
  }

  async deposit(
    chain: BentoChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]> {
    const approveTx = approveERC20Tx(
      inputToken,
      MORPHO.ETHEREUM_V2_BUNDLER as Address,
      MORPHO.name,
      amount
    );

    const morphoMulticallTx = await getMorphoMulticallTx({
      chain,
      inputToken,
      outputToken,
      userAddress,
      amount,
    });

    return [approveTx, morphoMulticallTx];
  }

  private formatVaultMetadata(vault: Vault): VaultMetadata {
    return {
      ...vault,
      protocol: {
        id: MORPHO.id,
        name: MORPHO.name,
        siteUrl: MORPHO.siteUrl,
        isWithdrawalSupported: this.isWithdrawalSupported,
      },
      name: vault.name,
      category: MORPHO.category,
      siteUrl: `${MORPHO.siteUrl}/vault?vault=${vault.outputToken.address}`,
    };
  }
}
