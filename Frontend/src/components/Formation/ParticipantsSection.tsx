import * as React from "react";
import { Printer, Search, Filter, FileDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Participant {
  date: string;
  time: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
  phone: string;
  status: string;
}

interface ParticipantsSectionProps {
  participants: Participant[];
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ participants }) => {
  return (
    <div className="bg-white border border-[#999]">
      <div className="p-6 border-b border-[#DDD]">
        <h3 className="text-2xl font-bold">Listes des participants</h3>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex items-center border border-[#DDD] flex-grow">
              <input
                type="text"
                placeholder="Recherche participants ..."
                className="w-full pl-4 pr-12 py-2.5 outline-none text-[#666] placeholder:text-[#999] text-sm"
              />
              <button style={{ backgroundColor: '#FF7900 !important' }} className="flex items-center justify-center w-8 h-8 mr-1 rounded-full">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Button variant="outline" className="border-[#DDD] text-[#333] font-normal text-sm" style={{ padding: '0.5rem 1rem' }}>
              Importer
            </Button>
            <Button variant="outline" className="border-[#DDD] text-[#333] font-normal items-center gap-2 text-sm" style={{ padding: '0.5rem 1rem' }}>
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="orange" className="flex items-center gap-2 text-sm" style={{ padding: '0.5rem 1rem' }}>
              Exporter
              <FileDown className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-[#DDD] p-2 min-w-[40px]">
              <Printer className="h-4 w-4 text-[#333]" />
            </Button>
          </div>
        </div>

        {/* Participants Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F5F5]">
              <th className="p-3 text-left">
                <input type="checkbox" className="border border-[#DDD] w-4 h-4" />
              </th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Date & Heure</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Nom</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Prénom</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Email</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Genre</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Téléphone</th>
              <th className="p-3 text-left font-semibold text-[#333] text-sm">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => (
              <tr key={index} className="border-t border-[#DDD] hover:bg-[#F5F5F5]">
                <td className="p-3">
                  <input type="checkbox" className="border border-[#DDD] w-4 h-4" />
                </td>
                <td className="p-3 text-sm">
                  <div className="text-[#333]">{participant.date}</div>
                  <div className="text-[#666] text-xs">{participant.time}</div>
                </td>
                <td className="p-3 text-[#333] text-sm">{participant.lastName}</td>
                <td className="p-3 text-[#333] text-sm">{participant.firstName}</td>
                <td className="p-3 text-[#333] text-sm">{participant.email}</td>
                <td className="p-3 text-[#333] text-sm">{participant.gender}</td>
                <td className="p-3 text-[#333] text-sm">{participant.phone}</td>
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
                  <button className="flex items-center gap-2 text-sm text-[#333]">
                    Voir plus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantsSection;