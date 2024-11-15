import { track } from '@amplitude/analytics-browser';
import {
  Box,
  Button,
  Center,
  Modal as ChakraModal,
  Checkbox,
  Divider,
  Flex,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type FeedbackItem = {
  key: string;
  value: string;
};

export const FEEDBACK_HELPFUL_LIST: FeedbackItem[] = [
  { key: '0', value: 'Life saver' },
  { key: '1', value: 'Found a better deal' },
  { key: '2', value: 'The UI is comprehensive' },
  { key: '3', value: 'It is convenient' },
];

export const FEEDBACK_UNHELPFUL_LIST: FeedbackItem[] = [
  { key: '0', value: 'Not enough chains' },
  { key: '1', value: 'The website is slow' },
  { key: '2', value: 'The website looks scammy' },
  { key: '3', value: 'Lack of defi options' },
  { key: '4', value: 'The UI is not intuitive' },
  { key: '5', value: 'No cross chain support' },
  { key: '6', value: `I don't trust this website` },
];

export enum FeedbackType {
  GOOD = 'good',
  BAD = 'bad',
}

export interface IFeedbackModalProps {
  isOpen: boolean;
  type: FeedbackType;
  onClose: () => void;
  displayEvent?: { eventName: string; eventProperties?: Record<string, any> };
}

export const DEFAULT_FEEDBACK_MODAL_STATE: IFeedbackModalProps = {
  isOpen: false,
  type: FeedbackType.BAD,
  onClose: () => {},
};

export default function FeedbackModal({
  isOpen,
  type,
  onClose,
  displayEvent,
}: IFeedbackModalProps) {
  const [value, setValue] = useState('');
  const [checkedItems, setCheckedItems] = useState<FeedbackItem[]>([]);

  const isButtonDisabled = checkedItems.length === 0 && value.length === 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
  };
  useEffect(() => {
    if (isOpen && displayEvent) {
      track(displayEvent.eventName, displayEvent.eventProperties);
    }
  }, [isOpen, displayEvent]);

  const innerOnClose = () => {
    setValue('');
    setCheckedItems([]);
    onClose();
  };

  const handleButtonClick = () => {
    innerOnClose();
    track('optimizer_send_feedback', {
      type: type === FeedbackType.GOOD ? 'success' : 'failed',
      reasons: checkedItems.map((item) => item.value.toLowerCase()),
      feedback: value,
    });
  };

  const list =
    type == FeedbackType.GOOD ? FEEDBACK_HELPFUL_LIST : FEEDBACK_UNHELPFUL_LIST;

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={innerOnClose}
      isCentered
      closeOnOverlayClick={true}
    >
      <ModalOverlay />
      <ModalContent bg="#22242B" borderRadius="24px" p="0px" m="0px">
        <ModalBody borderBottom="1px solid #404040" paddingTop="16px">
          <Center
            flexDir="column"
            gap="16px"
            justifyContent="center"
            textAlign="center"
            p="20px 16px"
          >
            <Box display="flex" flexDir="column" gap="4px">
              <Heading
                as="h4"
                fontSize="24px"
                fontWeight="700"
                lineHeight="32px"
              >
                Feedback
              </Heading>
              <Text
                fontSize="16px"
                wordBreak="break-word"
                overflowWrap="break-word"
              >
                {type === 'bad'
                  ? 'Tell us why it doesn’t help.'
                  : 'Tell us why it helps.'}
              </Text>
            </Box>
            <Flex width="100%" flexWrap="wrap" columnGap="16px" rowGap="8px">
              {list.map((item) => (
                <Flex
                  key={item.key}
                  justifyContent="space-between"
                  alignItems="center"
                  gap="12px"
                >
                  <Checkbox
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCheckedItems((prev) => {
                        if (e.target.checked) {
                          return [...prev, item];
                        } else {
                          return prev.filter((i) => i.key !== item.key);
                        }
                      })
                    }
                  />
                  <Text>{item.value}</Text>
                </Flex>
              ))}
            </Flex>
          </Center>
        </ModalBody>
        <Divider borderColor="#404040" borderWidth="0.1px" />
        <ModalBody borderBottom="1px solid #404040" paddingTop="16px">
          <Center
            flexDir="column"
            gap="16px"
            justifyContent="center"
            textAlign="center"
          >
            <Box
              display="flex"
              flexDir="column"
              width="100%"
              gap="16px"
              p="16px 0px"
            >
              <Text>
                {type === 'bad'
                  ? `Hit us with your complaints! We're all ears.`
                  : 'Make a wish and see what we can help.'}
              </Text>
              <Textarea
                value={value}
                onChange={handleInputChange}
                h="120px"
                borderRadius="8px"
              />
            </Box>
          </Center>
        </ModalBody>

        <ModalFooter
          p={{
            base: '12px 16px',
            md: '24px 16px',
          }}
        >
          <Button
            width="100%"
            p="8px 16px"
            lineHeight="20px"
            isDisabled={isButtonDisabled}
            onClick={handleButtonClick}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
