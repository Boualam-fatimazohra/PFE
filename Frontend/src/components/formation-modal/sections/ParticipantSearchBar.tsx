// src/components/formation-modal/sections/ParticipantSearchBar.tsx
import * as React from "react";
import { Search, Filter } from "lucide-react";

interface ParticipantSearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ParticipantSearchBar: React.FC<ParticipantSearchBarProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Recherche participants..."
          className="w-full pl-10 pr-12 py-3 border rounded-lg text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Icône de recherche à gauche */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

        {/* Icône loupe orange à droite */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.2765 13.1102L10.6661 9.49975C11.2718 8.65338 11.5966 7.6383 11.5949 6.59754C11.5949 3.83754 9.35745 1.6001 6.59742 1.6001C3.83738 1.6001 1.59998 3.83751 1.59998 6.59754C1.59998 9.35757 3.83738 11.595 6.59742 11.595C7.63822 11.5966 8.65333 11.2718 9.49981 10.6662L13.1101 14.2765C13.2665 14.4321 13.5192 14.4321 13.6756 14.2765L14.2765 13.6757C14.432 13.5193 14.432 13.2667 14.2765 13.1102ZM6.59742 9.99581C4.72062 9.99581 3.19916 8.47434 3.19916 6.59754C3.19916 4.72074 4.72062 3.19928 6.59742 3.19928C8.47422 3.19928 9.99569 4.72074 9.99569 6.59754C9.99569 8.47434 8.47422 9.99581 6.59742 9.99581Z"
            />
          </svg>
        </div>
      </div>

      {/* Bouton Filtre */}
      <button className="p-3 border rounded-lg flex items-center justify-center w-12 h-12 bg-black">
        <Filter size={20} className="text-white" />
      </button>
    </div>
  );
};

export default ParticipantSearchBar;