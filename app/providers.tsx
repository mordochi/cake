'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { theme, toastOptions } from '@/utils/theme';
import { config } from '@/utils/wagmi';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider
          theme={darkTheme()}
          modalSize="compact"
          appInfo={{
            appName: 'Cake',
          }}
        >
          <ChakraProvider theme={theme} toastOptions={toastOptions}>
            {children}
          </ChakraProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
