import { Time } from '@/components/dataSymbols';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type RefObject, useCallback, useState } from 'react';

type SuggestionsInputProps = {
  id: string;
  defaultValue?: string | symbol;
  setInput: (input: string | symbol) => void;
  suggestions: string[];
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement>;
};
const SuggestionsInput = ({
  id,
  defaultValue,
  setInput,
  suggestions,
  placeholder = 'Enter text...',
  inputRef,
}: SuggestionsInputProps) => {
  const [value, setValue] = useState<string | symbol>(defaultValue ?? '');
  const updateValue = useCallback(
    (newValue: string | symbol) => {
      setValue(newValue);
      setInput(newValue);
    },
    [setInput, setValue],
  );

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        className={cn('pr-20', typeof value === 'symbol' && 'text-blue-400')}
        value={value.toString()}
        ref={inputRef}
        onChange={(e) => {
          if (typeof value === 'symbol') {
            updateValue('');
          } else {
            updateValue(e.target.value);
          }
        }}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-full px-3 py-2 hover:bg-transparent">
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <ScrollArea className="h-[200px]">
              <DropdownMenuItem onSelect={() => updateValue(Time)} className="text-blue-400">
                Time
              </DropdownMenuItem>
              {suggestions.map((option) => (
                <DropdownMenuItem key={option} onSelect={() => updateValue(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SuggestionsInput;
