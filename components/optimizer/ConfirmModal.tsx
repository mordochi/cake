import {
  Box,
  Button,
  Center,
  Modal as ChakraModal,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Step,
  StepIndicator,
  StepStatus,
  StepTitle,
  Stepper,
  UseToastOptions,
  useSteps,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { encodeFunctionData, parseSignature } from 'viem';
import { SignAuthorizationReturnType } from 'viem/experimental';
import { useAccount } from 'wagmi';
import { useSignTypedData } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import TableLoadingGIF from '@/public/gitfs/table-loading.gif';
import _7702walletClient, { _7702Account } from '@/services/7702Client';
import PublicClient from '@/services/publicClient';
import { PermitTx, TxInfo } from '../../optimizer/types';
import { config } from '../../utils/wagmi';
import {
  ActionStep,
  PermitSignStep,
  PermitTxStep,
  StepType,
  TxStep,
} from './types';

const BATCH_CALL_CONTRACT = '0xc59E9A8432657dcB5afD6f1682216F2CDDE66954';
const BATCH_CALL_ABI = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        internalType: 'struct BatchCallDelegation.Call[]',
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export interface IConfirmModalProps {
  isOpen: boolean;
  txs: (TxInfo | PermitTx)[];
  onClose: (success: boolean) => void;
  buttonText?: string;
  onButtonClick?: (onClose?: () => void) => void;
  onCompleteTransaction: (totalSteps: number) => void;
  isButtonDisabled?: boolean;
  closeOnOverlayClick?: boolean;
}

export const DEFAULT_CONFIRM_MODAL_STATE: IConfirmModalProps = {
  isOpen: false,
  txs: [],
  onClose: () => {},
  onCompleteTransaction: () => {},
};

const generateSteps = (txs: (TxInfo | PermitTx)[]): ActionStep[] => {
  const steps: ActionStep[] = [];
  for (const tx of txs) {
    if ('tx' in tx) {
      steps.push({
        type: StepType.PERMIT_SIGN,
        getDescription: () => tx.description,
        permitTx: tx,
      } as PermitSignStep);

      steps.push({
        type: StepType.PERMIT_TX,
        getDescription: () => tx.tx(BigInt(0), '0x', '0x').description,
        getTx: tx.tx,
      } as PermitTxStep);
    } else {
      steps.push({
        type: StepType.TX,
        getDescription: () => tx.description,
        getTx: () => tx,
      } as TxStep);
    }
  }
  return steps;
};

const TOAST_CONFIG = {
  ERROR: {
    title: 'Something Went Wrong',
    status: 'error',
    isClosable: true,
  },
  USER_CANCEL: {
    title: 'User Cancelled',
    status: 'info',
    isClosable: true,
  },
} satisfies Record<string, UseToastOptions>;

export default function ConfirmModal({
  isOpen,
  txs,
  onClose,
  buttonText,
  onButtonClick,
  onCompleteTransaction,
  closeOnOverlayClick = true,
}: IConfirmModalProps) {
  const { chain } = useAccount();
  const { signTypedDataAsync } = useSignTypedData({
    config,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [sentCompleteEvent, setSentCompleteEvent] = useState(false);
  const toast = useToast();

  const steps = generateSteps(txs);

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handlePermitSignAndTx = useCallback(
    async (
      step: PermitSignStep,
      authorization?: SignAuthorizationReturnType
    ) => {
      try {
        const data = await signTypedDataAsync(
          JSON.parse(step.permitTx.typedData)
        );
        const nextStepIndex = activeStep + 1;
        const nextStep = steps[nextStepIndex];
        if (nextStep.type !== StepType.PERMIT_TX)
          throw Error(`Permit sign should be followed by permit tx`);
        const { r, s, v, yParity } = parseSignature(data);
        setActiveStep(activeStep + 1);
        const txHash = await _7702walletClient.sendTransaction({
          ...(authorization ? { authorizationList: [authorization] } : {}),
          data: encodeFunctionData({
            abi: BATCH_CALL_ABI,
            functionName: 'execute',
            args: [[nextStep.getTx(v ?? BigInt(yParity), r, s)]],
          }),
          to: _7702walletClient.account.address,
        });
        const transactionReceipt = await waitForTransactionReceipt(config, {
          hash: txHash,
        });
        console.log('transactionReceipt: ', transactionReceipt);
        setActiveStep(nextStepIndex + 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message.includes('User rejected the request.')) {
          toast({
            ...TOAST_CONFIG.USER_CANCEL,
          });
        } else {
          toast({
            ...TOAST_CONFIG.ERROR,
            title: error.message,
          });
        }
      }
    },
    [steps, activeStep, setActiveStep, signTypedDataAsync]
  );

  useEffect(() => {
    const handleStep = async () => {
      try {
        if (!isOpen) return;
        if (steps.length === 0) return;
        if (activeStep === steps.length) return;
        const currentStep = steps[activeStep];
        if (!chain) return;
        // @ts-expect-error skip this error
        const client = PublicClient.get(chain);
        const code = await client.getCode({
          address: _7702Account.address,
        });

        let authorization;
        if (!code) {
          authorization = await _7702walletClient.signAuthorization({
            contractAddress: BATCH_CALL_CONTRACT,
          });
        }

        switch (currentStep.type) {
          case StepType.PERMIT_SIGN:
            await handlePermitSignAndTx(currentStep, authorization);
            break;
          case StepType.PERMIT_TX:
            // Do nothing, cause permit tx dependens on permit sign so we handle it right after permit sign
            break;
          case StepType.TX:
            const txHash = await _7702walletClient.sendTransaction({
              ...(authorization ? { authorizationList: [authorization] } : {}),
              data: encodeFunctionData({
                abi: BATCH_CALL_ABI,
                functionName: 'execute',
                args: [[currentStep.getTx()]],
              }),
              to: _7702walletClient.account.address,
            });
            const transactionReceipt = await waitForTransactionReceipt(config, {
              hash: txHash,
            });
            console.log('transactionReceipt: ', transactionReceipt);
            setActiveStep(activeStep + 1);
            break;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message.includes('User rejected the request.')) {
          toast({
            ...TOAST_CONFIG.USER_CANCEL,
          });
        } else {
          toast({
            ...TOAST_CONFIG.ERROR,
            title: error.message,
          });
        }
      }
    };
    handleStep();
  }, [activeStep, isOpen]);

  useEffect(() => {
    setIsButtonDisabled(activeStep !== steps.length);
    if (steps.length > 0 && activeStep === steps.length && !sentCompleteEvent) {
      setSentCompleteEvent(true);
      onCompleteTransaction(steps.length);
    }
  }, [activeStep, steps, sentCompleteEvent]);

  const innerOnClose = useCallback(() => {
    onClose(steps.length > 0 && activeStep === steps.length);
    setActiveStep(0);
    setIsButtonDisabled(true);
    setSentCompleteEvent(false);
  }, [activeStep, steps, onClose]);

  const handleButtonClick = onButtonClick
    ? () => onButtonClick(innerOnClose)
    : innerOnClose;

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={innerOnClose}
      isCentered
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay />
      <ModalContent bg="#22242B" borderRadius="24px" p="0" m="16px">
        <ModalCloseButton
          top="16px"
          right="16px"
          width="24px"
          height="24px"
          _focusVisible={{}}
          sx={{
            svg: { width: '14px', height: '14px', path: { fill: '#757575' } },
          }}
          onClick={innerOnClose}
        />

        <ModalBody
          borderBottom={buttonText ? '1px solid #404040' : undefined}
          p={'calc(16px + 24px + 20px) 16px 40px'} // padding top equals to outer padding + button height + inner padding
        >
          <Center
            flexDir="column"
            gap="20px"
            justifyContent="center"
            textAlign="center"
          >
            <Center w="186px" h="136px">
              <Image src={TableLoadingGIF.src} alt="loading" width="96px" />
            </Center>
            <Box display="flex" flexDirection="column" gap="20px">
              <Heading
                as="h4"
                fontSize="24px"
                fontWeight="700"
                lineHeight="32px"
              >
                Confirm Transactions
              </Heading>
              <Stepper index={activeStep} orientation="vertical" gap="8px">
                {steps.map((step, index) => (
                  <Step key={index}>
                    <Box
                      display="flex"
                      flexDir="row"
                      gap="8px"
                      alignItems="center"
                    >
                      <StepIndicator
                        h="16px"
                        w="16px"
                        border="1px solid #404040"
                        display="inline-flex"
                      >
                        <StepStatus
                          complete={
                            <Box
                              h="10px"
                              w="10px"
                              background="rgba(43, 80, 255, 1)"
                              padding="0px"
                              borderRadius="full"
                              m="0px"
                            />
                          }
                          active={
                            <Box
                              h="10px"
                              w="10px"
                              background="rgba(43, 80, 255, 1)"
                              padding="0px"
                              borderRadius="full"
                              m="0px"
                            />
                          }
                        />
                      </StepIndicator>

                      <Box w="100%" textAlign="left">
                        <StepTitle>
                          {index === activeStep
                            ? step.getDescription() + ' (pending...)'
                            : step.getDescription()}
                        </StepTitle>
                      </Box>
                    </Box>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Center>
        </ModalBody>

        <ModalFooter
          p={{
            base: buttonText ? '12px 16px' : '20px',
            md: buttonText ? '24px 16px' : '20px',
          }}
        >
          <Button
            width="100%"
            p="8px 16px"
            lineHeight="20px"
            isDisabled={isButtonDisabled}
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
