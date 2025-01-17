import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const models = [
  {
    value: 'qwen',
    label: 'Qwen 2.5 Coder',
    description: 'Powerful coding assistant with deep technical understanding'
  },
  {
    value: 'claude',
    label: 'Claude 3',
    description: 'Experimental model with enhanced capabilities'
  }
];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const selectedModel = models.find((model) => model.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
        >
          {selectedModel?.label || "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-gray-800 border-gray-700" align="start">
        <Command className="bg-transparent">
          <CommandInput 
            placeholder="Search models..." 
            className="text-white border-none focus:ring-0"
          />
          <CommandEmpty className="text-gray-400 py-2">No model found.</CommandEmpty>
          <CommandGroup className="overflow-hidden">
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700 cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div>
                  <div>{model.label}</div>
                  <p className="text-sm text-gray-400">{model.description}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};