import * as React from "react";
import { Users } from "lucide-react";
import { BeneficiaireInscription } from "../types";

interface ParticipantsTableProps {
  participants: BeneficiaireInscription[] | null | undefined;
  useIcon: boolean;
  beneficiairePreferences: Record<string, { appel: boolean; email: boolean }>;
  setBeneficiairePreferences: React.Dispatch<React.SetStateAction<Record<string, { appel: boolean; email: boolean }>>>;
}

const ParticipantsTable: React.FC<ParticipantsTableProps> = ({
  participants,
  useIcon,
  beneficiairePreferences,
  setBeneficiairePreferences
}) => {
  const isEmptyParticipants = !participants || participants.length === 0;

  // Fonction pour basculer la valeur de confirmation
  const toggleConfirmation = (participantId: string, type: "appel" | "email") => {
    setBeneficiairePreferences((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [type]: !prev[participantId]?.[type],
      },
    }));
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

                {/* Confirmation Téléphone */}
                <td className="p-3">
                  <span
                    onClick={() => toggleConfirmation(participant._id, "appel")}
                    className={`font-semibold cursor-pointer ${
                      beneficiairePreferences[participant._id]?.appel ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {beneficiairePreferences[participant._id]?.appel ? "Confirmé" : "Non confirmé"}
                  </span>
                </td>

                {/* Confirmation Email */}
                <td className="p-3">
                  <span
                    onClick={() => toggleConfirmation(participant._id, "email")}
                    className={`font-semibold cursor-pointer ${
                      beneficiairePreferences[participant._id]?.email ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {beneficiairePreferences[participant._id]?.email ? "Confirmé" : "Non confirmé"}
                  </span>
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
