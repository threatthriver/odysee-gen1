import { Check, ChevronsUpDown, RefreshCw, Search } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const models = [
  {
    value: "Qwen/Qwen2.5-Coder-32B-Instruct",
    label: "Qwen 2.5 Coder",
    description: "Best for code generation and technical tasks",
  },
  {
    value: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    label: "Mixtral 8x7B",
    description: "Balanced performance for general tasks",
  },
  {
    value: "codellama/CodeLlama-34b-Instruct-hf",
    label: "CodeLlama 34B",
    description: "Specialized in code understanding and generation",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleModelSelect = (value: string) => {
    onModelSelect(value);
    setOpen(false);
    toast({
      title: "Model Changed",
      description: `Switched to ${models.find(m => m.value === value)?.label}`,
    });
  };

  const refreshModels = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Models Refreshed",
        description: "Available models have been updated",
      });
    }, 1000);
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-800/50 backdrop-blur-sm border-gray-700/50 text-white hover:bg-gray-700/50 shadow-lg transition-all duration-200"
          >
            {selectedModel
              ? models.find((model) => model.value === selectedModel)?.label
              : "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 bg-gray-800/95 backdrop-blur-lg border-gray-700/50 shadow-xl">
          <Command>
            <div className="flex items-center border-b border-gray-700/50 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
              <CommandInput 
                placeholder="Search models..." 
                className="text-white placeholder:text-gray-400"
              />
            </div>
            <CommandEmpty className="py-6 text-center text-sm text-gray-400">
              No model found.
            </CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={() => handleModelSelect(model.value)}
                  className="text-white hover:bg-gray-700/50 cursor-pointer transition-colors"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedModel === model.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{model.label}</span>
                    <span className="text-xs text-gray-400">{model.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        size="icon"
        variant="outline"
        className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 text-white hover:bg-gray-700/50 shadow-lg transition-all duration-200"
        onClick={refreshModels}
        disabled={isRefreshing}
      >
        <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
      </Button>
    </div>
  );
};