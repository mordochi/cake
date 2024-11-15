const formatDecimalNumber = (value: number, decimals: number) => {
  return value.toLocaleString(
    (typeof window !== 'undefined' &&
      navigator?.languages &&
      navigator.languages[0]) ||
      (typeof window !== 'undefined' && navigator?.language) ||
      'en-US',
    { maximumFractionDigits: decimals }
  );
};

export default formatDecimalNumber;
