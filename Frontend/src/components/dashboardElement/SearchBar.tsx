// SearchBar.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Rechercher des formations..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // This triggers search as user types (real-time)
  };

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 w-full"
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};