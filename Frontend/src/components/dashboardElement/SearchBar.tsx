import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  
}

export const SearchBar = ({ onSearch}: SearchBarProps) => (
  <div className="flex items-center space-x-4">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="search"
        placeholder="Search"
        className="pl-10 w-[250px]"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
    {/* <button 
      onClick={onCreate}
      className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors"
    >
      <Plus size={20} />
      <span>Créer une formation</span>
    </button> */}
  </div>
);