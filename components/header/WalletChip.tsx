import * as amplitude from '@amplitude/analytics-browser';
import {
  Box,
  Button,
  Center,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { normalize } from 'viem/ens';
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi';
import useAutoConnect from '@/hooks/useAutoConnect';
import useTrackModalConnect from '@/hooks/useTrackableConnectModal';
import ChevronDownIcon from '@icons/chevron-down.svg';
import CopyIcon from '@icons/copy.svg';
import DisconnectIcon from '@icons/disconnect.svg';

const List = () => {
  const { address, chain, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const ensName = useEnsName({ address });
  const ensAvatar = useEnsAvatar({
    name: normalize(ensName?.data || ''),
  });
  const { onCopy, hasCopied } = useClipboard(address || '');
  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Address copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    }
  }, [hasCopied, toast]);

  useEffect(() => {
    if (address) {
      amplitude.setUserId(address);
      if (connector) {
        const identify = new amplitude.Identify();
        identify.setOnce('wallet', connector.id.toLowerCase());
        amplitude.identify(identify);
      }
    }
  }, [address, connector]);

  return (
    <MenuList>
      <MenuItem h="64px">
        <Image
          src={ensAvatar?.data || '/images/default-avatar.png'}
          alt="wallet"
          borderRadius="full"
          boxSize="20px"
        />
        <Box>
          <Box color="#757575" fontSize="12px" fontWeight="700">
            {chain?.name}
          </Box>

          <Center gap="10px">
            {!!address && `${address.slice(0, 6)}...${address.slice(-6)}`}
            <Box
              as={CopyIcon}
              boxSize="16px"
              color="#757575"
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
            />
          </Center>
        </Box>
      </MenuItem>
      <MenuDivider />
      <MenuItem
        background="none"
        color="#FF5151"
        onClick={() => {
          disconnect();
        }}
      >
        <DisconnectIcon />
        Disconnect
      </MenuItem>
    </MenuList>
  );
};

export const WalletChip = () => {
  const { address } = useAccount();
  const { connect } = useTrackModalConnect();
  const ensName = useEnsName({ address });
  const ensAvatar = useEnsAvatar({
    name: normalize(ensName?.data || ''),
  });
  useAutoConnect();

  return !!address ? (
    <Menu isLazy>
      <MenuButton
        as={Button}
        variant="secondary"
        size={{
          base: 's',
          md: 'm',
        }}
        w={{
          base: '52px',
          md: 'auto',
        }}
        onClick={() => {
          amplitude.track('navbar_click_account');
        }}
      >
        <Center gap="8px">
          <Image
            src={ensAvatar?.data || '/images/default-avatar.png'}
            alt="wallet"
            borderRadius="full"
            boxSize="16px"
          />
          <Box
            display={{
              base: 'none',
              md: 'block',
            }}
          >
            {address.slice(0, 6)}...{address.slice(-6)}
          </Box>
          <ChevronDownIcon />
        </Center>
      </MenuButton>
      <List />
    </Menu>
  ) : (
    <Button
      variant="primary"
      size={{
        base: 's',
        md: 'm',
      }}
      onClick={() => {
        amplitude.track('navbar_click_connect_wallet');
        connect();
      }}
    >
      Connect Wallet
    </Button>
  );
};
