import { Button, Center, Flex, Text } from '@chakra-ui/react';
import CryptoIcon from '../CryptoIcon';
import { chainId2name } from './types';

const ChainButton = ({
  chainId,
  chainAsset,
  percentage,
  bgColor,
  onSwitchChain,
  isSelected,
}: {
  chainId: number;
  chainAsset: number;
  percentage: number;
  bgColor: string;
  onSwitchChain: (chainId: number) => Promise<void>;
  isSelected: boolean;
}) => {
  return (
    <Button
      bg={bgColor}
      borderRadius="32px"
      p={2}
      pr={4}
      mr="16px"
      display="flex"
      alignItems="center"
      _hover={{ bg: '#3C3D43' }}
      onClick={async () => {
        await onSwitchChain(chainId);
      }}
    >
      <Flex align="center" mr={2}>
        <CryptoIcon currency={chainId2name(chainId)} size="32px" mr="8px" />
      </Flex>
      <Flex direction="column">
        <Text
          color={isSelected ? 'dark' : 'white'}
          textAlign="left"
          fontWeight="700"
          fontFamily="silkscreen"
        >
          {chainId2name(chainId)}
        </Text>
        <Flex mt={1} gap="8px">
          <Text
            fontSize="14px"
            fontWeight="bold"
            color={isSelected ? 'dark' : 'white'}
          >
            ${chainAsset.toFixed(2)}
          </Text>
          <Text fontSize="14px" color="gray.600">
            {percentage.toFixed(0)}%
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
};

export const ChainButtonList = ({
  selectedChainId,
  chainAssets,
  totalAssets,
  onSwitchChain,
}: {
  selectedChainId: number | undefined;
  chainAssets: { [key: number]: number };
  totalAssets: number;
  onSwitchChain: (chainId: number) => Promise<void>;
}) => {
  return (
    <Center display={{ base: 'none', md: 'flex' }} mt="24px">
      {Object.entries(chainAssets)
        .sort((a, b) => b[1] - a[1])
        .map(([chainId, chainUsdValue]) => {
          const ethereumPercentage = chainUsdValue
            ? ((chainUsdValue / totalAssets) * 100).toFixed(0)
            : '0';
          const bgColor =
            Number(chainId) === selectedChainId
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(255, 175, 179, 0.7)';
          return (
            <ChainButton
              key={chainId}
              chainId={Number(chainId)}
              chainAsset={Number(chainUsdValue || 0)}
              percentage={Number(ethereumPercentage)}
              bgColor={bgColor}
              onSwitchChain={onSwitchChain}
              isSelected={Number(chainId) === selectedChainId}
            />
          );
        })}
    </Center>
  );
};
