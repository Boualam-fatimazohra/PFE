import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormations } from "../../contexts/FormationContext";

interface Formation {
  _id: string;
  title: string;
  dateDebut: string;
  dateFin: string;
  status: "En Cours" | "Terminer" | "Replanifier";
}

export const FormationsTable = () => {
  const { formations, loading } = useFormations();

  if (loading) {
    return <p>Chargement des formations...</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Date Début</TableHead>
          <TableHead>Date Fin</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formations.map((formation: Formation, index: number) => (
          <TableRow key={index}>
            <TableCell>{formation.title}</TableCell>
            <TableCell>{formation.dateDebut}</TableCell>
            <TableCell>{formation.dateFin}</TableCell>
            <TableCell>
              <StatusBadge status={formation.status} />
            </TableCell>
            <TableCell>
              <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                Accéder
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Composant helper pour le statut
const StatusBadge = ({ status }: { status: Formation["status"] }) => {
  const statusStyles = {
    "En Cours": "bg-orange-100 text-orange-700",
    "Terminer": "bg-green-100 text-green-700",
    "Replanifier": "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
      {status}
    </span>
  );
};
