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
    type: string;
  }
  
  interface AchatTableProps {
    data: FormationItem[];
  }
  
  export const AchatTable = ({ data }: AchatTableProps) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((formation, index) => (
          <TableRow key={index}>
            <TableCell>{formation.title}</TableCell>
            <TableCell>{formation.type}</TableCell>
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
  
