import localFont from 'next/font/local';

export const Satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-VariableItalic.woff2',
      weight: '300 900',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
});

export const ClashDisplay = localFont({
  src: '../public/fonts/clashDisplay/ClashDisplay-Variable.woff2',
});
