import { Box, Center, Flex, Skeleton } from '@chakra-ui/react';
import OptimizerGraphic from '@icons/optimizer-graphic.svg';
import dynamic from 'next/dynamic';

const DynamicProceedButton = dynamic(() => import('./BannerButton'), {
  ssr: false,
  loading: () => <Skeleton height="40px" borderRadius="full" />,
});

const OptimizerPageBanner = () => {
  return (
    <Flex
      layerStyle="optimizerGradient"
      alignItems="center"
      alignContent="stretch"
      p={{ base: '80px 0 40px 0' }}
    >
      <Center flexDirection="column" textAlign="center" w="100%" h="100%">
        <Flex justifyContent="space-between" alignItems="center" gap="144px">
          <Flex flexDirection="column" gap="36px" alignItems="start">
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              alignItems="start"
              gap="16px"
            >
              <Box
                color="white"
                fontSize={{ base: '72px' }}
                fontWeight={600}
                lineHeight="72px"
                fontFamily="heading"
                textAlign="left"
              >
                Bento Optimizer
              </Box>
              <Box
                width="560px"
                color="white"
                fontSize={{ base: '36px' }}
                fontWeight={700}
                lineHeight="40px"
                fontFamily="body"
                textAlign="left"
              >
                Maximize Your DeFi Rewards
              </Box>
              <Box
                width="560px"
                color="white"
                fontSize={{ base: '24px' }}
                fontWeight={400}
                lineHeight="32px"
                fontFamily="body"
                textAlign="left"
              >
                Streamline your DeFi journey for free with Bento Optimizer.
                Discover top strategies and maximize your rewards — all in one
                place.
              </Box>
            </Flex>

            <DynamicProceedButton />
          </Flex>
          <Box as={OptimizerGraphic} />
        </Flex>
      </Center>
    </Flex>
  );
};

export default OptimizerPageBanner;
