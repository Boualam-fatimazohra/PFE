import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, Users, Search, Plus, 
  PieChart, Briefcase 
} from "lucide-react";

// Existing Data Models
interface Beneficiaire {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  projet?: string;
  domaine: string;
  statut: 'En Cours' | 'Terminé' | 'Abandonné';
  dateInscription: string;
}

interface Projet {
  id: string;
  titre: string;
  entreprise: string;
  domaine: string;
  statut: 'Planification' | 'En Cours' | 'Livré' | 'En Attente';
  dateDebut: string;
  dateFin: string;
  partenairePotentiel?: string;
}

interface Partenariat {
  id: string;
  startupNom: string;
  entiteOrange: string;
  statutNegociation: 'Initial' | 'En Discussion' | 'Négociation' | 'Signé';
  dateInitiation: string;
}

const OrangeFab = () => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Données statiques enrichies
  const beneficiaires: Beneficiaire[] = [
    { 
      id: "1", 
      nom: "Dupont", 
      prenom: "Marie", 
      entreprise: "IoT Solutions",
      projet: "Système Embarqué IoT", 
      domaine: "Technologies IoT",
      statut: "En Cours",
      dateInscription: "2024-01-15"
    },
    { 
      id: "2", 
      nom: "Traore", 
      prenom: "Amadou", 
      entreprise: "TechRepair",
      projet: "Réparation Électroménager", 
      domaine: "Services Technologiques",
      statut: "En Cours",
      dateInscription: "2024-02-20"
    },
    { 
      id: "3", 
      nom: "Martin", 
      prenom: "Sophie", 
      entreprise: "CreativeMakers",
      projet: "Design Maker", 
      domaine: "Design et Innovation",
      statut: "Terminé",
      dateInscription: "2024-03-10"
    }
  ];

  const projets: Projet[] = [
    {
      id: "P1",
      titre: "Solution IoT Innovante",
      entreprise: "IoT Solutions",
      domaine: "Technologies IoT",
      statut: "En Cours",
      dateDebut: "2024-01-15",
      dateFin: "2024-07-15",
      partenairePotentiel: "Orange Business Services"
    },
    {
      id: "P2",
      titre: "Plateforme de Réparation Connectée",
      entreprise: "TechRepair",
      domaine: "Services Technologiques",
      statut: "Planification",
      dateDebut: "2024-04-01",
      dateFin: "2024-10-01",
      partenairePotentiel: "Orange Digital Center"
    }
  ];

  const partenariats: Partenariat[] = [
    {
      id: "PAR1",
      startupNom: "IoT Solutions",
      entiteOrange: "Orange Business Services",
      statutNegociation: "En Discussion",
      dateInitiation: "2024-02-01"
    },
    {
      id: "PAR2",
      startupNom: "CreativeMakers",
      entiteOrange: "Orange Innovation",
      statutNegociation: "Négociation",
      dateInitiation: "2024-03-15"
    }
  ];

  // Stats in the style of FablabSolidaire
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
      title: "Partenariats", 
      value: partenariats.filter(p => p.statutNegociation !== "Signé").length, 
      subtitle: "En Négociation", 
      icon: <PieChart size={28} color="#FF7900" /> 
    },
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">OrangeFab</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
              <Search size={16} />
              Recherche
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2">
              <Calendar size={16} />
              Planning
            </Button>
            <Link to="/nouveau-projet" className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
              <Plus size={13} className="mr-2" />
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
          {/* Bénéficiaires Table (Left Side) */}
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
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Domaine</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiaires.map((benef) => (
                    <TableRow key={benef.id}>
                      <TableCell>{benef.prenom} {benef.nom}</TableCell>
                      <TableCell>{benef.entreprise}</TableCell>
                      <TableCell>{benef.domaine}</TableCell>
                      <TableCell>
                        <StatusBadge status={benef.statut} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                          Accéder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Partenariats Table (Right Side) */}
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Partenariats
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Startup</TableHead>
                    <TableHead>Entité Orange</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partenariats.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.startupNom}</TableCell>
                      <TableCell>{part.entiteOrange}</TableCell>
                      <TableCell>
                        <StatusBadge status={part.statutNegociation} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                          Accéder
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
                    <TableHead>Entreprise</TableHead>
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
                      <TableCell>{projet.entreprise}</TableCell>
                      <TableCell>{projet.domaine}</TableCell>
                      <TableCell>{projet.dateDebut}</TableCell>
                      <TableCell>{projet.dateFin}</TableCell>
                      <TableCell>
                        <StatusBadge status={projet.statut} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                          Accéder
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

export default OrangeFab;