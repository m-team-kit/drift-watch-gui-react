import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { type PropsWithChildren } from 'react';

const ButtonBadge = ({ onClick, children }: PropsWithChildren<{ onClick: () => void }>) => (
  <button
    className={cn(
      'inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
      'group',
    )}
    onClick={onClick}
  >
    {children}

    <X className="group-hover:text-destructive ms-1 w-[0.667rem]" />
  </button>
);

export default ButtonBadge;
