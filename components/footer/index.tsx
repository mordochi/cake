'use client';

import { Box, Flex, Grid } from '@chakra-ui/react';
import CopyRight from './components/CopyRight';
import FeedbackButton from './components/FeedbackButton';
import SocialMediaButtonGroup from './components/SocialMediaButtonGroup';

const Footer = ({ inDropdown = false }: { inDropdown?: boolean }) => {
  return (
    <Flex
      as="footer"
      height={{ base: 'auto', md: '39px' }}
      display={inDropdown ? 'flex' : { base: 'none', md: 'flex' }}
      borderTop="1px solid #111A47"
      bgColor="#0A0A0A"
      alignContent="center"
    >
      <Box
        padding={{ base: '24px 16px', md: '8px 40px' }}
        maxW="1440px"
        w="100%"
        m="auto"
      >
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{
            base: 'column-reverse',
            md: 'row',
          }}
          gap="24px"
        >
          <Flex alignItems="center">
            <CopyRight />
          </Flex>

          <Grid gap="9px" gridAutoFlow="column">
            <FeedbackButton />
            <SocialMediaButtonGroup />
          </Grid>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Footer;
