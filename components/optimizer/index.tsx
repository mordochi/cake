'use client';
import * as amplitude from '@amplitude/analytics-browser';
import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { switchChain } from 'wagmi/actions';
import { StakeChainType } from '@/cases/types';
import FeedbackModal, {
  DEFAULT_FEEDBACK_MODAL_STATE,
  FeedbackType,
  IFeedbackModalProps,
} from '@/components/optimizer/FeedbackModal';
import useConnector from '@/hooks/useConnector';
import ProtocolManager from '@/optimizer/protocolManager';
import {
  PermitTx,
  PositionPair,
  TxInfo,
  VaultMetadata,
} from '@/optimizer/types';
import { Reward } from '@/optimizer/types';
import { ChainButtonList } from './ChainButtonList';
import ConfirmModal, {
  DEFAULT_CONFIRM_MODAL_STATE,
  IConfirmModalProps,
} from './ConfirmModal';
import { FromData, FromTable } from './FromTable';
import NothingToShowOptimizer from './NothingToShowOptimizer';
import OptimizerPageBanner from './OptimizerPageBanner';
import { ToData, ToTable, getVaultDisplay } from './ToTable';
import {
  DebankPortfolio,
  DebankTokenData,
  OptimizerSupportedChains,
  formatAmount,
  normalizeAddress,
} from './types';

const processDebankData = (
  chain: StakeChainType,
  debankData: DebankPortfolio
): {
  chainUsdValues: { [key: number]: number };
  fromDataToken: FromData[];
  fromDataProtocol: FromData[];
  positionPairs: PositionPair[];
} => {
  const chainUsdValues: { [key: string]: number } = {};

  const positionPairs: PositionPair[] = [];
  const fromDataToken: FromData[] = [];
  const fromDataProtocol: FromData[] = [];

  Object.entries(debankData).forEach(([chainId, data]) => {
    const usdValue = Number(data.usd_value);
    if (usdValue > 0 && OptimizerSupportedChains[Number(chainId)]) {
      chainUsdValues[Number(chainId)] = usdValue;
    }
  });

  const chainData = debankData[chain.id.toString()];
  if (chainData.assets) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chainData.assets.forEach((asset: any) => {
      if (asset.protocol?.id) {
        const pair = {
          protocolId: asset.protocol.id,
          inputTokenAddress: normalizeAddress(
            asset.protocol.supply_tokens[0].token_address
          ),
          outputTokenAddress: normalizeAddress(asset.asset.token_address),
        };

        const rewards: Reward[] = [];
        if (asset.protocol.reward_tokens) {
          asset.protocol.reward_tokens.forEach((reward: DebankTokenData) => {
            rewards.push({
              name: reward.name,
              desc: reward.amount.toString(),
              logoUrl: reward.logo_url,
            });
          });
        }
        positionPairs.push(pair);
        const amount = Number(asset.asset.amount);
        const usdValue = amount * Number(asset.asset.price);
        fromDataProtocol.push({
          chk: false,
          protocolId: asset.protocol.id,
          rewards,
          token: asset.asset,
          amount,
          apy: 0,
          tvl: 0,
          debankAsset: asset,
          usdValue,
        });
      } else {
        // pure asset
        const amount = Number(asset.asset.amount);
        const usdValue = amount * Number(asset.asset.price);
        fromDataToken.push({
          chk: true,
          protocolId: '',
          rewards: [],
          token: asset.asset,
          amount,
          apy: 0,
          tvl: 0,
          debankAsset: asset,
          usdValue,
        });
      }
    });
  }

  return { chainUsdValues, fromDataToken, fromDataProtocol, positionPairs };
};

// Add new interface for the processed data
interface ProcessedDebankData {
  fromDataToken: FromData[];
  fromDataProtocol: FromData[];
  positionPairs: PositionPair[];
}

export default function Optimizer() {
  const { isConnected } = useConnector();
  const { address, chain, connector } = useAccount();
  const toast = useToast();
  const [feedbackModal, setFeedbackModal] = useState<IFeedbackModalProps>(
    DEFAULT_FEEDBACK_MODAL_STATE
  );
  const [confirmModal, setConfirmModal] = useState<IConfirmModalProps>(
    DEFAULT_CONFIRM_MODAL_STATE
  );
  const [chainAssets, setChainAssets] = useState<{ [key: number]: number }>({});
  const [fromData, setFromData] = useState<FromData[]>();
  const [toData, setToData] = useState<ToData[] | undefined>(undefined);
  const [isToDataLoading, setIsToDataLoading] = useState<boolean>(false);
  const [selectedInputTokens, setSelectedInputTokens] = useState<
    Record<Address, FromData>
  >({});
  const [selectedToVault, setSelectedToVault] = useState<
    Record<Address, VaultMetadata>
  >({});
  const [isClient, setIsClient] = useState(false);
  const [processedDebankData, setProcessedDebankData] =
    useState<ProcessedDebankData>({
      fromDataToken: [],
      fromDataProtocol: [],
      positionPairs: [],
    });
  const config = useConfig();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (address) {
      amplitude.setUserId(address);
      if (connector) {
        const identify = new amplitude.Identify();
        identify.setOnce('wallet', connector.id.toLowerCase());
        amplitude.identify(identify);
      }
    } else {
      setChainAssets({});
      setFromData(undefined);
      setToData(undefined);
      setSelectedInputTokens({});
      setSelectedToVault({});
      setProcessedDebankData({
        fromDataToken: [],
        fromDataProtocol: [],
        positionPairs: [],
      });
    }
  }, [address, connector]);

  const onSwitchChain = async (chainId: number) => {
    try {
      setChainAssets({});
      setFromData([]);
      setToData(undefined);
      setSelectedInputTokens({});
      setSelectedToVault({});
      setProcessedDebankData({
        fromDataToken: [],
        fromDataProtocol: [],
        positionPairs: [],
      });
      await switchChain(config, {
        chainId: chainId as (typeof config)['chains'][number]['id'],
      });
    } catch (error) {
      console.error('Error switching chain:', error);
      toast({
        title: 'Error switching chain',
        description: error instanceof Error ? error.message : String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchDebankData = async (force: boolean = false, address: Address) => {
    if (!address) throw new Error('Address is required');
    let url = `https://api-dev.bentobatch.com/v1/shift/address/${address}/summary`;
    if (force) {
      url += `?force=true`;
    }
    const response = await fetch(url);
    const json = await response.json();
    return json as DebankPortfolio;
  };

  const fetchPositions = useCallback(
    async (address: Address, force: boolean) => {
      if (!chain) throw new Error('Chain is required');
      try {
        const debankData = await fetchDebankData(force, address);
        const {
          chainUsdValues,
          fromDataToken,
          fromDataProtocol,
          positionPairs,
          // @ts-expect-error skip this error
        } = processDebankData(chain, debankData);

        setChainAssets(chainUsdValues);
        setProcessedDebankData({
          fromDataToken,
          fromDataProtocol,
          positionPairs,
        });
      } catch (error) {
        console.error('Error fetching vaults metadata:', error);
        toast({
          title: 'Error fetching positions',
          description: error instanceof Error ? error.message : String(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [chain, toast]
  );

  useEffect(() => {
    if (!address) return;
    const chainId = chain?.id;
    if (!chainId) return;

    fetchPositions(address, false);
  }, [chain, address, toast, fetchPositions]);

  useEffect(() => {
    const fetchPositionMetadata = async () => {
      const protocolManager = ProtocolManager.getInstance();
      if (
        (processedDebankData.fromDataToken === undefined &&
          processedDebankData.fromDataProtocol === undefined) ||
        !chain?.id
      )
        return;

      const postionMetas = await protocolManager.getPositionsMetadata(
        // @ts-expect-error skip this error
        chain,
        processedDebankData.positionPairs
      );

      const checkableFromData: FromData[] = [];

      const positionMetasRecord: Record<string, VaultMetadata> = {};
      postionMetas.forEach((meta) => {
        positionMetasRecord[meta.protocol.id] = meta;
      });

      processedDebankData.fromDataProtocol.forEach((item, index) => {
        const positionMeta = positionMetasRecord[item.protocolId];

        if (positionMeta) {
          item.apy = positionMeta.apy;
          item.tvl = positionMeta.tvl;

          if (positionMeta.protocol.isWithdrawalSupported) {
            item.chk = true;
            checkableFromData.push(item);
            processedDebankData.fromDataProtocol.splice(index, 1);
          }
        }
      });
      const fromDataCheckable = [
        ...processedDebankData.fromDataToken,
        ...checkableFromData,
      ].sort((a, b) => b.usdValue - a.usdValue);

      setFromData([
        ...fromDataCheckable,
        ...processedDebankData.fromDataProtocol,
      ]);
    };

    fetchPositionMetadata();
  }, [processedDebankData, chain]);

  useEffect(() => {
    if (chain === undefined || Object.keys(selectedInputTokens).length <= 0) {
      return;
    }

    const fetchToData = async () => {
      setIsToDataLoading(true);

      try {
        const toDataPromises = Object.keys(selectedInputTokens || {}).map(
          async (tokenAddress) => {
            const protocolManager = ProtocolManager.getInstance();
            const vaultsMetadata = await protocolManager.getVaultsMetadata(
              chain as StakeChainType,
              tokenAddress as Address
            );
            return vaultsMetadata.map(
              (metadata): ToData => ({
                chk: false,
                rewards: metadata.rewards,
                apy: metadata.apy,
                tvl: metadata.tvl,
                category: metadata.category,
                vault: metadata,
                vaultLink: metadata.siteUrl,
              })
            );
          }
        );

        const toDataResults = await Promise.all(toDataPromises);

        // Flatten and sort the array by APY in descending order
        const sortedData = toDataResults.flat().sort((a, b) => b.apy - a.apy);
        setToData(sortedData);
        setIsToDataLoading(false);
      } catch (error) {
        console.error('Error fetching to data:', error);
        toast({
          title: 'Error fetching positions',
          description: error instanceof Error ? error.message : String(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchToData();
  }, [chain, selectedInputTokens, toast]);

  // Calculate total assets and percentages
  const totalAssets = Object.values(chainAssets).reduce(
    (sum, value) => sum + value,
    0
  );

  const handleOptimizeModal = async () => {
    if (!address) return;
    if (Object.keys(selectedInputTokens).length <= 0) {
      toast({
        title: 'Please select at least one From asset',
        status: 'info',
        isClosable: true,
      });
      return;
    }

    if (Object.keys(selectedToVault).length <= 0) {
      toast({
        title: 'Please select at least one To vault',
        status: 'info',
        isClosable: true,
      });
      return;
    }

    const chainTrackingName = 'ethereum';

    // Track optimizer data
    const fromTracking = {
      chain: chainTrackingName,
      from_protocol: [] as string[],
      from_assets: [] as string[],
      from_apy: [] as number[],
    };

    Object.values(selectedInputTokens).forEach((fromData) => {
      fromTracking.from_protocol.push(fromData.protocolId.toLowerCase());
      fromTracking.from_assets.push(fromData.token.symbol.toLowerCase());
      fromTracking.from_apy.push(fromData.apy * 100.0);
    });

    const toVault = Object.values(selectedToVault)[0];
    const toInputTokenAmount =
      Object.values(selectedInputTokens)[0]?.amount || 0;
    const toApy = toVault.apy * 100.0;
    const toTracking = {
      to_protocol: toVault.protocol.id.toLowerCase(),
      to_apy: toApy,
      to_input_token: toVault.inputToken.symbol.toLowerCase(),
      to_output_token: toVault.outputToken.symbol.toLowerCase(),
      to_input_token_amount: toInputTokenAmount,
    };

    amplitude.track('optimizer_click_optimize', {
      ...fromTracking,
      ...toTracking,
    });

    try {
      const protocolManager = ProtocolManager.getInstance();
      const allTxs: (TxInfo | PermitTx)[] = [];

      // Handle withdrawals from selected input tokens
      for (const [tokenAddress, fromData] of Object.entries(
        selectedInputTokens
      )) {
        if (fromData.protocolId === '') continue;
        const amountBigInt = BigInt(
          fromData.amount * 10 ** fromData.token.decimals || 0
        );
        const withdrawal = await protocolManager.withdraw(
          fromData.protocolId,
          chain as StakeChainType,
          address as Address,
          {
            address: tokenAddress as Address,
            decimals: fromData.token.decimals,
            symbol: fromData.token.symbol,
            name: '',
          },
          {
            address: fromData.token.token_address as Address,
            decimals: fromData.token.decimals,
            symbol: fromData.token.symbol,
            name: '',
          },
          amountBigInt
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Array.isArray(withdrawal.txs)
          ? allTxs.push(...withdrawal.txs)
          : allTxs.push(withdrawal.txs);
      }
      // TO ENHANCE: because only one in selectedInputTokens of this version
      const selectedInputTokens0 = Object.values(
        selectedInputTokens
      )[0] as FromData;
      if (selectedInputTokens0.token.token_address === 'eth') {
        selectedInputTokens0.amount = selectedInputTokens0.amount * 0.9;
      }
      // Handle deposits to selected vaults
      for (const [vaultAddress, vaultData] of Object.entries(selectedToVault)) {
        const amountBigInt = BigInt(
          selectedInputTokens0.amount * 10 ** vaultData.inputToken.decimals || 0
        );

        const deposits = await protocolManager.deposit(
          vaultData.protocol.id,
          chain as StakeChainType,
          address as Address,
          {
            address: vaultData.inputToken.address,
            decimals: vaultData.inputToken.decimals,
            symbol: vaultData.inputToken.symbol,
            name: '',
          },
          {
            address: vaultAddress as Address,
            decimals: vaultData.outputToken.decimals,
            symbol: vaultData.outputToken.symbol,
            name: '',
          },
          amountBigInt
        );
        const txInfo = deposits.map((tx) => {
          const isApprove = tx.data.startsWith('0x095ea7b3');
          const vaultDisplay = getVaultDisplay(vaultData);
          return {
            ...tx,
            description: isApprove
              ? `Approve ${formatAmount(selectedInputTokens0.amount)} ${vaultData.inputToken.symbol} to ${vaultData.protocol.name}`
              : `Deposit ${formatAmount(selectedInputTokens0.amount)} ${vaultData.inputToken.symbol} to ${vaultDisplay} vault`,
            displayAmount: formatAmount(selectedInputTokens0.amount),
          };
        });

        allTxs.push(...txInfo);
      }

      setConfirmModal({
        isOpen: true,
        txs: allTxs,
        buttonText: 'All Set',
        onClose: (success: boolean) => {
          if (success) {
            fetchPositions(address, true);
          }
          setConfirmModal(DEFAULT_CONFIRM_MODAL_STATE);
          setFeedbackModal({
            isOpen: true,
            type: success ? FeedbackType.GOOD : FeedbackType.BAD,
            onClose: () => {
              setFeedbackModal(DEFAULT_FEEDBACK_MODAL_STATE);
            },
          });
        },
        onCompleteTransaction: (totalSteps: number) => {
          amplitude.track('optimizer_complete_optimize', {
            to_protocol_name: toVault.protocol.id.toLowerCase(),
            chain: chainTrackingName,
            from_assets: fromTracking.from_assets,
            from_apy: fromTracking.from_apy,
            to_apy: toApy,
            total_steps: totalSteps,
            to_input_token_amount: toInputTokenAmount,
          });
        },
      });
    } catch (error) {
      console.error('Error during optimization:', error);
      toast({
        title: 'Error during optimization',
        description: error instanceof Error ? error.message : String(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Flex
        flexDirection="column"
        bg="#1A1B1F"
        w="100%"
        h="100%"
        alignItems="stretch"
      >
        <OptimizerPageBanner />

        {isConnected && isClient && (
          <>
            <ChainButtonList
              selectedChainId={chain?.id}
              chainAssets={chainAssets}
              totalAssets={totalAssets}
              onSwitchChain={onSwitchChain}
            />

            <Flex
              gap="24px"
              mt="24px"
              direction={{ base: 'column', md: 'row' }}
              margin="48px"
            >
              <Flex flex="1" direction="column" width="45%">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="30px" fontWeight="bold">
                    From
                  </Text>
                </Flex>
                <FromTable
                  data={fromData || []}
                  selectedInputTokens={selectedInputTokens}
                  setSelectedInputTokens={(tokens) => {
                    setToData(undefined);
                    setSelectedToVault({});
                    setSelectedInputTokens(tokens);
                  }}
                />
              </Flex>

              <Flex flex="1" direction="column">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontSize="30px" fontWeight="bold">
                    To
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="md"
                    borderRadius="full"
                    fontSize="md"
                    fontWeight="bold"
                    _hover={{ bg: 'blue.400' }}
                    onClick={handleOptimizeModal}
                  >
                    Optimize
                  </Button>
                </Flex>
                {Object.keys(selectedInputTokens).length === 0 ? (
                  <NothingToShowOptimizer
                    title="No assets found"
                    description="Please click one of left side (From) assets"
                  />
                ) : (
                  <ToTable
                    selectedToVault={selectedToVault}
                    setSelectedToVault={setSelectedToVault}
                    data={toData}
                    loading={isToDataLoading}
                  />
                )}
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
      <FeedbackModal {...feedbackModal} />
      <ConfirmModal {...confirmModal} />
    </>
  );
}
