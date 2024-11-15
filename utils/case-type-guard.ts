import { ERC20AmountInputOptions, ReceiverInputOptions } from '@/cases/types';

export const isERC20AmountInputOptions = (
  options: unknown
): options is ERC20AmountInputOptions =>
  !!(options as ERC20AmountInputOptions)?.token;

export const isReceiverInputOptions = (
  options: unknown
): options is ReceiverInputOptions =>
  !!(options as ReceiverInputOptions)?.isReceiver;
