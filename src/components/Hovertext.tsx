import { type FC, type PropsWithChildren } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type HovertextProps = {
  text: string;
};
const Hovertext: FC<PropsWithChildren<HovertextProps>> = ({ text, children }) => (
  <Tooltip>
    <TooltipContent>{text}</TooltipContent>
    <TooltipTrigger className="underline decoration-dotted decoration-1">{children}</TooltipTrigger>
  </Tooltip>
);

export default Hovertext;
