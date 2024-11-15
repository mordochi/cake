import * as amplitude from '@amplitude/analytics-browser';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import CryptoIcon from '../CryptoIcon';
import { chainId2name } from './types';

const ChainButton = ({
  chainId,
  chainAsset,
  percentage,
  bgColor,
  onSwitchChain,
}: {
  chainId: number;
  chainAsset: number;
  percentage: number;
  bgColor: string;
  onSwitchChain: (chainId: number) => Promise<void>;
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
        amplitude.track('optimizer_click_chain_tab', {
          chain: chainId2name(chainId).toLowerCase(),
          total_usd_value: chainAsset,
        });
      }}
    >
      <Flex align="center" mr={2}>
        <CryptoIcon currency={chainId2name(chainId)} size="32px" mr="8px" />
      </Flex>
      <Flex direction="column">
        <Text color="gray.300" textAlign="left">
          {chainId2name(chainId)}
        </Text>
        <Flex mt={1} gap="8px">
          <Text fontSize="14px" fontWeight="bold">
            ${chainAsset.toFixed(2)}
          </Text>
          <Text fontSize="14px" color="gray.300">
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
      {Object.entries(chainAssets).map(([chainId, chainUsdValue]) => {
        const ethereumPercentage = chainUsdValue
          ? ((chainUsdValue / totalAssets) * 100).toFixed(0)
          : '0';
        const bgColor =
          Number(chainId) === selectedChainId ? '#44454a' : '#22242B';
        return (
          <ChainButton
            key={chainId}
            chainId={Number(chainId)}
            chainAsset={Number(chainUsdValue || 0)}
            percentage={Number(ethereumPercentage)}
            bgColor={bgColor}
            onSwitchChain={onSwitchChain}
          />
        );
      })}
    </Center>
  );
};
