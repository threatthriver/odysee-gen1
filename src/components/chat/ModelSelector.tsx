import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

const models = [
  {
    value: "Qwen/Qwen2.5-Coder-32B-Instruct",
    label: "Qwen 2.5 Coder",
  },
  {
    value: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    label: "Mixtral 8x7B",
  },
  {
    value: "codellama/CodeLlama-34b-Instruct-hf",
    label: "CodeLlama 34B",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
        >
          {selectedModel
            ? models.find((model) => model.value === selectedModel)?.label
            : "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
        <Command>
          <CommandInput placeholder="Search models..." className="text-white" />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={() => {
                  onModelSelect(model.value);
                  setOpen(false);
                }}
                className="text-white hover:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedModel === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {model.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};