import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tagAnatomy.keys
);

const projectTagBaseStyle = {
  padding: '4px 8px',
  borderRadius: '16px',
  color: 'white',
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
};

const Tag = defineMultiStyleConfig({
  sizes: {
    s: {
      container: {
        padding: '4px 8px',
        borderRadius: '16px',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '16px',
        textAlign: 'center',
      },
    },
  },
  variants: {
    primary: {
      container: {
        bg: '#0420A7',
        ...projectTagBaseStyle,
      },
    },
    secondary: {
      container: {
        bg: '#E0E8FF1A',
        ...projectTagBaseStyle,
        fontSize: '12px',
        fontWeight: 700,
      },
      label: {
        lineHeight: '16px',
      },
    },
  },
});

export default Tag;
