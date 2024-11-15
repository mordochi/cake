export function calculatePercentage(
  idHashValue: bigint,
  totalBigInt: bigint,
  decimals: number = 2
): string {
  const scaleFactor = 10n ** BigInt(decimals + 2);
  const scaledNumerator = idHashValue * scaleFactor * 100n;

  const quotient = scaledNumerator / totalBigInt / 100n;

  const percentageString = quotient.toString();
  const integerPart = percentageString.slice(0, -decimals) || '0';
  const fractionalPart = percentageString
    .slice(-decimals)
    .padStart(decimals, '0');

  return `${integerPart}.${fractionalPart}`;
}
