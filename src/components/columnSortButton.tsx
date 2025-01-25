import { Button } from '@/components/ui/button';
import { type HeaderContext } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const columnSortButton =
  (content: string) =>
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  ({ column }: HeaderContext<any, unknown>) => (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {column.getIsSorted() === 'asc' ? (
        <ArrowDown />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowUp />
      ) : (
        <ArrowUpDown />
      )}
      {content}
    </Button>
  );

export default columnSortButton;
