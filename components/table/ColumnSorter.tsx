import { IconButton } from '@chakra-ui/react';
import { Column } from '@tanstack/react-table';
import ChevronUpIcon from '@icons/chevron-up.svg';
import SelectorIcon from '@icons/selector.svg';

interface ColumnButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: Column<any, any>;
}

export const ColumnSorter = ({ column }: ColumnButtonProps) => {
  if (!column.getCanSort()) {
    return null;
  }

  const sorted = column.getIsSorted();

  return (
    <IconButton
      aria-label="Sort"
      size="xs"
      onClick={column.getToggleSortingHandler()}
      style={{
        transition: 'transform 0.25s',
        transform: `rotate(${sorted === 'asc' ? '180' : '0'}deg)`,
      }}
      variant={sorted ? 'light' : 'transparent'}
      color={sorted ? 'primary' : 'gray'}
      icon={
        <>
          {!sorted && <SelectorIcon size={14} />}
          {sorted && <ChevronUpIcon size={14} />}
        </>
      }
    />
  );
};
