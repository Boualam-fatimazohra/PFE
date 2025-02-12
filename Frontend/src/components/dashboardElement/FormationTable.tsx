// 📌 Importation des composants et du contexte
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormations } from "../../contexts/FormationContext";

// 📌 Interface des formations
interface Formation {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  status: string;
}

// 📌 Composant principal de la table des formations
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
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {formations.map((formation: Formation) => (
          <TableRow key={formation._id}>
            <TableCell>{formation.nom}</TableCell>
            <TableCell>{formation.dateDebut}</TableCell>
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

// 📌 Composant helper pour afficher le statut avec un badge stylisé
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    "En Cours": "bg-orange-100 text-orange-700",
    "Terminer": "bg-green-100 text-green-700",
    "Replanifier": "bg-gray-100 text-gray-700",
  };

  // ✅ Si le statut est inconnu, on applique un style par défaut
  const badgeStyle = statusStyles[status] || "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${badgeStyle}`}>
      {status}
    </span>
  );
};
