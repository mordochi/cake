'use client';
import {
  Box,
  BoxProps,
  Tooltip,
  TooltipProps,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useOutsideClick } from '@chakra-ui/react';
import { useCallback, useRef, useState } from 'react';

const ClickableTooltip = ({
  children,
  containerProps = {},
  ...props
}: TooltipProps & { containerProps?: BoxProps }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const rwdIsOpen = useBreakpointValue(
    { base: isOpen, lg: undefined },
    { fallback: 'lg' }
  );

  const close = useCallback(() => setIsOpen(false), []);

  useOutsideClick({ ref, handler: close });

  return (
    <Box
      ref={ref}
      onClick={() => setIsOpen((prev) => !prev)}
      {...containerProps}
    >
      <Tooltip
        isOpen={rwdIsOpen}
        bg="#0A0A0A"
        fontSize="12px"
        fontWeight="400"
        lineHeight="16px"
        p="8px 12px"
        borderRadius="8px"
        {...props}
      >
        {children}
      </Tooltip>
    </Box>
  );
};

export default ClickableTooltip;
