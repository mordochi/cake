import { Address, parseUnits } from 'viem';
import { getOneInchAddress, swapTx } from '@/cases/prebuilt-tx/1inch';
import { approveERC20TxIfNeeded } from '@/cases/prebuilt-tx/ERC20';
import { Tx } from '@/cases/types';
import { StakeChainType } from '@/cases/types';
import { _1INCH_NATIVE_TOKEN_ADDRESS } from '@/constants';

export type Token = {
  symbol: string;
  amount: string;
  address: Address;
  decimals: number;
  chainId: number;
};

/**
 * Generate Approves and Swap Tx
 *
 * @param {Object} options - The options for the transaction.
 * @param {StakeChainType} options.chain - The chain type.
 * @param {Address} options.address - The user's address.
 * @param {string} options.value - The value to swap.
 * @param {Token} options.selectedToken - The selected token to swap.
 * @param {Token} options.dstToken - The dst token to receive.
 * @returns {Promise<{ txs: Tx[], dstAmount: string }>} The transaction array contain approve & swap tx and the destination amount.
 */
const approveAndSwapTx = async ({
  chain,
  address,
  value,
  selectedToken,
  dstTokenAddress,
  dstTokenDecimals,
  dstTokenSymbol,
}: {
  chain: StakeChainType;
  address: Address;
  value: string;
  selectedToken: Token;
  dstTokenAddress: Address;
  dstTokenDecimals: number;
  dstTokenSymbol: string;
}) => {
  let approveTx: Tx | undefined;

  if (selectedToken.address !== _1INCH_NATIVE_TOKEN_ADDRESS) {
    approveTx = await approveERC20TxIfNeeded({
      chain: chain,
      userAddress: address,
      tokenAddress: selectedToken.address,
      tokenSymbol: selectedToken.symbol,
      tokenDecimals: selectedToken.decimals,
      spenderAddress: getOneInchAddress(chain.id),
      spenderName: '1inch',
      amount: parseUnits(value, selectedToken.decimals),
    });
  }

  const { dstAmount, tx: swappedTx } = await swapTx({
    chainId: chain.id,
    userAddress: address,
    srcTokenAddress: selectedToken.address,
    srcTokenSymbol: selectedToken.symbol,
    srcTokenDecimals: selectedToken.decimals,
    srcAmount: parseUnits(value, selectedToken.decimals),
    dstTokenAddress,
    dstTokenSymbol,
    dstTokenDecimals,
  });

  const txs: Tx[] = approveTx ? [approveTx, swappedTx] : [swappedTx];

  return { txs, dstAmount };
};

export default approveAndSwapTx;
