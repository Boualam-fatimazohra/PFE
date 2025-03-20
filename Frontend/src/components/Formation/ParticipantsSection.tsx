import * as React from "react";
import { Printer, Search, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Participant {
  date: string;
  time: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
  situationProfessionnel: string;
  status: string;
}

interface ParticipantsSectionProps {
  participants: Participant[];
  currentPage: number;
  itemsPerPage?: number;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ 
  participants,
  currentPage,
  itemsPerPage = 11 
}) => {
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedParticipants, setSelectedParticipants] = React.useState<number[]>([]);
  const [search, setSearch] = React.useState("");
 
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedParticipants = participants.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(displayedParticipants.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (index: number) => {
    let newSelected = [...selectedParticipants];
    if (newSelected.includes(index)) {
      newSelected = newSelected.filter(i => i !== index);
    } else {
      newSelected.push(index);
    }
    setSelectedParticipants(newSelected);
    setSelectAll(newSelected.length === displayedParticipants.length);
  };


  return (
    <div className="bg-white border border-[#DDD] p-6">
      <h2 className="text-2xl font-bold mb-6">Listes des participants</h2>

      <div className="flex items-center mb-6 gap-3">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Rechercher un bénéficiaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#DDD] outline-none text-[#666] placeholder:text-[#999] text-sm rounded"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF7900] rounded-full p-1.5">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Bouton Filtres sans bordure */}
        <Button variant="ghost" className="text-[#333] flex items-center gap-2 mr-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
          Filtres
        </Button>

        {/* Bouton Importer */}
        <Button variant="outline" className="border-[#999999] text-[#999999] font-normal text-sm whitespace-nowrap mr-1">
          Importer
        </Button>

        {/* Bouton Exporter */}
        <Button variant="outline" className="border-[#FF7900] text-[#FF7900] flex items-center gap-2 text-sm mr-1">
          Exporter
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17.0196 12.88V17.02H5.9796V12.88H3.6796V17.48C3.6796 18.4962 4.50339 19.32 5.5196 19.32H17.4796C18.4958 19.32 19.3196 18.4962 19.3196 17.48V12.88H17.0196ZM14.2596 10.58V5.06002C14.2596 4.69402 14.1142 4.34301 13.8554 4.08421C13.5966 3.82541 13.2456 3.68002 12.8796 3.68002H10.1196C9.35744 3.68002 8.7396 4.29787 8.7396 5.06002V10.58H5.9796L8.7396 13.3213L10.7794 15.3471C11.1725 15.7376 11.8267 15.7376 12.2198 15.3471L14.2596 13.3213L17.0196 10.58H14.2596Z" fill="#FF7900"/>
          </svg>
        </Button>

        {/* Bouton Imprimer */}
        <Button variant="ghost" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M20.9998 19.8H2.9998C2.33706 19.8 1.7998 19.2627 1.7998 18.6V12.6C1.7998 11.9372 2.33706 11.4 2.9998 11.4H5.3998V4.19995H13.7998L18.5998 8.99995V11.4H20.9998C21.6625 11.4 22.1998 11.9252 22.1998 12.588V18.6C22.1998 19.2627 21.6625 19.8 20.9998 19.8ZM11.9998 18.6C12.3312 18.6 12.5998 18.3313 12.5998 18C12.5998 17.6686 12.3312 17.4 11.9998 17.4C11.6684 17.4 11.3998 17.6686 11.3998 18C11.3998 18.3313 11.6684 18.6 11.9998 18.6ZM6.5998 14.4H17.3998V9.59995H14.3998C13.7371 9.59995 13.1998 9.06269 13.1998 8.39995V5.39995H6.5998V14.4Z" fill="#999999"/>
          </svg>
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F5F5F5]">
            <th className="p-3 text-left">
            <input 
                type="checkbox" 
                className="border border-[#DDD] w-4 h-4" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Date & Heure</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Nom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Prénom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Email</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Genre</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Situation Profetionnelle</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Status</th>
            <th className="p-3 font-bold"></th>
          </tr>
        </thead>
        <tbody>
          {displayedParticipants.map((participant, index) => (
            <tr key={index} className="border-t border-[#DDD] hover:bg-[#F5F5F5]">
              <td className="p-3">
                <input type="checkbox" className="border border-[#DDD] w-4 h-4"
                checked={selectedParticipants.includes(index)} />
              </td>
              <td className="p-3 text-sm">
                <div className="text-[#333]">{participant.date}</div>
                <div className="text-[#666] text-xs">{participant.time}</div>
              </td>
              <td className="p-3 text-[#333] text-sm ">{participant.lastName}</td>
              <td className="p-3 text-[#333] text-sm">{participant.firstName}</td>
              <td className="p-3 text-[#333] text-sm">{participant.email}</td>
              <td className="p-3 text-[#333] text-sm">{participant.gender}</td>
              <td className="p-3 text-[#333] text-sm">{participant.situationProfessionnel}</td>
              <td className="p-3 text-sm">
                <span className={cn(
                  "font-medium",
                  participant.status === "present" && "text-[#00C31F]",
                  participant.status === "absent" && "text-[#FF4815]"
                )}>
                  {participant.status === "present" ? "Présent (e)" : "Absent (e)"}
                </span>
              </td>
              <td className="p-3">
                <button className="flex items-center gap-2 text-sm text-[#333] font-bold">
                  Voir plus
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="black"/>
                  <mask id="mask0_717_3240" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="12">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_717_3240)"> </g>
                </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsSection;