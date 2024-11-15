import { ToastPosition, extendTheme } from '@chakra-ui/react';
import * as Fonts from './fonts';
import colors from './themeHelper/colors';
import Table from './themeHelper/table';
import Tag from './themeHelper/tag';

export const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts: {
    heading: `${Fonts.Satoshi.style.fontFamily}, sans-serif`,
    body: `${Fonts.Satoshi.style.fontFamily}, sans-serif`,
  },
  layerStyles: {
    customBanner: {
      bg: `radial-gradient(circle 800px at -5% 0%, rgba(13, 50, 226, 0.4), transparent),
      radial-gradient(circle 500px at -200px 100%, rgba(246, 123, 232, 0.4), transparent),
      radial-gradient(circle 800px at 110% 0%, rgba(22, 201, 156, 0.4), transparent)`,
    },
    mainGradient: {
      bg: {
        base: `radial-gradient(circle 285px at -44% 0, rgba(22, 201, 156, 0.3) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 75px at -5% 115%, rgba(183, 220, 19, 0.1) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 421px at 69% -29%, rgba(13, 50, 226, 0.4) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 90px at 33% 59%, rgba(246, 123, 232, 0.1) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)`,
        md: `radial-gradient(circle 660px at -2% 149%, rgba(22, 201, 156, 0.2) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 195px at 17% 110%, rgba(183, 220, 19, 0.1) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 251px at 86% 110%, rgba(246, 123, 232, 0.2) 0%, rgba(0, 0, 0, 0) 100%),
        radial-gradient(circle 589px at 87% 31%, rgba(13, 50, 226, 0.4) 0%, rgba(0, 0, 0, 0) 100%),
  radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)`,
      },
    },
  },
  colors,
  styles: {
    global: {
      html: {
        bg: '#0A0A0A',
      },
      body: {
        bg: '#0A0A0A',
        color: 'white',
        overflowX: 'hidden',
      },
    },
  },
  components: {
    Input: {
      baseStyle: {
        field: {
          _placeholder: {
            color: '#757575',
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: '#1A1B1F',
          color: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #404040',
          padding: '0',
        },
        item: {
          bg: '#22242B',
          height: '48px',
          gap: '8px',
        },
        divider: {
          my: '0',
        },
      },
    },
    Link: {
      baseStyle: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight: 400,
        fontSize: '14px',
        padding: '10px 16px',
        wordBreak: 'break-word',
        overflowBreak: 'break-word',
        whiteSpace: 'normal',
      },
      defaultProps: {
        size: 'm',
        variant: 'primary',
      },
      sizes: {
        l: {
          fontSize: '20px',
          padding: '8px 16px',
        },
        m: {
          fontSize: '14px',
          padding: '10px 16px',
        },
        s: {
          h: '28px',
          fontSize: '14px',
          padding: '4px 8px',
        },
        xs: {
          whiteSpace: 'nowrap',
          h: '20px',
          fontSize: '12px',
          padding: '2px 8px',
        },
      },
      variants: {
        primary: {
          bg: '#2B50FF',
          color: 'white',
          _hover: {
            bg: '#0420A7',
            _disabled: {
              color: '#757575',
              bg: '#333333',
            },
          },
          _disabled: {
            opacity: 1,
            color: '#757575',
            bg: '#333333',
          },
        },
        primaryHighlighted: {
          bg: '#2B50FF',
          color: 'white',
          backgroundImage:
            'linear-gradient(#2B50FF, #2B50FF), linear-gradient(175deg, #F67BE8, #1239F0) 30%',
          border: '1.5px solid transparent',
          backgroundClip: 'content-box, border-box',
          backgroundOrigin: 'border-box',

          _hover: {
            bg: '#0420A7',
            backgroundImage:
              'linear-gradient(#0420A7, #0420A7), linear-gradient(175deg, #F67BE8, #1239F0) 30%',
            border: '1.5px solid transparent',
            backgroundClip: 'content-box, border-box',
            backgroundOrigin: 'border-box',
            _disabled: {
              color: '#757575',
              bg: '#333333',
              backgroundImage: 'none',
            },
          },
          _disabled: {
            opacity: 1,
            color: '#757575',
            bg: '#333333',
            borderColor: '#333333',
            backgroundImage: 'none',
          },
        },
        'primaryHighlighted-dark': {
          color: 'white',
          backgroundImage:
            'linear-gradient(#22242B, #22242B), linear-gradient(175deg, #F67BE8, #1239F0) 30%',
          border: '1.5px solid transparent',
          backgroundClip: 'content-box, border-box',
          backgroundOrigin: 'border-box',

          _hover: {
            backgroundImage:
              'linear-gradient(#22242B, #22242B), linear-gradient(175deg, #F67BE8, #1239F0) 30%',
            border: '1.5px solid transparent',
            backgroundClip: 'content-box, border-box',
            backgroundOrigin: 'border-box',
            _disabled: {
              color: '#757575',
              bg: '#333333',
              backgroundImage: 'none',
            },
          },
          _disabled: {
            opacity: 1,
            color: '#757575',
            bg: '#333333',
            borderColor: '#333333',
            backgroundImage: 'none',
          },
        },
        secondary: {
          bg: 'rgba(224, 232, 255, 0.2)',
          color: 'white',
          _hover: {
            bg: 'rgba(224, 232, 255, 0.1)',
            _disabled: {
              color: '#757575',
              bg: 'rgba(224, 232, 255, 0.1)',
            },
          },
          _disabled: {
            opacity: 1,
            color: '#757575',
            bg: 'rgba(224, 232, 255, 0.05)',
          },
        },
        outline: {
          bg: 'transparent',
          color: '#757575',
          borderColor: '#757575',
          _hover: {
            bg: 'transparent',
            color: '#6B85FF',
            borderColor: '#6B85FF',
            _disabled: {
              color: '#313131',
              borderColor: '#313131',
              bg: 'transparent',
            },
          },
          _active: {
            bg: 'transparent',
            color: '#6B85FF',
            borderColor: '#6B85FF',
          },
          _focus: {
            borderColor: '#404040',
            bg: 'rgba(224, 232, 255, 0.20)',
          },
          _disabled: {
            opacity: 1,
            color: '#313131',
            bg: 'transparent',
            borderColor: '#313131',
          },
        },
        // TODO: enhance the color
        'outline-red': {
          bg: 'transparent',
          color: '#FF5151',
          borderColor: '#FF5151',
          _hover: {
            bg: 'transparent',
            color: '#FF5151',
            borderColor: '#FF5151',
            _disabled: {
              color: '#313131',
              borderColor: '#313131',
              bg: 'transparent',
            },
          },
          _active: {
            bg: 'transparent',
            color: '#FF5151',
            borderColor: '#FF5151',
          },
          _focus: {
            borderColor: '#FF5151',
            bg: 'rgba(224, 232, 255, 0.20)',
          },
          _disabled: {
            opacity: 1,
            color: '#313131',
            bg: 'transparent',
            borderColor: '#313131',
          },
        },
        tagStyle: {
          p: '4px 8px',
          h: '28px',
          bg: '#E0E8FF1A',
          color: 'white',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          _active: {
            bg: '#2B50FF',
          },
          '@media not all and (hover: none)': {
            _hover: {
              bg: '#2B50FF',
            },
          },
        },
        plain: { padding: '0' },
        greenOutLine: {
          bg: 'transparent',
          color: '#ffffff',
          border: '1px solid',
          borderColor: '#1ADEAD',
          borderRadius: '8px',
          _disabled: {
            opacity: 1,
            borderColor: '#026F54',
          },
          '@media not all and (hover: none)': {
            _hover: {
              borderColor: '#026F54',
            },
          },
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          border: '1px solid',
          borderColor: '#404040',
          borderRadius: '4px',
          width: '20px',
          height: '20px',
        },
      },
      defaultProps: {
        colorScheme: 'bentoBlue',
      },
    },
    Tag,
    Table,
    Switch: {
      baseStyle: {
        track: {
          bg: 'rgba(66, 74, 102, 1)',
          _checked: {
            bg: 'rgba(43, 80, 255, 1)',
          },
        },
      },
    },
  },
  semanticTokens: {
    colors: {
      gray: {
        default: 'gray.800',
        _dark: 'gray.200',
      },
      // @todo: Comment out until confirmed not conflicting with existing styles
      // primary: {
      //   default: 'primary.500',
      //   _dark: 'primary.400',
      // },
      background: {
        default: 'background.500',
        _dark: 'background.900',
      },
      green: {
        default: 'green.500',
        _dark: 'green.400',
      },
      violet: {
        default: 'violet.500',
        _dark: 'violet.400',
      },
      lime: {
        default: 'lime.500',
        _dark: 'lime.400',
      },
      alert: {
        default: 'alert.500',
        _dark: 'alert.400',
      },
      warning: {
        default: 'warning.500',
        _dark: 'warning.400',
      },
    },
  },
});

export const toastOptions = {
  defaultOptions: { position: 'top-right' as ToastPosition },
};

export default theme;
