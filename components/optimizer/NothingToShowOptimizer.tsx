import { Box, Center, Text } from '@chakra-ui/react';
import NothingToShowIcon from '@icons/nothing-to-show.svg';

const NothingToShowOptimizer = ({
  title = 'Nothing to show yet',
  description = 'Introduce you the most awesome Batch Trading Strategies!',
}: {
  title?: string;
  description?: string;
  buttonText?: string;
}) => {
  return (
    <Center flexDirection="column" py={{ base: '46px', md: '56px' }} gap="20px">
      <Box as={NothingToShowIcon} />

      <Center flexDirection="column" textAlign="center">
        <Text mb="8px" fontSize="24px" lineHeight="28px" fontWeight="700">
          {title}
        </Text>
        <Text>{description}</Text>
      </Center>
    </Center>
  );
};

export default NothingToShowOptimizer;
