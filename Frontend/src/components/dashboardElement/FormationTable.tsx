import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormations } from "../../contexts/FormationContext";

export interface FormationTableItem {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin?: string;
  status: string;
  image?: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateString; 
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    "En Cours": "bg-orange-100 text-orange-700",
    "Terminer": "bg-green-100 text-green-700",
    "Terminé": "bg-green-100 text-green-700",
    "Replanifier": "bg-gray-100 text-gray-700",
    "Avenir": "bg-red-100 text-red-700", 
  };
  
  const badgeStyle = statusStyles[status] || "bg-red-100 text-red-700";
 
  return (
    <span className={`px-4 py-1 text-sm rounded-full min-w-[90px] text-center inline-block ${badgeStyle}`}>
      {status}
    </span>
  );
};

interface FormationsTableProps {
  formations?: FormationTableItem[];
  onAccessClick: (formation: FormationTableItem) => void;
}

export const FormationsTable = ({ formations: propFormations, onAccessClick }: FormationsTableProps) => {
  const formationsContext = useFormations();
  const loading = formationsContext.loading;
  
  const contextFormations = formationsContext.formations as unknown as FormationTableItem[];
  const formations = propFormations || contextFormations;
 
  if (loading && !propFormations) {
    return <p>Chargement des formations...</p>;
  }
 
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
          {formations
            .filter((formation: FormationTableItem) =>
              ["En Cours", "Terminer", "Terminé", "Replanifier", "Avenir"].includes(formation.status)
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
                    className="bg-black text-white px-3 py-1 rounded-none text-sm"
                    onClick={() => onAccessClick(formation)}
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