import { Button } from '@/components/ui/button';
import { type HeaderContext } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const columnSortButton =
  (
    content: string,
    onSortChange: (columnId: string, direction: 'asc' | 'desc' | undefined) => void,
  ) =>
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  ({ column }: HeaderContext<any, unknown>) => {
    const isSorted = column.getIsSorted();
    const nextSortDirection = isSorted === 'asc' ? 'desc' : isSorted === 'desc' ? undefined : 'asc';

    return (
      <Button
        variant="ghost"
        onClick={() => {
          onSortChange(column.id, nextSortDirection);
        }}
      >
        {isSorted === 'asc' ? <ArrowDown /> : isSorted === 'desc' ? <ArrowUp /> : <ArrowUpDown />}
        {content}
      </Button>
    );
  };

export default columnSortButton;
