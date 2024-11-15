import {
  Box,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { HeaderGroup, Row, flexRender } from '@tanstack/react-table';
import HelpCircleIcon from '@icons/help-circle.svg';
import { ColumnSorter } from './ColumnSorter';

interface GenericTableProps<TData> extends TableProps {
  table: {
    getHeaderGroups: () => HeaderGroup<TData>[];
    getRowModel: () => { rows: Row<TData>[] };
  };
  tbodyTrHandler?: (row: Row<TData>) => void;
}

function GenericTable<TData>({
  table,
  tbodyTrHandler = () => {},
  ...props
}: GenericTableProps<TData>) {
  return (
    <Table {...props}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta: any = header.column.columnDef.meta;
              // check all rows.original[header.column.columnDef.meta.checkSortKey] is true
              const canShowSortIcon = meta?.checkSortKey
                ? table.getRowModel().rows.every((row) => {
                    const shouldCheckSortKey =
                      meta?.checkSortKey as keyof typeof row.original;
                    return (
                      !!shouldCheckSortKey &&
                      row.original[shouldCheckSortKey] === true
                    );
                  })
                : true;
              return (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={meta?.isNumeric}
                  style={{
                    width:
                      // hacks to fix the issue with auto size
                      // see more: https://github.com/TanStack/table/discussions/3192#discussioncomment-6458134
                      header.getSize() === Number.MAX_SAFE_INTEGER
                        ? 'auto'
                        : header.getSize(),
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {canShowSortIcon && <ColumnSorter column={header.column} />}
                  {meta?.hint && (
                    <Box display="inline-flex" pl="4px" verticalAlign="bottom">
                      <Tooltip
                        label={meta?.hint}
                        hasArrow
                        borderRadius="8px"
                        bg="#282828"
                        fontSize="12px"
                        w="160px"
                      >
                        <Box>
                          <Box as={HelpCircleIcon} boxSize="16px" />
                        </Box>
                      </Tooltip>
                    </Box>
                  )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row) => (
          <Tr key={row.id} onClick={() => tbodyTrHandler(row)}>
            {row.getVisibleCells().map((cell) => {
              const meta: any = cell.column.columnDef.meta;
              return (
                <Td
                  key={cell.id}
                  isNumeric={meta?.isNumeric}
                  style={{
                    width:
                      cell.column.getSize() === Number.MAX_SAFE_INTEGER
                        ? 'auto'
                        : cell.column.getSize(),
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default GenericTable;
