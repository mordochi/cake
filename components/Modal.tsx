import { track } from '@amplitude/analytics-browser';
import { Link } from '@chakra-ui/next-js';
import {
  Box,
  Button,
  Center,
  Modal as ChakraModal,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ReactElement, ReactNode, isValidElement, useEffect } from 'react';
import PendingIcon from '@icons/pending.svg';
import SuccessfulIcon from '@icons/token-check.svg';
import ErrorIcon from '@icons/token-cross.svg';
import TokenIcon from '@icons/token.svg';

const predefinedIcons = {
  success: SuccessfulIcon,
  error: ErrorIcon,
  pending: PendingIcon,
  token: TokenIcon,
} as const;

type PredefinedIconType = keyof typeof predefinedIcons;

export interface IModalProps {
  isOpen: boolean;
  icon?: PredefinedIconType | ReactElement;
  title: string;
  description?: string;
  list?: { key: string; value: number | string }[];
  onClose?: () => void;
  buttonText?: string;
  onButtonClick?: (onClose?: () => void) => void;
  redirectInfo?: { link: string; isExternal?: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayEvent?: { eventName: string; eventProperties?: Record<string, any> };
  customBody?: ReactNode;
  isButtonDisabled?: boolean;
  closeOnOverlayClick?: boolean;
}

export const DEFAULT_MODAL_STATE: IModalProps = {
  isOpen: false,
  title: '',
};

export default function Modal({
  isOpen,
  icon = 'success',
  title,
  description,
  list,
  onClose,
  buttonText,
  onButtonClick,
  redirectInfo,
  displayEvent,
  customBody,
  isButtonDisabled,
  closeOnOverlayClick = true,
}: IModalProps) {
  useEffect(() => {
    if (isOpen && displayEvent) {
      track(displayEvent.eventName, displayEvent.eventProperties);
    }
  }, [isOpen, displayEvent]);
  const handleButtonClick = onButtonClick
    ? () => onButtonClick(onClose)
    : onClose;

  const renderIcon = () => {
    if (isValidElement(icon)) {
      return icon;
    }
    const defaultIcon = predefinedIcons['success'];
    const IconComponent =
      typeof icon === 'string' && predefinedIcons.hasOwnProperty(icon)
        ? predefinedIcons[icon]
        : defaultIcon;
    return <IconComponent />;
  };

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      isCentered
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay />
      <ModalContent bg="#22242B" borderRadius="24px" p="0" m="16px">
        {onClose ? (
          <ModalCloseButton
            top="16px"
            right="16px"
            width="24px"
            height="24px"
            _focusVisible={{}}
            sx={{
              svg: { width: '14px', height: '14px', path: { fill: '#757575' } },
            }}
          />
        ) : null}

        <ModalBody
          borderBottom={buttonText ? '1px solid #404040' : undefined}
          p={
            onClose
              ? 'calc(16px + 24px + 20px) 16px 40px'
              : 'calc(16px + 24px + 16px) 16px 40px'
          } // padding top equals to outer padding + button height + inner padding
        >
          <Center
            flexDir="column"
            gap="20px"
            justifyContent="center"
            textAlign="center"
          >
            {renderIcon()}
            <Heading as="h4" fontSize="24px" fontWeight="700" lineHeight="32px">
              {title}
            </Heading>
            {description ? (
              <Text
                fontSize="16px"
                wordBreak="break-word"
                overflowWrap="break-word"
              >
                {description}
              </Text>
            ) : null}
            {list ? (
              <Box width="100%">
                {list?.map((item) => (
                  <Flex
                    key={item.key}
                    justifyContent="space-between"
                    mb="8px"
                    _last={{ mb: '0' }}
                  >
                    <Text>{item.key}</Text>
                    <Text>{item.value}</Text>
                  </Flex>
                ))}
              </Box>
            ) : null}
            {customBody ? customBody : null}
          </Center>
        </ModalBody>

        <ModalFooter
          p={{
            base: buttonText ? '12px 16px' : '20px',
            md: buttonText ? '24px 16px' : '20px',
          }}
        >
          {buttonText ? (
            redirectInfo ? (
              <Button
                width="100%"
                isDisabled={isButtonDisabled}
                as={Link}
                href={redirectInfo.link}
                isExternal={redirectInfo.isExternal}
                p="8px 16px"
                onClick={handleButtonClick}
              >
                {buttonText}
              </Button>
            ) : (
              <Button
                width="100%"
                p="8px 16px"
                lineHeight="20px"
                isDisabled={isButtonDisabled}
                onClick={handleButtonClick}
              >
                {buttonText}
              </Button>
            )
          ) : null}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
