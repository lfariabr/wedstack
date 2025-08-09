import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface GuestSearchFormProps {
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const GuestSearchForm = ({ onSearch, isLoading = false, disabled = false }: GuestSearchFormProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Name or Phone (e.g. 0403278880 or Nayara)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg border-2 border-[var(--primary)]/20 focus:border-[var(--primary)] rounded-xl"
            required
            disabled={disabled}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || disabled || !searchTerm.trim()}
          className="w-full h-12 text-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Search Guest
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
