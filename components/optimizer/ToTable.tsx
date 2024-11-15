import { track } from '@amplitude/analytics-browser';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Image,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import * as React from 'react';
import { Address } from 'viem';
import Table from '@/components/table';
import { LEARN_MORE_DESC, Reward, VaultMetadata } from '@/optimizer/types';
import DotsIcon from '@icons/dots.svg';
import ExternalLinkIcon from '@icons/externeal-link.svg';
import NothingToShowOptimizer from './NothingToShowOptimizer';
import SkeletonTable from './SkeletonTable';
import { formatTVL, normalizeAddress } from './types';

export interface ToData {
  chk: boolean;
  rewards: Reward[];
  apy: number;
  tvl: number;
  category: string;
  vault: VaultMetadata;
  vaultLink: string;
}

interface ToTableProps {
  data: ToData[] | undefined;
  selectedToVault: Record<Address, VaultMetadata>;
  setSelectedToVault: (tokens: Record<Address, VaultMetadata>) => void;
  loading: boolean;
}

export const getVaultDisplay = (vault: VaultMetadata) => {
  let display = vault.protocol.name;
  if (vault.name) {
    display += ' - ' + vault.name;
  }
  return display;
};

export function ToTable({
  data,
  selectedToVault,
  setSelectedToVault,
  loading,
}: ToTableProps) {
  const columns = useMemo<ColumnDef<ToData>[]>(
    () => [
      {
        accessorKey: 'chk',
        header: '',
        enableSorting: false,
        size: 30,
        cell: ({ row }) => {
          const vault = row.original.vault;
          const tokenAddress = normalizeAddress(vault.outputToken.address);

          const checked = tokenAddress in selectedToVault;
          const isDisabled =
            Object.keys(selectedToVault).length >= 1 && !checked;

          const handleCheckboxChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            if (e.target.checked) {
              setSelectedToVault({
                ...selectedToVault,
                [tokenAddress]: vault,
              });
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [tokenAddress]: _, ...rest } = selectedToVault;
              setSelectedToVault(rest);
            }
          };

          return (
            <Checkbox
              checked={checked}
              isChecked={checked}
              isDisabled={isDisabled}
              onChange={handleCheckboxChange}
            />
          );
        },
      },
      {
        accessorKey: 'vault',
        header: 'Vault',
        enableSorting: false,
        size: 200,
        cell: ({ getValue }) => {
          return getVaultDisplay(getValue() as VaultMetadata);
        },
      },
      {
        accessorKey: 'rewards',
        header: '',
        enableSorting: false,
        size: 100,
        cell: ({ row }) => {
          const vault = row.original.vault;
          const rewards = vault.rewards;
          const shouldShowMoreIcon = rewards.length > 3;
          return (
            <Popover
              trigger="hover"
              openDelay={0}
              closeDelay={200}
              placement="top"
            >
              <PopoverTrigger>
                <Flex flexWrap="wrap" pos="relative">
                  {rewards.slice(0, 3).map((reward, index) => {
                    return (
                      <Box
                        key={index}
                        pos={index !== 0 ? 'absolute' : 'relative'}
                        left={index !== 0 ? `${index * 16}px` : '0'}
                        border="1px solid #2A2D3A"
                        borderRadius="50%"
                      >
                        <Image
                          src={reward.logoUrl}
                          alt={reward.desc}
                          width="24px"
                          height="24px"
                          mr="4px"
                        />
                      </Box>
                    );
                  })}
                  {shouldShowMoreIcon && (
                    <Box
                      key={3}
                      pos="absolute"
                      left="48px"
                      border="1px solid #2A2D3A"
                      borderRadius="50%"
                      sx={{
                        rect: { fill: '#1A1B1F' },
                        path: { fill: '#757575', stroke: '#757575' },
                      }}
                    >
                      <DotsIcon width="24px" />
                    </Box>
                  )}
                </Flex>
              </PopoverTrigger>
              <PopoverContent
                bg="#22242B"
                border="1px solid #404040"
                borderRadius="16px"
                w="fit-content"
              >
                <PopoverHeader
                  fontWeight="semibold"
                  color="white"
                  borderColor="#404040"
                >
                  Rewards
                </PopoverHeader>
                <PopoverArrow bg="#22242B" shadowColor="#404040" />
                <PopoverBody>
                  <Flex direction="column" alignItems="stretch">
                    {rewards.map((reward) => (
                      <Flex
                        key={reward.name}
                        gap="10px"
                        justifyContent="space-between"
                      >
                        <Text>{reward.name}</Text>
                        {reward.desc === LEARN_MORE_DESC ? (
                          <Link
                            href={vault.protocol.siteUrl}
                            target="_blank"
                            textDecoration="underline"
                          >
                            {reward.desc}
                          </Link>
                        ) : (
                          <Text>{reward.desc}</Text>
                        )}
                      </Flex>
                    ))}
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          );
        },
      },
      {
        accessorKey: 'apy',
        header: () => <Box textAlign="right">APY</Box>,
        enableSorting: false,
        size: 60,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <Box textAlign="right">
              {value === 0 ? '-' : (value * 100.0).toFixed(2) + '%'}
            </Box>
          );
        },
      },
      {
        accessorKey: 'tvl',
        header: () => <Box textAlign="right">TVL</Box>,
        enableSorting: false,
        size: 120,
        cell: ({ getValue }) => {
          const value = formatTVL(getValue() as number);
          return <Box textAlign="right">{value}</Box>;
        },
      },
      {
        accessorKey: 'category',
        header: () => <Box textAlign="right">Category</Box>,
        enableSorting: false,
        size: 100,
        cell: ({ getValue }) => {
          const value =
            (getValue() as string).charAt(0).toUpperCase() +
            (getValue() as string).slice(1);
          return <Box textAlign="right">{value}</Box>;
        },
      },
      {
        accessorKey: 'vaultLink',
        header: '',
        enableSorting: false,
        size: 30,
        cell: ({ row }) => {
          const vault = row.original.vault;
          return (
            <Button
              as="a"
              target="_blank"
              href={vault.siteUrl}
              variant="tagStyle"
              w="fit-content"
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="auto"
              py="4px"
              whiteSpace="normal"
              _hover={{
                bg: '#E0E8FF0D',
              }}
              onClick={() => {
                console.log('clicked');
                track('optimizer_click_vault_link', {
                  source: 'to',
                  name: getVaultDisplay(vault),
                  link: vault.siteUrl,
                });
              }}
            >
              <ExternalLinkIcon width="16px" height="16px" color="white" />
            </Button>
          );
        },
      },
    ],
    [selectedToVault, setSelectedToVault]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const tableSx = {
    border: '1px solid #404040',
    borderRadius: '16px',
    borderCollapse: 'separate',
    backgroundColor: '#22242B',
    tbody: {
      boxShadow: 'unset',
      borderRadius: 'unset',
    },
  };

  return loading || data === undefined ? (
    <SkeletonTable table={table} sx={tableSx} />
  ) : data?.length === 0 ? (
    <NothingToShowOptimizer
      title="No compatible vaults available"
      description="Please try to click OTHER assets"
    />
  ) : (
    <Box
      maxH="440px"
      overflowY="auto"
      sx={{
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      <Table table={table} sx={tableSx} />
    </Box>
  );
}
