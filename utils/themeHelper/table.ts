import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tableAnatomy.keys
);

const tableTheme = defineMultiStyleConfig({
  defaultProps: {
    variant: 'unstyled',
  },
  variants: {
    unstyled: {
      th: {
        textTransform: 'none',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        color: '#757575',
        textAlign: 'left',
        paddingInlineStart: '14px',
        paddingInlineEnd: '14px',
        paddingLeft: '5px',
        paddingRight: '14px',
        _first: {
          paddingInlineStart: '14px',
          paddingLeft: '14px',
        },
      },
      tbody: {
        boxShadow: '0 0 0 1px #404040',
        borderRadius: '16px',
        overflow: 'hidden',
      },
      tr: {
        '+ tr': {
          borderTop: '1px solid #404040',
        },
      },
      td: {
        verticalAlign: 'top',
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
        paddingInlineStart: '6px',
        paddingLeft: '6px',
        paddingInlineEnd: '6px',
        paddingRight: '6px',
        [':first-of-type']: {
          paddingInlineStart: '14px',
          paddingLeft: '14px',
        },
        [':last-of-type']: {
          paddingInlineEnd: '14px',
          paddingRight: '14px',
        },
      },
    },
    rounded: {
      table: {
        bg: '#22242B',
        borderRadius: '8px',
      },
      th: {
        textTransform: 'none',
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: '400',
        color: '#757575',
        textAlign: 'left',
        paddingInlineStart: '14px',
        paddingInlineEnd: '14px',
        paddingLeft: '5px',
        paddingRight: '14px',
        _first: {
          paddingInlineStart: '14px',
          paddingLeft: '14px',
        },
      },
      tbody: {
        borderRadius: '16px',
        tr: {
          _hover: {
            bg: '#2A2D3A',
            cursor: 'pointer',
            borderColor: '#2A2D3A',
          },
        },
      },

      td: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '400',
        paddingInlineStart: '6px',
        paddingLeft: '6px',
        paddingInlineEnd: '6px',
        paddingRight: '6px',
        [':first-of-type']: {
          paddingInlineStart: '14px',
          paddingLeft: '14px',
        },
        [':last-of-type']: {
          paddingInlineEnd: '14px',
          paddingRight: '14px',
        },
      },
    },
  },
});

export default tableTheme;
