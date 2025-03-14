// src/components/formation-modal/sections/ParticipantsTable.tsx
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Participant } from "../types";

interface ParticipantsTableProps {
  participants: Participant[];
  useIcon: boolean;
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  participants,
  useIcon
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b text-gray-700 text-sm">
            <th className="w-6 p-3">
              <input type="checkbox" className="rounded" />
            </th>
            <th className="p-3 text-left">Date & Heure</th>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Genre</th>
            <th className="p-3 text-left">Téléphone</th>
            <th className="p-3 text-left">Conf Tél</th>
            <th className="p-3 text-left">Conf Email</th>
            <th className="w-8"></th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant, index) => (
            <tr key={index} className="border-b text-sm hover:bg-gray-50">
              <td className="p-3">
                <input type="checkbox" className="rounded" />
              </td>
              <td className="p-3">{participant.date}</td>
              <td className="p-3">{participant.nom}</td>
              <td className="p-3">{participant.prenom}</td>
              <td className="p-3">{participant.email}</td>
              <td className="p-3">{participant.genre}</td>
              <td className="p-3">{participant.telephone}</td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-semibold ${
                      participant.confTel === "Confirmé (e)"
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {participant.confTel}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-semibold ${
                      participant.confEmail === "Confirmé (e)"
                        ? "text-green-500"
                        : "text-orange-500"
                    }`}
                  >
                    {participant.confEmail}
                  </span>
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </td>
              <td className="p-3">
                <button className="text-black hover:text-gray-600">
                  {useIcon ? (
                    <ChevronRight size={20} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.0629 18.0114C12.7967 18.2286 12.4856 18.3375 12.1305 18.3375C11.7695 18.3375 11.4544 18.2301 11.1851 18.0153C10.9159 17.8007 10.7812 17.5006 10.7812 17.1148C10.7812 16.7778 10.9098 16.491 11.1672 16.2545C11.4247 16.0182 11.7401 15.9 12.1129 15.9C12.4856 15.9 12.8039 16.0182 13.0674 16.2545C13.3307 16.491 13.4625 16.7778 13.4625 17.1148C13.4625 17.4951 13.3293 17.7941 13.0629 18.0114ZM11.1672 6.04998C11.4113 5.80199 11.7313 5.67522 12.1219 5.6625C12.5122 5.67522 12.8322 5.80199 13.0763 6.04998C13.3335 6.31157 13.4625 6.67601 13.4625 7.14326C13.4625 7.48635 12.9563 13.7974 12.8322 14.0534C12.7077 14.3096 12.4857 14.4375 12.166 14.4375C12.1501 14.4375 12.1374 14.4331 12.1219 14.4323C12.1064 14.4331 12.0932 14.4375 12.0775 14.4375C11.7578 14.4375 11.5359 14.3096 11.4116 14.0534C11.2871 13.7974 10.7812 7.48635 10.7812 7.14326C10.7812 6.67601 10.9098 6.31157 11.1672 6.04998ZM12 2.25C6.61522 2.25 2.25 6.61525 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61525 17.3848 2.25 12 2.25Z" fill="#FFCD0B"/>
                    </svg>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsTable;