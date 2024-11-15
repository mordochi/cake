'use client';

import { init } from '@amplitude/analytics-browser';
import { ChakraProvider } from '@chakra-ui/react';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { CaseStatsProvider } from '@/context/caseStatsContext';
import { ContentfulProvider } from '@/context/contentfulContext';
import { theme, toastOptions } from '@/utils/theme';
import { config } from '@/utils/wagmi';

export function Providers({
  children,
  contentfulData,
  caseStatsData,
}: {
  children: React.ReactNode;
  contentfulData: Parameters<typeof ContentfulProvider>[0]['data'];
  caseStatsData: Parameters<typeof CaseStatsProvider>[0]['data'];
}) {
  useEffect(() => {
    init(process?.env?.NEXT_PUBLIC_AMPLITUDE_API_KEY || '', {
      defaultTracking: true,
      identityStorage: 'localStorage',
    });
  }, []);

  return (
    <ContentfulProvider data={contentfulData}>
      <CaseStatsProvider data={caseStatsData}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={new QueryClient()}>
            <RainbowKitProvider
              theme={darkTheme()}
              modalSize="compact"
              appInfo={{
                appName: 'Cake Stake',
              }}
            >
              <ChakraProvider theme={theme} toastOptions={toastOptions}>
                {children}
              </ChakraProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </CaseStatsProvider>
    </ContentfulProvider>
  );
}
