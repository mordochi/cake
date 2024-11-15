import { Box, Checkbox, Flex, Image, Text } from '@chakra-ui/react';
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
import ClickableTooltip from '@/components/ClickableTooltip';
import Table from '@/components/table';
import { Reward } from '@/optimizer/types';
import SkeletonTable from './SkeletonTable';
import {
  DebankAsset,
  DebankTokenData,
  formatTVL,
  normalizeAddress,
} from './types';

export interface FromData {
  chk: boolean;
  protocolId: string;
  rewards: Reward[];
  token: DebankTokenData;
  amount: number;
  apy: number;
  tvl: number;
  debankAsset: DebankAsset;
  usdValue: number;
}

interface FromTableProps {
  data: FromData[];
  selectedInputTokens: Record<Address, FromData>;
  setSelectedInputTokens: (tokens: Record<Address, FromData>) => void;
}

export function FromTable({
  data,
  selectedInputTokens,
  setSelectedInputTokens,
}: FromTableProps) {
  const columns = useMemo<ColumnDef<FromData>[]>(
    () => [
      {
        accessorKey: 'chk',
        header: '',
        enableSorting: false,
        cell: ({ getValue, row }) => {
          const value = getValue() as boolean;
          const tokenAddress = normalizeAddress(
            row.original.debankAsset.asset.token_address
          );
          const fromData = row.original;

          const checked = tokenAddress in selectedInputTokens;
          const isDisabled =
            Object.keys(selectedInputTokens).length >= 1 && !checked;

          const handleCheckboxChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            if (e.target.checked) {
              setSelectedInputTokens({
                ...selectedInputTokens,
                [tokenAddress]: fromData,
              });
            } else {
              const { [tokenAddress]: _, ...rest } = selectedInputTokens;
              setSelectedInputTokens(rest);
            }
          };

          return value ? (
            <Checkbox
              checked={checked}
              isChecked={checked}
              isDisabled={isDisabled}
              onChange={handleCheckboxChange}
            />
          ) : null;
        },
      },
      {
        accessorKey: 'protocolId',
        header: 'Protocol',
        enableSorting: false,
        cell: ({ row }) => {
          if (
            row.original.protocolId === null ||
            row.original.protocolId === ''
          )
            return '-';
          const protocol = row.original.debankAsset.protocol;
          return (
            <ClickableTooltip
              label={protocol?.name || ''}
              hasArrow
              borderRadius="8px"
              bg="black"
              fontSize="14px"
              maxW="79x"
              placement="top"
            >
              <Image
                src={protocol?.logo_url || ''}
                alt={protocol?.name || 'Protocol Logo'}
                width="20px"
                height="20px"
                style={{
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              />
            </ClickableTooltip>
          );
        },
      },
      // TO ENHANCE, disabled for this version
      // {
      //   accessorKey: 'rewards',
      //   header: 'Rewards',
      //   enableSorting: false,
      //   cell: ({ getValue }) => {
      //     const value = getValue() as Reward[]
      //     return value.length === 0
      //       ? '-'
      //       : value.map((reward, index) => (
      //           <div
      //             key={reward.name}
      //             style={{
      //               display: 'inline-block',
      //               marginLeft: index === 0 ? '0' : '-5px',
      //             }}
      //           >
      //             {reward.logoUrl && (
      //               <Image
      //                 src={reward.logoUrl}
      //                 alt={`${reward.name} Logo`}
      //                 width="20px"
      //                 height="20px"
      //                 style={{
      //                   borderRadius: '50%',
      //                   border: '1px solid #1A1B1F',
      //                 }}
      //               />
      //             )}
      //           </div>
      //         ))
      //   },
      // },
      {
        accessorKey: 'token',
        header: 'Token',
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = getValue() as DebankTokenData;
          return (
            <Flex>
              {value.logo_url && (
                <Image
                  src={value.logo_url}
                  alt={value.name || 'Token Logo'}
                  width="20px"
                  height="20px"
                  mr="4px"
                />
              )}
              {value.symbol}
            </Flex>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        enableSorting: false,
        cell: ({ getValue, row }) => {
          const value = getValue() as number;
          const token = row.original.debankAsset.asset;
          const usd = value * token.price;
          return (
            <div>
              <Text fontSize="14px">{value.toFixed(6)}</Text>
              <Text fontSize="10px" color="gray.300">
                ~${usd.toFixed(6)}
              </Text>
            </div>
          );
        },
      },

      {
        accessorKey: 'apy',
        header: () => <Box textAlign="right">APY</Box>,
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return (
            <Box textAlign="right">
              {value === 0 ? '-' : `${(value * 100.0).toFixed(2)}%`}
            </Box>
          );
        },
      },
      {
        accessorKey: 'tvl',
        header: () => <Box textAlign="right">TVL</Box>,
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = formatTVL(getValue() as number);
          return <Box textAlign="right">{value}</Box>;
        },
      },
    ],
    [selectedInputTokens, setSelectedInputTokens]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    data,
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
  return data.length === 0 ? (
    <SkeletonTable table={table} sx={tableSx} />
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
