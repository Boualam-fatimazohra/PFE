import * as React from "react";
import { Users, ChevronDown } from "lucide-react";
import { BeneficiaireInscription } from "../types";

interface ParticipantsTableProps {
  participants: BeneficiaireInscription[] | null | undefined;
  useIcon: boolean;
  beneficiairePreferences: Record<string, { appel: boolean; email: boolean }>;
  setBeneficiairePreferences: React.Dispatch<React.SetStateAction<Record<string, { appel: boolean; email: boolean }>>>;
  setHasRegisterConfirmation: React.Dispatch<React.SetStateAction<boolean>>
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  participants,
  useIcon,
  beneficiairePreferences,
  setBeneficiairePreferences,
  setHasRegisterConfirmation
}) => {
  const isEmptyParticipants = !participants || participants.length === 0;

  // Function to update confirmation status
  const updateConfirmation = (participantId: string, type: "appel" | "email", value: boolean) => {
    setBeneficiairePreferences((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [type]: value,
      },
    }));
    setHasRegisterConfirmation(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b text-gray-700 text-sm">
            <th className="p-3 text-left">Date & Heure</th>
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Prénom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Genre</th>
            <th className="p-3 text-left">Téléphone</th>
            <th className="p-3 text-left">Conf Tél</th>
            <th className="p-3 text-left">Conf Email</th>
          </tr>
        </thead>
        <tbody>
          {isEmptyParticipants ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <Users size={48} className="text-gray-300 mb-2" />
                  <p>Aucun participant n'est inscrit à cette formation</p>
                  <p className="text-sm mt-1">Les participants s'afficheront ici une fois inscrits</p>
                </div>
              </td>
            </tr>
          ) : (
            participants.map((participant) => (
              <tr key={participant._id} className="border-b text-sm hover:bg-gray-50">
                <td className="p-3">{participant.beneficiaire.createdAt || "N/A"}</td>
                <td className="p-3">{participant.beneficiaire.nom || "N/A"}</td>
                <td className="p-3">{participant.beneficiaire.prenom || "N/A"}</td>
                <td className="p-3">{participant.beneficiaire.email || "N/A"}</td>
                <td className="p-3">{participant.beneficiaire.genre || "N/A"}</td>
                <td className="p-3">{participant.beneficiaire.telephone || "N/A"}</td>

                {/* Dropdown for Phone Confirmation */}
                <td className="p-3 relative">
                  <div className="relative w-32">
                    <select
                      value={beneficiairePreferences[participant._id]?.appel ? "confirmed" : "not-confirmed"}
                      onChange={(e) => updateConfirmation(participant._id, "appel", e.target.value === "confirmed")}
                      className={`w-full appearance-none px-2 py-1 rounded border text-sm font-semibold ${
                        beneficiairePreferences[participant._id]?.appel 
                          ? "text-green-600 border-green-500" 
                          : "text-red-600 border-red-500"
                      }`}
                    >
                      <option value="not-confirmed">Non confirmé</option>
                      <option value="confirmed">Confirmé</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </td>
                  {/*Dropdown*/}
                <td className="p-3 relative">
                  <div className="relative w-32">
                    <select
                      value={beneficiairePreferences[participant._id]?.email ? "confirmed" : "not-confirmed"}
                      onChange={(e) => updateConfirmation(participant._id, "email", e.target.value === "confirmed")}
                      className={`w-full appearance-none px-2 py-1 rounded border text-sm font-semibold ${
                        beneficiairePreferences[participant._id]?.email 
                          ? "text-green-600 border-green-500" 
                          : "text-red-600 border-red-500"
                      }`}
                    >
                      <option value="not-confirmed">Non confirmé</option>
                      <option value="confirmed">Confirmé</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsTable;