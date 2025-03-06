import * as React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormations } from "../../contexts/FormationContext";

// Import the types from your types file
import { FormationStatus, FormationItem } from "@/pages/types";
import DetailsFormation from "@/components/dashboardElement/DetailsFormation";
import {FormationAvenir } from "@/pages/FormationAvenir";
import FormationTerminer from "@/pages/FormationTerminer";

export interface FormationTableItem {
  _id?: string;
  id?: string;
  title?: string; 
  nom?: string;
  description?: string | null;
  status: "En Cours" | "Avenir" | "Terminé" | "Replanifier";
  image?: string;
  dateDebut: string;
  dateFin?: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusClass = () => {
    switch (status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900]";
      case "Avenir":
        return "bg-[#F2E7FF] text-[#9C00C3]";
      case "Terminé":
        return "bg-[#E6F7EA] text-[#00C31F]";
      case "Replanifier":
        return "bg-[#F5F5F5] text-[#4D4D4D]"; 
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={`px-4 py-1 text-sm rounded-full min-w-[90px] text-center inline-block ${getStatusClass()}`}>
      {status}
    </span>
  );
};

interface FormationsTableProps {
  formations?: FormationTableItem[];
  onAccessClick?: (formation: FormationItem) => void;
  onShowDetails?: (formation: FormationItem) => void;
}

export const FormationsTable: React.FC<FormationsTableProps> = ({ 
  formations: propFormations,
  onShowDetails 
}) => {
  const [selectedFormation, setSelectedFormation] = useState<FormationTableItem | null>(null);
  const { formations: contextFormations, loading } = useFormations();
  const formationsToDisplay = propFormations || contextFormations;

  if (loading && !propFormations) {
    return <p>Chargement des formations...</p>;
  }

  if (!formationsToDisplay || formationsToDisplay.length === 0) {
    return <p className="text-center py-4 text-gray-500">Aucune formation trouvée</p>;
  }
 
  const handleAccessClick = (formation: FormationTableItem) => {
    const formationItem: FormationItem = {
      id: formation._id || formation.id, 
      title: formation.title || formation.nom, 
      status: formation.status as FormationStatus, 
      image: formation.image || '', 
      dateDebut: formation.dateDebut,
      dateFin: formation.dateFin 
    };
    
    // If onShowDetails prop is provided, use it
    if (onShowDetails) {
      onShowDetails(formationItem);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#EBEBEB]">
          <TableRow>
            <TableHead className="font-bold text-black">Titre</TableHead>
            <TableHead className="font-bold text-black">Date</TableHead>
            <TableHead className="font-bold text-black">Status</TableHead>
            <TableHead className="font-bold text-black">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formationsToDisplay
            .filter((formation: FormationTableItem) =>
              ["En Cours", "Terminé", "Replanifier", "Avenir"].includes(formation.status)
            )
            .slice(-8) 
            .map((formation: FormationTableItem) => (
              <TableRow key={formation._id} className="border-b">
                <TableCell className="py-3">{formation.nom}</TableCell>
                <TableCell>{formatDate(formation.dateDebut)}</TableCell>
                <TableCell>
                  <StatusBadge status={formation.status} />
                </TableCell>
                <TableCell>
                  <button
                    className="bg-black text-white px-3 py-1 rounded-[4px] text-sm"
                    onClick={() => handleAccessClick(formation)}
                  >
                    Accéder
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};