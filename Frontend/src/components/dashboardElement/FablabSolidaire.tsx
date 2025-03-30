import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, Users, Search, Plus, BookOpen, Star, 
  Download, User, PieChart, Award, Briefcase 
} from "lucide-react";

// Static Data Models (kept from previous version)
interface Beneficiaire {
  id: string;
  nom: string;
  prenom: string;
  projet?: string;
  bootcamp: string;
  statut: 'En Cours' | 'Terminé' | 'Abandonné';
}

interface Projet {
  id: string;
  titre: string;
  domaine: string;
  statut: 'Planification' | 'En Cours' | 'Livré' | 'En Attente';
  dateDebut: string;
  dateFin: string;
}

interface Materiel {
  id: string;
  nom: string;
  quantite: number;
  etat: 'Disponible' | 'Réservé' | 'En Réparation';
}

const FablabSolidaire = () => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Données statiques (kept from previous version)
  const beneficiaires: Beneficiaire[] = [
    { 
      id: "1", 
      nom: "Dupont", 
      prenom: "Marie", 
      projet: "Système Embarqué IoT", 
      bootcamp: "Électronique Embarquée", 
      statut: "En Cours" 
    },
    { 
      id: "2", 
      nom: "Traore", 
      prenom: "Amadou", 
      projet: "Réparation Électroménager", 
      bootcamp: "Maintenance Électronique", 
      statut: "En Cours" 
    },
    { 
      id: "3", 
      nom: "Martin", 
      prenom: "Sophie", 
      projet: "Design Maker", 
      bootcamp: "Design et Fabrication", 
      statut: "Terminé" 
    }
  ];

  const projets: Projet[] = [
    { 
      id: "P1", 
      titre: "Station Météo Connectée", 
      domaine: "Systèmes Embarqués", 
      statut: "En Cours", 
      dateDebut: "2024-03-01", 
      dateFin: "2024-06-30" 
    },
    { 
      id: "P2", 
      titre: "Atelier Réparation Vélos", 
      domaine: "Réparation", 
      statut: "Planification", 
      dateDebut: "2024-04-15", 
      dateFin: "2024-08-15" 
    }
  ];

  const materiels: Materiel[] = [
    { id: "M1", nom: "Imprimante 3D", quantite: 2, etat: "Disponible" },
    { id: "M2", nom: "Kit Arduino", quantite: 10, etat: "Disponible" },
    { id: "M3", nom: "Oscilloscope", quantite: 1, etat: "Réservé" }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case "En Cours":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "Terminé":
          return "bg-[#E6F7EA] text-[#00C31F]";
        case "Abandonné":
          return "bg-[#F5F5F5] text-[#4D4D4D]";
        case "Planification":
          return "bg-[#F2E7FF] text-[#9C00C3]";
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

  const stats = [
    { 
      title: "Bénéficiaires", 
      value: beneficiaires.length, 
      subtitle: "Total Inscrits", 
      icon: <Users size={28} color="#FF7900" /> 
    },
    { 
      title: "Projets Actifs", 
      value: projets.filter(p => p.statut === "En Cours").length, 
      subtitle: "En Cours", 
      icon: <Briefcase size={28} color="#FF7900" /> 
    },
    { 
      title: "Matériels", 
      value: materiels.filter(m => m.etat === "Disponible").length, 
      subtitle: "Disponibles", 
      icon: <PieChart size={28} color="#FF7900" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">FabLab Solidaire</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
              <Search size={16} />
              Recherche
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2">
              <Calendar size={16} />
              Planning
            </Button>
            <Link to="/nouveau-projet" className="bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
              Nouveau Projet
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-[4px] border border-gray-200 flex items-start">
              <div className="bg-[#FF79001A] p-3 rounded-full flex items-center justify-center mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-2 gap-6">
          {/* Matériels Table (Left Side) */}
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Inventaire Matériel
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Ajouter Matériel
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiels.map((materiel) => (
                    <TableRow key={materiel.id}>
                      <TableCell>{materiel.nom}</TableCell>
                      <TableCell>{materiel.quantite}</TableCell>
                      <TableCell>
                        <StatusBadge status={materiel.etat} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Award size={16} className="mr-2" /> Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Bénéficiaires Table (Right Side) */}
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Liste des Bénéficiaires
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Bootcamp</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiaires.map((benef) => (
                    <TableRow key={benef.id}>
                      <TableCell>{benef.prenom} {benef.nom}</TableCell>
                      <TableCell>{benef.projet || 'Non assigné'}</TableCell>
                      <TableCell>{benef.bootcamp}</TableCell>
                      <TableCell>
                        <StatusBadge status={benef.statut} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          <BookOpen size={16} className="mr-2" /> Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Projets Table (Bottom) */}
        <div className="mt-6">
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Projets en Cours
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Nouveau Projet
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Date Début</TableHead>
                    <TableHead>Date Fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projets.map((projet) => (
                    <TableRow key={projet.id}>
                      <TableCell>{projet.titre}</TableCell>
                      <TableCell>{projet.domaine}</TableCell>
                      <TableCell>{projet.dateDebut}</TableCell>
                      <TableCell>{projet.dateFin}</TableCell>
                      <TableCell>
                        <StatusBadge status={projet.statut} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2">
                          <Star size={16} className="mr-2" /> Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FablabSolidaire;