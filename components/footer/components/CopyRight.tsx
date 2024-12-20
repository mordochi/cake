'use client';

import { Text } from '@chakra-ui/react';
import { dayjs } from '@/utils/dayjs';

const CopyRight = () => {
  return (
    <Text fontSize="12px" lineHeight="16px" fontWeight={400}>
      © {dayjs().year()} Cake
    </Text>
  );
};

export default CopyRight;
