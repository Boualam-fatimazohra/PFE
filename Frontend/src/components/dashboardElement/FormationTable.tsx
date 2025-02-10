import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  interface FormationItem {
    title: string;
    date: string;
    status: "En Cours" | "Terminer" | "Replanifier";
  }
  
  interface FormationsTableProps {
    data: FormationItem[];
  }
  
  export const FormationsTable = ({ data }: FormationsTableProps) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((formation, index) => (
          <TableRow key={index}>
            <TableCell>{formation.title}</TableCell>
            <TableCell>{formation.date}</TableCell>
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
  
  // Composant helper pour le statut
  const StatusBadge = ({ status }: { status: FormationItem["status"] }) => {
    const statusStyles = {
      "En Cours": "bg-orange-100 text-orange-700",
      "Terminer": "bg-green-100 text-green-700",
      "Replanifier": "bg-gray-100 text-gray-700"
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };