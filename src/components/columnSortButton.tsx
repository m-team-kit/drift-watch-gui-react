import { Button } from '@/components/ui/button';
import { HeaderContext } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

const columnSortButton =
  (content: string) =>
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
