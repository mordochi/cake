import { Address } from 'viem';
import { StakeChainType } from '@/cases/types';
import Aave from './protocols/aave';
import Ethena from './protocols/ethena';
import Etherfi from './protocols/etherfi';
import Lido from './protocols/lido';
import Morpho from './protocols/morpho';
import Pendle from './protocols/pendle';
import RocketPool from './protocols/rocketpool';
import SparkLending from './protocols/sparkLending';
import {
  DefiProtocol,
  PositionPair,
  Token,
  Tx,
  VaultMetadata,
  Withdraw,
} from './types';

class ProtocolManager {
  private static instance: ProtocolManager;

  private protocols: Partial<Record<string, DefiProtocol>> = {};

  public static getInstance(): ProtocolManager {
    if (!ProtocolManager.instance) {
      ProtocolManager.instance = new ProtocolManager();
      this.instance.initialize();
    }
    return ProtocolManager.instance;
  }

  private initialize(): void {
    const protocols = [
      new Aave(),
      new Morpho(),
      new Pendle(),
      new RocketPool(),
      new Lido(),
      new SparkLending(),
      new Ethena(),
      new Etherfi(),
    ];
    protocols.forEach((protocol) => {
      this.protocols[protocol.id] = protocol;
    });
  }

  public async getPositionsMetadata(
    chain: StakeChainType,
    protocolPairs: PositionPair[]
  ): Promise<VaultMetadata[]> {
    const promises = protocolPairs.map((pair) => {
      const protocol = this.protocols[pair.protocolId];
      if (!protocol) return Promise.resolve([]);
      return protocol
        .getPositionInfo(chain, pair.inputTokenAddress, pair.outputTokenAddress)
        .catch((_) => []);
    });

    const results = await Promise.all(promises);
    return results.flat();
  }

  public async getVaultsMetadata(
    chain: StakeChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]> {
    const promises = Object.values(this.protocols)
      .filter((protocol): protocol is DefiProtocol => protocol !== undefined)
      .map((protocol) => protocol.getVaultsInfo(chain, inputTokenAddress));

    const results = await Promise.all(promises);
    return results.flat();
  }

  public async withdraw(
    protocolId: string,
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<Withdraw> {
    const protocol = this.protocols[protocolId];
    if (!protocol)
      throw new Error(`Protocol with id '${protocolId}' not found`);
    const txs = await protocol.withdraw(
      chain,
      userAddress,
      inputToken,
      outputToken,
      amount
    );
    const withdrawAmount = await protocol.getWithdrawalAmount(
      chain,
      inputToken,
      outputToken,
      amount
    );
    return { txs, amount: withdrawAmount };
  }

  public deposit(
    protocolId: string,
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<Tx[]> {
    const protocol = this.protocols[protocolId];
    if (!protocol)
      throw new Error(`Protocol with id '${protocolId}' not found`);
    return protocol.deposit(
      chain,
      userAddress,
      inputToken,
      outputToken,
      amount
    );
  }
}

export default ProtocolManager;
