'use client';

import { Button } from '@chakra-ui/react';
import useTrackModalConnect from '@/hooks/useTrackableConnectModal';
import useConnector from '../../hooks/useConnector';

const BannerButton = () => {
  const { isConnected } = useConnector();
  const { connect } = useTrackModalConnect();
  return (
    <>
      {!isConnected && (
        <Button
          variant="primary"
          size={{
            base: 's',
            md: 'm',
          }}
          onClick={() => {
            connect();
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default BannerButton;
