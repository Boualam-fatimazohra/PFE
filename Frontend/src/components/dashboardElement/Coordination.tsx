import  { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, Users, Search, Plus, BookOpen, Star, 
  Download, User, PieChart, Award, Briefcase, 
  MapPin, Clock, Plane, Video, Home, 
  Briefcase as BriefcaseIcon, 
  File,
  Clipboard
} from "lucide-react";

// Interfaces for data structures
interface Event {
  id: string;
  titre: string;
  type: 'Gitex' | 'Formation' | 'Intervention' | 'Visite' | 'Tournage';
  date: string;
  statut: 'Planifié' | 'En Cours' | 'Terminé';
}

interface Absence {
  id: string;
  nom: string;
  prenom: string;
  type: 'Télétravail' | 'Congés' | 'Déplacement' | 'Missions' | 'Maladie';
  dateDebut: string;
  dateFin: string;
}

interface Espace {
  id: string;
  nom: string;
  type: 'Coworking' | 'Salle Formation' | 'Bureau';
  occupation: number;
  capacite: number;
}

interface DemandeAutorisation {
  id: string;
  demandeur: string;
  role: 'Formateur' | 'Manager' | 'Coordinateur';
  type: 'Fournitures' | 'Déplacement' | 'Formation';
  statut: 'En Attente' | 'Approuvé' | 'Rejeté';
}

const Coordination = () => {
  // Données statiques pour démonstration
  const events: Event[] = [
    { 
      id: "E1", 
      titre: "Gitex Technology Week", 
      type: "Gitex", 
      date: "2024-10-15", 
      statut: "Planifié" 
    },
    { 
      id: "E2", 
      titre: "Formation Data Science", 
      type: "Formation", 
      date: "2024-09-20", 
      statut: "Planifié" 
    },
    { 
      id: "E3", 
      titre: "Intervention Startup Ecosystem", 
      type: "Intervention", 
      date: "2024-08-10", 
      statut: "En Cours" 
    }
  ];

  const absences: Absence[] = [
    { 
      id: "A1", 
      nom: "Dupont", 
      prenom: "Marie", 
      type: "Télétravail", 
      dateDebut: "2024-08-01", 
      dateFin: "2024-08-05" 
    },
    { 
      id: "A2", 
      nom: "Martin", 
      prenom: "Julien", 
      type: "Congés", 
      dateDebut: "2024-09-15", 
      dateFin: "2024-09-30" 
    }
  ];

  const espaces: Espace[] = [
    { 
      id: "ES1", 
      nom: "Espace Coworking Principal", 
      type: "Coworking", 
      occupation: 18, 
      capacite: 30 
    },
    { 
      id: "ES2", 
      nom: "Salle de Formation A", 
      type: "Salle Formation", 
      occupation: 12, 
      capacite: 20 
    }
  ];

  const demandesAutorisation: DemandeAutorisation[] = [
    { 
      id: "DA1", 
      demandeur: "Sophie Dupont", 
      role: "Formateur", 
      type: "Fournitures", 
      statut: "En Attente" 
    },
    { 
      id: "DA2", 
      demandeur: "Thomas Martin", 
      role: "Manager", 
      type: "Déplacement", 
      statut: "Approuvé" 
    }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case "Planifié":
          return "bg-[#F2E7FF] text-[#9C00C3]";
        case "En Cours":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "Terminé":
          return "bg-[#E6F7EA] text-[#00C31F]";
        case "En Attente":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "Approuvé":
          return "bg-[#E6F7EA] text-[#00C31F]";
        case "Rejeté":
          return "bg-[#FFE5E5] text-[#FF0000]";
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
          <h1 className="text-3xl font-bold">Coordination Dashboard</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
              <Search size={16} />
              Recherche
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2">
              <Calendar size={16} />
              Calendrier
            </Button>
            <Link to="/nouvelle-coordination" className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
              <Plus size={13} className="mr-2" />
              Nouvelle Action
            </Link>
          </div>
        </div>

        {/* Gestion des Événements */}
        <Card className="mb-6 border-gray-200 rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar size={24} className="mr-2 text-orange-500" />
                Gestion des Événements
              </div>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-2" /> Ajouter Événement
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#EBEBEB]">
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.titre}</TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={event.statut} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Grid for Gestion des Espaces et Absences */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Gestion des Espaces */}
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Home size={24} className="mr-2 text-orange-500" />
                  Gestion des Espaces
                </div>
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Gérer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {espaces.map((espace) => (
                    <TableRow key={espace.id}>
                      <TableCell>{espace.nom}</TableCell>
                      <TableCell>{espace.type}</TableCell>
                      <TableCell>
                        {espace.occupation} / {espace.capacite}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Gestion des Absences */}
          <Card className="border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clipboard size={24} className="mr-2 text-orange-500" />
                  Gestion des Absences
                </div>
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" /> Déclarer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {absences.map((absence) => (
                    <TableRow key={absence.id}>
                      <TableCell>{absence.prenom} {absence.nom}</TableCell>
                      <TableCell>{absence.type}</TableCell>
                      <TableCell>
                        {absence.dateDebut} - {absence.dateFin}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Gestion des Demandes d'Autorisation */}
        <Card className="border-gray-200 rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center">
                <File size={24} className="mr-2 text-orange-500" />
                Gestion des Demandes d'Autorisation
              </div>
              <Button variant="outline" size="sm">
                <Plus size={16} className="mr-2" /> Nouvelle Demande
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#EBEBEB]">
                <TableRow>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandesAutorisation.map((demande) => (
                  <TableRow key={demande.id}>
                    <TableCell>{demande.demandeur}</TableCell>
                    <TableCell>{demande.role}</TableCell>
                    <TableCell>{demande.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={demande.statut} />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="mr-2 bg-orange-500 text-white">
                        Traiter
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
  );
};

export default Coordination;