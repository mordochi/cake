/**
 * Formats an amount to a specified number of decimal places.
 *
 * @param {string} amount - The amount to format.
 * @param {number} [fixed=6] - The number of decimal places to keep, defaults to 6.
 * @returns {string} The formatted amount.
 */
const formatAmount = (amount: string, fixed: number = 6): string => {
  // Check if the input is a valid number
  if (!/^-?\d*\.?\d+$/.test(amount)) {
    return amount;
  }

  // Split the amount into integer and decimal parts
  const [integerPart, decimalPart = ''] = amount.split('.');

  // Process the decimal part
  let formattedDecimal = decimalPart.slice(0, fixed);

  // Remove trailing zeros
  formattedDecimal = formattedDecimal.replace(/0+$/, '');

  // If the formatted decimal part is empty and the original decimal part was longer than fixed,
  // return the integer part with '.' followed by 'fixed' number of zeros
  if (formattedDecimal === '' && decimalPart.length > fixed) {
    return `${integerPart}.${'0'.repeat(fixed)}`;
  }

  // If the formatted decimal part is not empty, return with decimal point
  if (formattedDecimal !== '') {
    return `${integerPart}.${formattedDecimal}`;
  }

  // Otherwise, return only the integer part
  return integerPart;
};

export default formatAmount;
