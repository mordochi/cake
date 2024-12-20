'use client';

import { Box, Flex, Grid, Link } from '@chakra-ui/react';
import CopyRight from './components/CopyRight';
import SocialMediaButtonGroup from './components/SocialMediaButtonGroup';

const Footer = ({ inDropdown = false }: { inDropdown?: boolean }) => {
  return (
    <Flex
      as="footer"
      height={{ base: 'auto', md: '39px' }}
      display={inDropdown ? 'flex' : { base: 'none', md: 'flex' }}
      borderTop="1px solid #111A47"
      borderColor="dark"
      bgColor="primary"
      alignContent="center"
      color="dark"
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
            <SocialMediaButtonGroup />
          </Grid>

          <Grid gap="9px" gridAutoFlow="column">
            <Link
              target="_blank"
              href="https://eth.blockscout.com/address/0xc59E9A8432657dcB5afD6f1682216F2CDDE66954?tab=contract"
            >
              ERC-7702 Smart Contract
            </Link>
          </Grid>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Footer;
