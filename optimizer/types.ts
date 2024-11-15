import { Address, Hex } from 'viem';
import { StakeChainType } from '@/models/cases/v3/types';

export const LEARN_MORE_DESC = 'Learn more';

export interface Reward {
  name: string; // e.g. "Pills", "Morpho"
  desc?: string; // e.g. "x3", LEARN_MORE_DESC
  logoUrl: string;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  logoUrl?: string;
}

export enum Category {
  LENDING = 'lending',
  STAKED = 'staked',
  YIELD = 'yield',
  OTHER = 'other',
}

export interface Protocol {
  id: string;
  name: string;
  siteUrl: string;
  isWithdrawalSupported: boolean;
}

export interface VaultMetadata {
  protocol: Protocol;
  name?: string; // e.g. vault name "Usual Boosted USDC"
  category: Category;
  siteUrl: string;
  inputToken: Token;
  outputToken: Token;
  tvl: number;
  apy: number;
  rewards: Reward[];
}

export interface Tx {
  to: Address;
  value: bigint;
  data: Hex;
}

export interface TxInfo extends Tx {
  description: string; // e.g. "Withdraw USDC from yvUSDC-1 on YearnV3"
  displayAmount: string; // e.g. "0.0000001"
}

export enum Action {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit',
  APPROVE = 'approve',
  PERMIT = 'permit',
  PERMIT2 = 'permit2',
}

export type WithdrawAction = {
  type: Action.WITHDRAW;
  protocolName: string;
  displayAmount: string;
  pair: {
    inputTokenSymbol: string;
    outputTokenSymbol: string;
  };
};

export type DepositAction = {
  type: Action.DEPOSIT;
  protocolName: string;
  displayAmount?: string;
  pair: {
    inputTokenSymbol: string;
  };
};

export type ApproveAction = {
  type: Action.APPROVE;
  spenderName?: string;
  displayAmount: string;
  tokenSymbol: string;
};

export type PermitAction = {
  type: Action.PERMIT | Action.PERMIT2;
  spenderName?: string;
  displayAmount: string;
  tokenSymbol: string;
};

export type ActionType =
  | WithdrawAction
  | DepositAction
  | ApproveAction
  | PermitAction;

export interface PermitTx {
  description: string; // e.g. "Approve the Bundler to spend 1.00 yvUSDC-1 (via permit2)"
  typedData: string;
  tx: (v: bigint, r: Hex, s: Hex) => TxInfo;
}

export interface DefiProtocol {
  id: string;
  isWithdrawalSupported: boolean;

  // `from` side - withdraw
  getPositionInfo(
    chain: StakeChainType,
    inputTokenAddress: Address,
    outputTokenAddress: Address
  ): Promise<VaultMetadata>;

  // `to` side - deposit
  getVaultsInfo(
    chain: StakeChainType,
    inputTokenAddress: Address
  ): Promise<VaultMetadata[]>;

  getWithdrawalAmount(
    chain: StakeChainType,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<bigint>;

  withdraw(
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<PermitTx | TxInfo[]>;

  deposit(
    chain: StakeChainType,
    userAddress: Address,
    inputToken: Token,
    outputToken: Token,
    amount: bigint
  ): Promise<TxInfo[]>;
}

export interface PositionPair {
  protocolId: string;
  inputTokenAddress: Address;
  outputTokenAddress: Address;
}

export interface Withdraw {
  txs: PermitTx | TxInfo[];
  // to calculate the total amount of withdraws
  amount: bigint;
}
