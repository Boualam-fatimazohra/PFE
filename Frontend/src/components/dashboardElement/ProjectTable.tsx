import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  interface ProjectItem {
    title: string;
    student: string;
    status: string;
  }
  
  interface ProjectTableProps {
    data: ProjectItem[];
  }
  
  const ProjectTable = ({ data }: ProjectTableProps) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Projet</TableHead>
          <TableHead>Étudiant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((project, index) => (
          <TableRow key={index}>
            <TableCell>{project.title}</TableCell>
            <TableCell>{project.student}</TableCell>
            <TableCell>{project.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
   // Composant helper pour le statut
   const StatusBadge = ({ status }: { status: ProjectItem["status"] }) => {
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
  
  export default ProjectTable;
  