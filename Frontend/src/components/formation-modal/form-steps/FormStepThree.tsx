// src/components/formation-modal/form-steps/FormStepThree.tsx
import * as React from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import ParticipantSearchBar from "../sections/ParticipantSearchBar";
import ParticipantsTable from "../sections/ParticipantsTable";
import { BeneficiaireInscription} from "../types";
import {exportBeneficiairesToExcel} from "../../../services/beneficiaireService";
import { toast } from "react-toastify";
interface FormStepThreeProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  participants: BeneficiaireInscription[];
  useIcon: boolean;
  beneficiairePreferences: Record<string, { appel: boolean; email: boolean }>;
  setBeneficiairePreferences: React.Dispatch<React.SetStateAction<Record<string, { appel: boolean; email: boolean }>>>;
  formationId: string; // Nouvelle prop nécessaire
}

const FormStepThree: React.FC<FormStepThreeProps> = ({
  searchQuery,
  setSearchQuery,
  participants,
  useIcon,
  beneficiairePreferences,
  setBeneficiairePreferences,
  formationId,
}) => {
  const handleExportPresence = async () => {
    try {
      if (!formationId) {
        toast.error('Aucune formation sélectionnée');
        return;
      }

      const { blob, filename } = await exportBeneficiairesToExcel(formationId);
      
      // Création d'un lien temporaire pour le téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();

    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'export');
      console.error('Export error:', error);
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 w-full h-auto">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Liste de confirmation</h2>
        <div className="flex flex-col gap-4 w-full">
          {/* Barre de recherche avec filtre */}
          <ParticipantSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        
        {/* Bouton Générer liste en dessous */}
        <div className="flex justify-end">
          <button 
            onClick={handleExportPresence}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Download size={20} />
            Générer liste présence
          </button>
        </div>
        
        <ParticipantsTable 
          participants={participants}
          useIcon={useIcon}
          beneficiairePreferences={beneficiairePreferences}
          setBeneficiairePreferences={setBeneficiairePreferences}
          
        />

        <div className="flex justify-center items-center gap-2 mt-4">
          <button className="p-1 border rounded">
            <ChevronLeft size={20} />
          </button>
          <button className="px-3 py-1 bg-gray-900 text-white rounded">1</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">3</button>
          <button className="p-1 border rounded">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormStepThree;