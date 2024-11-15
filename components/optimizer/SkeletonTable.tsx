import {
  Skeleton,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { HeaderGroup, flexRender } from '@tanstack/react-table';

interface GenericTableProps<TData> extends TableProps {
  table: {
    getHeaderGroups: () => HeaderGroup<TData>[];
  };
}

function SkeletonTable<TData>({ table, ...props }: GenericTableProps<TData>) {
  return (
    <Table {...props}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </Th>
              );
            })}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {[...Array(6)].map((_, i) => (
          <Tr key={i}>
            {table.getHeaderGroups()[0].headers.map((header) => {
              return (
                <Td key={header.id}>
                  <Skeleton
                    isLoaded={false}
                    startColor="#2F3342"
                    borderRadius="24px"
                    height="100%"
                    width="100%"
                  >
                    &nbsp;
                  </Skeleton>
                </Td>
              );
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default SkeletonTable;
