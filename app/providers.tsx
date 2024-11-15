'use client';

import { ChakraProvider } from '@chakra-ui/react';
// import { CaseStatsProvider } from '@/context/caseStatsContext';
// import { ContentfulProvider } from '@/context/contentfulContext';
import { theme, toastOptions } from '@/utils/theme';

export function Providers({
  children,
  //   contentfulData,
  //   caseStatsData,
}: {
  children: React.ReactNode;
  //   contentfulData: Parameters<typeof ContentfulProvider>[0]['data'];
  //   caseStatsData: Parameters<typeof CaseStatsProvider>[0]['data'];
}) {
  return (
    // <ContentfulProvider data={contentfulData}>
    //   <CaseStatsProvider data={caseStatsData}>
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      {children}
    </ChakraProvider>
    //   </CaseStatsProvider>
    // </ContentfulProvider>
  );
}
