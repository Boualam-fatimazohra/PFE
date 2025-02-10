import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  interface EquipmentItem {
    name: string;
    quantity: number;
    status: "Disponible" | "Indisponible";
  }
  
  interface EquipmentListProps {
    data: EquipmentItem[];
  }
  
  const EquipmentList = ({ data }: EquipmentListProps) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Équipement</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((equipment, index) => (
          <TableRow key={index}>
            <TableCell>{equipment.name}</TableCell>
            <TableCell>{equipment.quantity}</TableCell>
            <TableCell>{equipment.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
   // Composant helper pour le statut
   const StatusBadge = ({ status }: { status: EquipmentItem["status"] }) => {
    const statusStyles = {
      "Indisponible": "bg-orange-100 text-orange-700",
      "Disponible": "bg-green-100 text-green-700",
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };
  
  export default EquipmentList;
  