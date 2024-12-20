import { Box } from '@chakra-ui/react';
import { Suspense } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Providers } from './providers';
import '@rainbow-me/rainbowkit/styles.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <title>Cake</title>
      </head>
      <body>
        <Providers>
          <Header />
          <Box minH="calc(100vh - 130px)">
            <Suspense>
              <Box mx="auto" minH="calc(100vh - 130px)">
                {children}
              </Box>
            </Suspense>
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
