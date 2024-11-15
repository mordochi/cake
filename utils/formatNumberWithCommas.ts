export function formatNumberWithCommas(
  number: number,
  locales: string = 'en-US'
): string {
  const formatter = new Intl.NumberFormat(locales, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
}
