import { Box, Button, Checkbox, Flex, Image, Text } from '@chakra-ui/react';
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { Address } from 'viem';
import ClickableTooltip from '@/components/ClickableTooltip';
import Table from '@/components/table';
import { Reward } from '@/optimizer/types';
import DownDobule from '@icons/down-double.svg';
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
  isLoading: boolean;
}

export function FromTable({
  data,
  selectedInputTokens,
  setSelectedInputTokens,
  isLoading = false,
}: FromTableProps) {
  const boxRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showOverflow, setShowOverflow] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (boxRef.current) {
        setIsOverflowing(
          (boxRef.current as HTMLElement).scrollHeight >
            (boxRef.current as HTMLElement).clientHeight
        );
      }
    };

    // Check overflow on component mount and whenever the table changes
    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => window.removeEventListener('resize', checkOverflow);
  }, [data]);
  const columns: ColumnDef<FromData>[] = [
    {
      accessorKey: 'chk',
      header: '',
      enableSorting: false,
      cell: ({ getValue, row }) => {
        const value = getValue() as boolean;
        if (!value) return null;
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [tokenAddress]: _, ...rest } = selectedInputTokens;
            setSelectedInputTokens(rest);
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
      accessorKey: 'protocolId',
      header: 'Protocol',
      enableSorting: false,
      cell: ({ row }) => {
        if (row.original.protocolId === null || row.original.protocolId === '')
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
  ];

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
  return isLoading ? (
    <SkeletonTable table={table} sx={tableSx} />
  ) : (
    <Box position="relative">
      <Box
        ref={boxRef}
        maxH="440px"
        overflowY="auto"
        onScroll={() => setIsScrolled(true)}
        sx={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          position: 'relative',
          thead: {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: '#22242B',
          },
        }}
      >
        <Table table={table} sx={tableSx} />
      </Box>
      {isOverflowing && showOverflow && !isScrolled && (
        <>
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="440px"
            background="linear-gradient(180deg, rgba(34, 36, 43, 0) 0%, #22242B 100%)"
            pointerEvents="none"
            zIndex={1}
          />
          <Button
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
            onClick={() => {
              setShowOverflow(false);
              if (boxRef.current) {
                (boxRef.current as HTMLElement).scrollTo({
                  top: (boxRef.current as HTMLElement).scrollTop + 100,
                  behavior: 'smooth',
                });
              }
            }}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            cursor="pointer"
            animation="bounce 2s infinite"
            sx={{
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateX(-50%) translateY(0)',
                },
                '50%': {
                  transform: 'translateX(-50%) translateY(-10px)',
                },
              },
            }}
          >
            <DownDobule />
          </Button>
        </>
      )}
    </Box>
  );
}
