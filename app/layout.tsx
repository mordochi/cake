import { Box } from '@chakra-ui/react';
import { Suspense } from 'react';
// import Footer from '@/components/footer';
// import Header from '@/components/header';
import getContentfulInfo from '@/services/contentful/getContentfulInfo';
import { apiFetcher } from '@/utils/fetcher';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [contentfulData, caseParticipantsData] = await Promise.all([
    getContentfulInfo(),
    apiFetcher(
      '/caseStats?order_by=unique_address_count&is_desc=true'
    ) as Promise<Parameters<typeof Providers>[0]['caseStatsData']>,
  ]);
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <Providers
          contentfulData={contentfulData}
          caseStatsData={caseParticipantsData}
        >
          {/* <Header /> */}
          <Box minH="calc(100vh - 130px)">
            <Suspense>
              <Box mx="auto" minH="calc(100vh - 130px)">
                {children}
              </Box>
            </Suspense>
          </Box>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
