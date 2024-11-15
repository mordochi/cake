import * as CurrencyIcon from '@chakra-icons/cryptocurrency-icons';
import { Center, ChakraProps } from '@chakra-ui/react';
import { ReactNode } from 'react';
import CustomIcons from './customIcon';

// NOTE: Since the name of a Chain may be different from the corresponding CurrencyIcon name,
// it is necessary to maintain this Map setting.
const netWorkIdMap: Record<string, string> = {
  Ethereum: 'Eth',
  Polygon: 'Pol',
  Avalanche: 'Avax',
  'Arbitrum One': 'Arbitrum',
  'BNB Smart Chain': 'Bsc',
  'OP Mainnet': 'Optimism',
};

export default function CryptoIcon({
  currency,
  addOn,
  size = '18px',
  ...rest
}: {
  currency: string;
  size?: string;
  addOn?: ReactNode;
} & ChakraProps) {
  if (!currency) return null;
  const normalizedCurrency = netWorkIdMap[currency] || currency;
  const normalizedIconName = (normalizedCurrency[0].toUpperCase() +
    normalizedCurrency.slice(1).toLowerCase()) as keyof typeof CustomIcons &
    keyof typeof CurrencyIcon;

  const IconComponent =
    CustomIcons[normalizedIconName] || CurrencyIcon[normalizedIconName];

  const CryptoIconComponent = IconComponent ? (
    <IconComponent boxSize={size} {...rest} />
  ) : (
    <Center
      as="span"
      boxSize={size}
      borderRadius="full"
      bg="white"
      color="black"
      fontSize="45%"
      {...rest}
    >
      {currency[0].toUpperCase()}
    </Center>
  );

  return addOn ? (
    <Center pos="relative">
      {CryptoIconComponent}
      {addOn}
    </Center>
  ) : (
    CryptoIconComponent
  );
}
