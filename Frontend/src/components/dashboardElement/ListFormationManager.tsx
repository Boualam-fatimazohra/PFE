import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ChevronRight, ChevronLeft, Filter, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// Interface for Formation
interface Formation {
  id: number;
  title: string;
  formateur: string;
  dateDebut: string;
  dateFin: string;
  ville: string;
  status: 'En cours' | 'Terminé' | 'À venir';
  odc: string;
}

const ListFormationManager: React.FC = () => {
  const navigate = useNavigate();

  // Sample data matching the screenshot
  const [formations, setFormations] = useState<Formation[]>([
    {
      id: 1,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 2,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 3,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 4,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 5,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 6,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 7,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    },
    {
      id: 8,
      title: 'AWS : Développement, déploiement et gestion',
      formateur: 'Mohamed Bika...',
      dateDebut: '15 Mars 2025',
      dateFin: '17 Mars 2025',
      ville: 'ODC Agadir',
      status: 'En cours',
      odc: 'ODC Agadir'
    }
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'text-orange-500 bg-orange-100';
      case 'Terminé': return 'text-green-500 bg-green-100';
      case 'À venir': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="bg-white p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Listes des Formations</h1>
        <div className="flex space-x-2">
        <Button  
          size="sm" 
          className="flex items-center bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => navigate("/manager/GestionFormation")} // 🔥 Ajout de la redirection
        >
          Calendrier Formations
        </Button>
          <Button 
            size="sm" 
            className="flex items-center bg-black hover:bg-orange-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Créer un événement
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-gray-600 font-medium">Titre Formation</TableHead>
            <TableHead className="text-gray-600 font-medium">Formateur</TableHead>
            <TableHead className="text-gray-600 font-medium">Date Début</TableHead>
            <TableHead className="text-gray-600 font-medium">Date Fin</TableHead>
            <TableHead className="text-gray-600 font-medium">Ville</TableHead>
            <TableHead className="text-gray-600 font-medium">Status</TableHead>
            <TableHead className="text-gray-600 font-medium">ODC</TableHead>
            <TableHead className="text-gray-600 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formations.map((formation) => (
            <TableRow key={formation.id} className="hover:bg-gray-50">
              <TableCell className="text-gray-800">{formation.title}</TableCell>
              <TableCell className="text-gray-800">{formation.formateur}</TableCell>
              <TableCell className="text-gray-800">{formation.dateDebut}</TableCell>
              <TableCell className="text-gray-800">{formation.dateFin}</TableCell>
              <TableCell className="text-gray-800">{formation.ville}</TableCell>
              <TableCell>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formation.status)}`}
                >
                  {formation.status}
                </span>
              </TableCell>
              <TableCell className="text-gray-800">{formation.odc}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2 text-orange-500 border-orange-500 hover:bg-orange-50"
                  onClick={() => navigate("/manager/GestionFormation")}
                >
                  Accéder
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">Page {currentPage}</span>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-300"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-600 border-gray-300"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ListFormationManager;