'use client';

import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { Fade as Hamburger } from 'hamburger-react';
import Footer from '@/components/footer';
import { WalletChip } from '@/components/header/WalletChip';

const DESKTOP_HEADER_HEIGHT = '72px';
export const MOBILE_HEADER_HEIGHT = '52px';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PageLink = ({
  title,
  href,
  isCurrent,
  onClick,
}: {
  title: string;
  href: string;
  isCurrent: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    p={{
      base: '16px 0px',
      md: '8px 16px',
    }}
    color={isCurrent ? '#E5E8F7' : '#828282'}
    fontSize={{ base: '20px', md: '16px' }}
    fontWeight={700}
    lineHeight={{ base: '28px', md: '24px' }}
    onClick={() => {
      onClick?.();
    }}
  >
    {title}
  </Link>
);

export default function Header({}) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Box
        zIndex={isOpen ? 'modal' : 'banner'}
        position="fixed"
        width="100%"
        top="0"
        backgroundColor="borderColor"
      >
        <Flex
          top={0}
          pl={{ base: '20px', md: '30px' }}
          pr={{ base: '10px', md: '30px' }}
          alignItems="center"
          h={{
            base: MOBILE_HEADER_HEIGHT,
            md: DESKTOP_HEADER_HEIGHT,
          }}
          w="100%"
          justifyContent="space-between"
        >
          <Center mr={{ base: '0', sm: '20px' }} gap="16px">
            <Link href="/">
              <Image src="/logo.png" alt="Cake" h="60px" />
            </Link>
            <Center gap="8px" display={{ base: 'none', md: 'flex' }}></Center>
          </Center>

          <Center gap="8px">
            {!isOpen && <WalletChip />}
            <Box display={{ base: 'flex', md: 'none' }}>
              <Button variant="secondary" size="s" boxSize="28px">
                <Box>
                  <Hamburger
                    toggled={isOpen}
                    toggle={onToggle}
                    color="white"
                    size={12}
                    rounded
                  />
                </Box>
              </Button>
            </Box>
          </Center>

          {/* Dropdown menu on mobile */}
          <Collapse
            in={isOpen}
            style={{
              backgroundColor: 'black',
              position: 'absolute',
              top: MOBILE_HEADER_HEIGHT,
              left: 0,
              width: '100%',
            }}
          >
            <Box
              zIndex="overlay"
              height={`calc(100vh - ${MOBILE_HEADER_HEIGHT})`}
              boxShadow="0px 4px 8px rgba(0, 0, 0, 0.05)"
            >
              <Flex
                height="100%"
                flexDirection="column"
                justifyContent="space-between"
                pt="52px"
              >
                <Flex
                  flexDirection="column"
                  px="32px"
                  sx={{ '> *': { borderBottom: '1px solid #22242B' } }}
                ></Flex>

                <Footer inDropdown />
              </Flex>
            </Box>
          </Collapse>
        </Flex>
      </Box>

      <Box
        h={{
          base: MOBILE_HEADER_HEIGHT,
          md: DESKTOP_HEADER_HEIGHT,
        }}
      />
    </>
  );
}
