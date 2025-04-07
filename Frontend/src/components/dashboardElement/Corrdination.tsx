import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, Users, Search, Plus, BookOpen, Star, 
  Download, User, PieChart, Award, Briefcase, 
  MapPin, Clock, Plane, Video, Home, 
  Briefcase as BriefcaseIcon, 
  File,
  Clipboard,
  FileText,
  ShoppingCart,
  ClipboardCheck,
  Users as GroupsIcon,
  BarChart2,
  Mail,
  Settings
} from "lucide-react";

// Interfaces for data structures
interface Formation {
  id: string;
  titre: string;
  type: 'Atelier' | 'Formation' | 'Bootcamp';
  dateDebut: string;
  dateFin: string;
  formateur: string;
  statut: 'Planifié' | 'En Cours' | 'Terminé';
}

interface Participant {
  id: string;
  nom: string;
  prenom: string;
  formation: string;
  presence: number;
  evaluation: number;
  statut: 'Inscrit' | 'Participant' | 'Abandon' | 'Certifié';
}

interface Rapport {
  id: string;
  type: 'Mensuel' | 'Trimestriel' | 'Semestriel' | 'Annuel';
  periode: string;
  statut: 'En Préparation' | 'Validé' | 'Publié';
  createur: string;
}

interface DemandeAchat {
  id: string;
  numero: string;
  dateCreation: string;
  etatDA: 'Validation SM' | 'Validation Direction' | 'Validé';
  affectation: 'Yassine' | 'Nasser';
  etatBC: 'Référencement' | 'Signature' | 'Signé';
  etatPrestation: 'En Cours' | 'Terminé';
  etatPVR: 'En Attente' | 'Validé';
  datePaiement: string;
  etatPaiement: 'En Attente' | 'Payé';
}

interface Convention {
  id: string;
  partenaire: string;
  type: 'Formation' | 'Partenariat' | 'Événement';
  etat: 'Signature Orange' | 'Signature Partenaire' | 'Signée';
  dateSignature: string;
}

interface Espace {
  id: string;
  nom: string;
  type: 'Coworking' | 'Salle Formation' | 'Bureau' | 'FabLab';
  occupation: number;
  capacite: number;
  maintenance: 'OK' | 'En Cours' | 'Nécessaire';
}

const Coordination = () => {
  // Sample data for formations
  const [formations, setFormations] = useState<Formation[]>([
    { 
      id: "F1", 
      titre: "Data Science Bootcamp", 
      type: "Bootcamp", 
      dateDebut: "2024-09-01", 
      dateFin: "2024-12-15",
      formateur: "Hemza Lambara",
      statut: "Planifié",
    },
    { 
      id: "F2", 
      titre: "Introduction à l'IA", 
      type: "Formation", 
      dateDebut: "2024-08-15", 
      dateFin: "2024-08-18",
      formateur: "Mehdi idouch",
      statut: "En Cours",
    },
    { 
      id: "F3", 
      titre: "Atelier IoT", 
      type: "Atelier", 
      dateDebut: "2024-07-10", 
      dateFin: "2024-07-10",
      formateur: "Mohamed Bikarran",
      statut: "Terminé",
    }
  ]);
  const quickStats = [
    {
      title: "Formations en cours",
      value: 5,
      subtitle: "+2 depuis la semaine dernière",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="33" height="26" viewBox="0 0 33 26" fill="none"><g clip-path="url(#clip0_865_2062)"><path d="M7.3125 0C8.38994 0 9.42325 0.428012 10.1851 1.18988C10.947 1.95175 11.375 2.98506 11.375 4.0625C11.375 5.13994 10.947 6.17325 10.1851 6.93512C9.42325 7.69699 8.38994 8.125 7.3125 8.125C6.23506 8.125 5.20175 7.69699 4.43988 6.93512C3.67801 6.17325 3.25 5.13994 3.25 4.0625C3.25 2.98506 3.67801 1.95175 4.43988 1.18988C5.20175 0.428012 6.23506 0 7.3125 0ZM26 0C27.0774 0 28.1108 0.428012 28.8726 1.18988C29.6345 1.95175 30.0625 2.98506 30.0625 4.0625C30.0625 5.13994 29.6345 6.17325 28.8726 6.93512C28.1108 7.69699 27.0774 8.125 26 8.125C24.9226 8.125 23.8892 7.69699 23.1274 6.93512C22.3655 6.17325 21.9375 5.13994 21.9375 4.0625C21.9375 2.98506 22.3655 1.95175 23.1274 1.18988C23.8892 0.428012 24.9226 0 26 0ZM0 15.1684C0 12.1773 2.42734 9.75 5.41836 9.75H7.58672C8.39414 9.75 9.16094 9.92773 9.85156 10.2426C9.78555 10.6082 9.75508 10.9891 9.75508 11.375C9.75508 13.3148 10.6082 15.0566 11.9539 16.25C11.9437 16.25 11.9336 16.25 11.9184 16.25H1.08164C0.4875 16.25 0 15.7625 0 15.1684ZM20.5816 16.25C20.5715 16.25 20.5613 16.25 20.5461 16.25C21.8969 15.0566 22.7449 13.3148 22.7449 11.375C22.7449 10.9891 22.7094 10.6133 22.6484 10.2426C23.3391 9.92266 24.1059 9.75 24.9133 9.75H27.0816C30.0727 9.75 32.5 12.1773 32.5 15.1684C32.5 15.7676 32.0125 16.25 31.4184 16.25H20.5816ZM11.375 11.375C11.375 10.0821 11.8886 8.84209 12.8029 7.92785C13.7171 7.01361 14.9571 6.5 16.25 6.5C17.5429 6.5 18.7829 7.01361 19.6971 7.92785C20.6114 8.84209 21.125 10.0821 21.125 11.375C21.125 12.6679 20.6114 13.9079 19.6971 14.8221C18.7829 15.7364 17.5429 16.25 16.25 16.25C14.9571 16.25 13.7171 15.7364 12.8029 14.8221C11.8886 13.9079 11.375 12.6679 11.375 11.375ZM6.5 24.6441C6.5 20.9066 9.53164 17.875 13.2691 17.875H19.2309C22.9684 17.875 26 20.9066 26 24.6441C26 25.3906 25.3957 26 24.6441 26H7.85586C7.10938 26 6.5 25.3957 6.5 24.6441Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2062"><path d="M0 0H32.5V26H0V0Z" fill="white"/></clipPath></defs></svg> ,
    },
    {
      title: "Participants actifs",
      value: 127,
      subtitle: "+15% vs mois dernier",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="33" height="26" viewBox="0 0 33 26" fill="none"><g clip-path="url(#clip0_865_2062)"><path d="M7.3125 0C8.38994 0 9.42325 0.428012 10.1851 1.18988C10.947 1.95175 11.375 2.98506 11.375 4.0625C11.375 5.13994 10.947 6.17325 10.1851 6.93512C9.42325 7.69699 8.38994 8.125 7.3125 8.125C6.23506 8.125 5.20175 7.69699 4.43988 6.93512C3.67801 6.17325 3.25 5.13994 3.25 4.0625C3.25 2.98506 3.67801 1.95175 4.43988 1.18988C5.20175 0.428012 6.23506 0 7.3125 0ZM26 0C27.0774 0 28.1108 0.428012 28.8726 1.18988C29.6345 1.95175 30.0625 2.98506 30.0625 4.0625C30.0625 5.13994 29.6345 6.17325 28.8726 6.93512C28.1108 7.69699 27.0774 8.125 26 8.125C24.9226 8.125 23.8892 7.69699 23.1274 6.93512C22.3655 6.17325 21.9375 5.13994 21.9375 4.0625C21.9375 2.98506 22.3655 1.95175 23.1274 1.18988C23.8892 0.428012 24.9226 0 26 0ZM0 15.1684C0 12.1773 2.42734 9.75 5.41836 9.75H7.58672C8.39414 9.75 9.16094 9.92773 9.85156 10.2426C9.78555 10.6082 9.75508 10.9891 9.75508 11.375C9.75508 13.3148 10.6082 15.0566 11.9539 16.25C11.9437 16.25 11.9336 16.25 11.9184 16.25H1.08164C0.4875 16.25 0 15.7625 0 15.1684ZM20.5816 16.25C20.5715 16.25 20.5613 16.25 20.5461 16.25C21.8969 15.0566 22.7449 13.3148 22.7449 11.375C22.7449 10.9891 22.7094 10.6133 22.6484 10.2426C23.3391 9.92266 24.1059 9.75 24.9133 9.75H27.0816C30.0727 9.75 32.5 12.1773 32.5 15.1684C32.5 15.7676 32.0125 16.25 31.4184 16.25H20.5816ZM11.375 11.375C11.375 10.0821 11.8886 8.84209 12.8029 7.92785C13.7171 7.01361 14.9571 6.5 16.25 6.5C17.5429 6.5 18.7829 7.01361 19.6971 7.92785C20.6114 8.84209 21.125 10.0821 21.125 11.375C21.125 12.6679 20.6114 13.9079 19.6971 14.8221C18.7829 15.7364 17.5429 16.25 16.25 16.25C14.9571 16.25 13.7171 15.7364 12.8029 14.8221C11.8886 13.9079 11.375 12.6679 11.375 11.375ZM6.5 24.6441C6.5 20.9066 9.53164 17.875 13.2691 17.875H19.2309C22.9684 17.875 26 20.9066 26 24.6441C26 25.3906 25.3957 26 24.6441 26H7.85586C7.10938 26 6.5 25.3957 6.5 24.6441Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2062"><path d="M0 0H32.5V26H0V0Z" fill="white"/></clipPath></defs></svg> ,
    },
    {
      title: "Taux de satisfaction",
      value: "4.5/5",
      subtitle: "Moyenne sur 12 formations",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 25" fill="none"><g clip-path="url(#clip0_1137_10875)"><path d="M14.8438 11.7188V0.810547C14.8438 0.371094 15.1855 0 15.625 0C21.665 0 26.5625 4.89746 26.5625 10.9375C26.5625 11.377 26.1914 11.7188 25.752 11.7188H14.8438ZM1.5625 13.2812C1.5625 7.3584 5.96191 2.45605 11.6699 1.6748C12.1191 1.61133 12.5 1.97266 12.5 2.42676V14.0625L20.1416 21.7041C20.4688 22.0312 20.4443 22.5684 20.0684 22.832C18.1543 24.1992 15.8105 25 13.2812 25C6.81152 25 1.5625 19.7559 1.5625 13.2812ZM27.2656 14.0625C27.7197 14.0625 28.0762 14.4434 28.0176 14.8926C27.6416 17.6221 26.3281 20.0488 24.4092 21.8408C24.1162 22.1143 23.6572 22.0947 23.374 21.8066L15.625 14.0625H27.2656Z" fill="#FF7900"/></g><defs><clipPath id="clip0_1137_10875"><path d="M0 0H28.125V25H0V0Z" fill="white"/></clipPath></defs></svg>
    },
    {
      title: "DA en attente",
      value: 8,
      subtitle: "3 nécessitent une action urgente",
      icon: <ShoppingCart className="h-4 w-4 text-orange-500" />,
    },
  ];
  
  // Sample data for participants
  const [participants, setParticipants] = useState<Participant[]>([
    { 
      id: "P1", 
      nom: "Benjelloun", 
      prenom: "Amine", 
      formation: "Data Science Bootcamp",
      presence: 100,
      evaluation: 85,
      statut: "Inscrit"
    },
    { 
      id: "P2", 
      nom: "El Fassi", 
      prenom: "Lina", 
      formation: "Introduction à l'IA",
      presence: 90,
      evaluation: 92,
      statut: "Participant"
    },
    { 
      id: "P3", 
      nom: "Cherkaoui", 
      prenom: "Youssef", 
      formation: "Atelier IoT",
      presence: 100,
      evaluation: 78,
      statut: "Certifié"
    }
  ]);

  // Sample data for reports
  const [rapports, setRapports] = useState<Rapport[]>([
    { 
      id: "R1", 
      type: "Mensuel", 
      periode: "Juillet 2024", 
      statut: "Publié",
      createur: "Samira El Amrani"
    },
    { 
      id: "R2", 
      type: "Trimestriel", 
      periode: "Q2 2024", 
      statut: "Validé",
      createur: "Hassan Roudani"
    },
    { 
      id: "R3", 
      type: "Annuel", 
      periode: "2024", 
      statut: "En Préparation",
      createur: "Nadia Bennis"
    }
  ]);

  // Sample data for purchase requests
  const [demandesAchat, setDemandesAchat] = useState<DemandeAchat[]>([
    { 
      id: "DA1", 
      numero: "DA-2024-087", 
      dateCreation: "2024-07-15",
      etatDA: "Validation Direction",
      affectation: "Yassine",
      etatBC: "Signature",
      etatPrestation: "En Cours",
      etatPVR: "En Attente",
      datePaiement: "2024-09-01",
      etatPaiement: "En Attente"
    },
    { 
      id: "DA2", 
      numero: "DA-2024-088", 
      dateCreation: "2024-07-18",
      etatDA: "Validé",
      affectation: "Nasser",
      etatBC: "Signé",
      etatPrestation: "Terminé",
      etatPVR: "Validé",
      datePaiement: "2024-08-15",
      etatPaiement: "Payé"
    }
  ]);

  // Sample data for conventions
  const [conventions, setConventions] = useState<Convention[]>([
    { 
      id: "C1", 
      partenaire: "Université Mohammed VI", 
      type: "Formation",
      etat: "Signature Partenaire",
      dateSignature: "2024-09-01"
    },
    { 
      id: "C2", 
      partenaire: "TechStart Maroc", 
      type: "Partenariat",
      etat: "Signée",
      dateSignature: "2024-06-15"
    }
  ]);

  // Sample data for spaces
  const [espaces, setEspaces] = useState<Espace[]>([
    { 
      id: "ES1", 
      nom: "Espace Coworking Principal", 
      type: "Coworking", 
      occupation: 18, 
      capacite: 30,
      maintenance: "OK"
    },
    { 
      id: "ES2", 
      nom: "Salle de Formation A", 
      type: "Salle Formation", 
      occupation: 12, 
      capacite: 20,
      maintenance: "OK"
    },
    { 
      id: "ES3", 
      nom: "FabLab Zone A", 
      type: "FabLab", 
      occupation: 8, 
      capacite: 15,
      maintenance: "En Cours"
    }
  ]);

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case "Planifié":
        case "En Préparation":
        case "Validation SM":
        case "Validation Direction":
        case "En Attente":
        case "Signature Orange":
        case "Signature Partenaire":
          return "bg-[#F2E7FF] text-[#9C00C3]";
        case "En Cours":
        case "Référencement":
        case "Signature":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "Terminé":
        case "Publié":
        case "Validé":
        case "Signé":
        case "Payé":
        case "OK":
          return "bg-[#E6F7EA] text-[#00C31F]";
        case "Rejeté":
        case "Nécessaire":
          return "bg-[#FFE5E5] text-[#FF0000]";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    return (
      <span className={`px-3 py-1 text-xs rounded-full min-w-[90px] text-center inline-block ${getStatusClass()}`}>
        {status}
      </span>
    );
  };
  const navigate = useNavigate();

  const SatisfactionBadge = ({ score }: { score: number }) => {
    const getColor = () => {
      if (score >= 4) return "bg-green-100 text-green-800";
      if (score >= 3) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    };

    return score > 0 ? (
      <span className={`px-2 py-1 text-xs rounded-full ${getColor()}`}>
        {score.toFixed(1)}/5
      </span>
    ) : (
      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
        N/A
      </span>
    );
  };

  const ParticipantStatusBadge = ({ status }: { status: string }) => {
    const getStatusClass = () => {
      switch (status) {
        case "Inscrit":
          return "bg-blue-100 text-blue-800";
        case "Participant":
          return "bg-purple-100 text-purple-800";
        case "Certifié":
          return "bg-green-100 text-green-800";
        case "Abandon":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-700";
      }
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass()}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold"> Coordination</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
              <Search size={16} />
              Recherche
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2 rounded-[4px]">
              <Calendar size={16} />
              Calendrier
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2 rounded-[4px]">
              <BarChart2 size={16} />
              Statistiques
            </Button>
            <Link to="/nouvelle-coordination" className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
              <Plus size={13} className="mr-2" />
              Nouvelle Action
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white p-4  rounded-[4px] border border-gray-200 flex items-start">
                <div className="bg-[#FF79001A] p-3 rounded-full flex items-center justify-center mr-3">
                {stat.icon}
              </div>
                <div>
                <p className="text-xl text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
               
                  <p className={`text-sm font-inter ${
                    index === 3
                      ? "text-red-500"
                      : index === 0 || index === 1
                      ? "text-[#10B981]"
                      : "text-gray-500"
                  }`}>
                    {stat.subtitle}
                  </p>


                </div>
              </div>
            ))}
          </div>


        <div className="flex gap-4">
  {/* Tableau des Formations à gauche */}
  <div className="w-3/4">
    <Card className="mb-6 border-gray-200 rounded-[4px] shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">Gestion des Formations</div>
          <div className="flex gap-2">
            
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-[4px]"
            onClick={() => navigate("/manager/GestionFormation")}
          >
            Découvrir
          </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" /> Exporter
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-[#EBEBEB]">
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Formateur</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formations.map((formation) => (
              <TableRow key={formation.id}>
                <TableCell className="font-medium">{formation.titre}</TableCell>
                <TableCell>{formation.type}</TableCell>
                <TableCell>{formation.formateur}</TableCell>
                <TableCell>
                  {formation.dateDebut}<br />
                  {formation.dateFin}
                </TableCell>
                <TableCell>
                  <StatusBadge status={formation.statut} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="bg-black text-white rounded-[4px]">Accéder</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>

  {/* Bloc Accès à droite */}
  <div className="w-1/4">
  <div className="bg-black text-white rounded-[4px] shadow-lg overflow-hidden h-[364px]">
  <div className="p-4 bg-black text-white font-bold text-left rounded-[4px] w-full text-xl">
  Accès
</div>
  <div className="space-y-2 p-2">

    <a href="#" className=" flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100" style={{ padding: '0.45rem' }}>
      <div className="mr-2 text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M3 4C3 2.93913 3.42143 1.92172 4.17157 1.17157C4.92172 0.421427 5.93913 0 7 0C8.06087 0 9.07828 0.421427 9.82843 1.17157C10.5786 1.92172 11 2.93913 11 4C11 5.06087 10.5786 6.07828 9.82843 6.82843C9.07828 7.57857 8.06087 8 7 8C5.93913 8 4.92172 7.57857 4.17157 6.82843C3.42143 6.07828 3 5.06087 3 4ZM0 15.0719C0 11.9937 2.49375 9.5 5.57188 9.5H8.42813C11.5063 9.5 14 11.9937 14 15.0719C14 15.5844 13.5844 16 13.0719 16H0.928125C0.415625 16 0 15.5844 0 15.0719ZM15.75 9.75V7.75H13.75C13.3344 7.75 13 7.41563 13 7C13 6.58437 13.3344 6.25 13.75 6.25H15.75V4.25C15.75 3.83437 16.0844 3.5 16.5 3.5C16.9156 3.5 17.25 3.83437 17.25 4.25V6.25H19.25C19.6656 6.25 20 6.58437 20 7C20 7.41563 19.6656 7.75 19.25 7.75H17.25V9.75C17.25 10.1656 16.9156 10.5 16.5 10.5C16.0844 10.5 15.75 10.1656 15.75 9.75Z" fill="black"/></svg>      </div>
      Gestion des Conventions
    </a>
    <a href="#" className=" flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M2.45714 0.156626C2.16026 -0.0746243 1.73839 -0.0464993 1.46964 0.219126L0.219636 1.46913C-0.0459894 1.73475 -0.0741144 2.15663 0.154011 2.45663L2.65401 5.70663C2.79464 5.891 3.01651 6.00038 3.24776 6.00038H4.93839L8.34464 9.40663C7.88526 10.3129 8.03214 11.4504 8.79151 12.2066L12.2915 15.7066C12.6821 16.0973 13.3165 16.0973 13.7071 15.7066L15.7071 13.7066C16.0978 13.316 16.0978 12.6816 15.7071 12.291L12.2071 8.791C11.4509 8.03475 10.3134 7.88475 9.40714 8.34413L6.00089 4.93788V3.25038C6.00089 3.016 5.89151 2.79725 5.70714 2.65663L2.45714 0.156626ZM0.622761 12.3785C0.225886 12.7754 0.000885559 13.316 0.000885559 13.8785C0.000885559 15.0504 0.950886 16.0004 2.12276 16.0004C2.68526 16.0004 3.22589 15.7754 3.62276 15.3785L7.30401 11.6973C7.06026 11.0441 7.02276 10.3348 7.19151 9.66288L5.26339 7.73475L0.622761 12.3785ZM16.0009 4.50038C16.0009 4.17225 15.9665 3.8535 15.9009 3.54725C15.8259 3.19725 15.3978 3.10663 15.1446 3.35975L13.1478 5.35663C13.054 5.45038 12.9259 5.5035 12.7946 5.5035H11.0009C10.7259 5.5035 10.5009 5.2785 10.5009 5.0035V3.20663C10.5009 3.07538 10.554 2.94725 10.6478 2.8535L12.6446 0.856626C12.8978 0.603501 12.8071 0.175376 12.4571 0.100376C12.1478 0.0347507 11.829 0.000375663 11.5009 0.000375663C9.01651 0.000375663 7.00089 2.016 7.00089 4.50038V4.52538L9.66651 7.191C10.7915 6.90663 12.0353 7.20663 12.9165 8.08788L13.4071 8.5785C14.9384 7.85975 16.0009 6.3035 16.0009 4.50038ZM1.75089 13.5004C1.75089 13.3015 1.8299 13.1107 1.97056 12.97C2.11121 12.8294 2.30197 12.7504 2.50089 12.7504C2.6998 12.7504 2.89056 12.8294 3.03122 12.97C3.17187 13.1107 3.25089 13.3015 3.25089 13.5004C3.25089 13.6993 3.17187 13.8901 3.03122 14.0307C2.89056 14.1714 2.6998 14.2504 2.50089 14.2504C2.30197 14.2504 2.11121 14.1714 1.97056 14.0307C1.8299 13.8901 1.75089 13.6993 1.75089 13.5004Z" fill="black"/>
</svg>      </div>
      Gestion des Formations
    </a>
    <a href="#" className=" flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
<path d="M0 1.5C0 0.671875 0.671875 0 1.5 0H4.5C5.32812 0 6 0.671875 6 1.5V2H12V1.5C12 0.671875 12.6719 0 13.5 0H16.5C17.3281 0 18 0.671875 18 1.5V4.5C18 5.32812 17.3281 6 16.5 6H13.5C12.6719 6 12 5.32812 12 4.5V4H6V4.5C6 4.55312 5.99687 4.60625 5.99062 4.65625L8.5 8H11.5C12.3281 8 13 8.67188 13 9.5V12.5C13 13.3281 12.3281 14 11.5 14H8.5C7.67188 14 7 13.3281 7 12.5V9.5C7 9.44687 7.00313 9.39375 7.00938 9.34375L4.5 6H1.5C0.671875 6 0 5.32812 0 4.5V1.5Z" fill="black"/>
</svg>      </div>
      Suivi des Demandes d'Achats
    </a>
    <a href="#" className=" flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100" style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
<path d="M6 2.5C6 1.12109 7.07625 0 8.4 0H21.6C22.9238 0 24 1.12109 24 2.5V13.75C24 15.1289 22.9238 16.25 21.6 16.25H12.63C12.1875 15.2539 11.5087 14.3945 10.665 13.75H14.4V12.5C14.4 11.8086 14.9363 11.25 15.6 11.25H18C18.6638 11.25 19.2 11.8086 19.2 12.5V13.75H21.6V2.5H8.4V4.41797C7.695 3.99219 6.87375 3.75 6 3.75V2.5ZM6 5C6.47276 5 6.94089 5.097 7.37766 5.28545C7.81443 5.47391 8.21129 5.75013 8.54558 6.09835C8.87988 6.44657 9.14505 6.85997 9.32597 7.31494C9.50688 7.76991 9.6 8.25754 9.6 8.75C9.6 9.24246 9.50688 9.73009 9.32597 10.1851C9.14505 10.64 8.87988 11.0534 8.54558 11.4017C8.21129 11.7499 7.81443 12.0261 7.37766 12.2145C6.94089 12.403 6.47276 12.5 6 12.5C5.52724 12.5 5.05911 12.403 4.62234 12.2145C4.18557 12.0261 3.78871 11.7499 3.45442 11.4017C3.12012 11.0534 2.85495 10.64 2.67403 10.1851C2.49312 9.73009 2.4 9.24246 2.4 8.75C2.4 8.25754 2.49312 7.76991 2.67403 7.31494C2.85495 6.85997 3.12012 6.44657 3.45442 6.09835C3.78871 5.75013 4.18557 5.47391 4.62234 5.28545C5.05911 5.097 5.52724 5 6 5ZM4.99875 13.75H6.9975C9.76125 13.75 12 16.082 12 18.957C12 19.5312 11.5538 20 10.9987 20H1.00125C0.44625 20 0 19.5352 0 18.957C0 16.082 2.23875 13.75 4.99875 13.75Z" fill="black"/>
</svg>      </div>
      Gestion des Encadrants
    </a>
    <a href="#" className="p-1.4 flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M5 0C3.62109 0 2.5 1.12109 2.5 2.5V6.25H5V2.5H13.8555L15 3.64453V6.25H17.5V3.64453C17.5 2.98047 17.2383 2.34375 16.7695 1.875L15.625 0.730469C15.1562 0.261719 14.5195 0 13.8555 0H5ZM15 13.75V15V17.5H5V15V14.375V13.75H15ZM17.5 15H18.75C19.4414 15 20 14.4414 20 13.75V10C20 8.62109 18.8789 7.5 17.5 7.5H2.5C1.12109 7.5 0 8.62109 0 10V13.75C0 14.4414 0.558594 15 1.25 15H2.5V17.5C2.5 18.8789 3.62109 20 5 20H15C16.3789 20 17.5 18.8789 17.5 17.5V15ZM16.875 9.6875C17.1236 9.6875 17.3621 9.78627 17.5379 9.96209C17.7137 10.1379 17.8125 10.3764 17.8125 10.625C17.8125 10.8736 17.7137 11.1121 17.5379 11.2879C17.3621 11.4637 17.1236 11.5625 16.875 11.5625C16.6264 11.5625 16.3879 11.4637 16.2121 11.2879C16.0363 11.1121 15.9375 10.8736 15.9375 10.625C15.9375 10.3764 16.0363 10.1379 16.2121 9.96209C16.3879 9.78627 16.6264 9.6875 16.875 9.6875Z" fill="black"/>
</svg> 
      </div>
      Gestion des Rapports 
    </a>
    <a href="#" className="p-1.4 flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
<path d="M3.85714 1.25V2.5H1.92857C0.863839 2.5 0 3.33984 0 4.375V6.25H18V4.375C18 3.33984 17.1362 2.5 16.0714 2.5H14.1429V1.25C14.1429 0.558594 13.5683 0 12.8571 0C12.146 0 11.5714 0.558594 11.5714 1.25V2.5H6.42857V1.25C6.42857 0.558594 5.85402 0 5.14286 0C4.4317 0 3.85714 0.558594 3.85714 1.25ZM18 7.5H0V18.125C0 19.1602 0.863839 20 1.92857 20H16.0714C17.1362 20 18 19.1602 18 18.125V7.5ZM9 9.6875C9.53438 9.6875 9.96429 10.1055 9.96429 10.625V12.8125H12.2143C12.7487 12.8125 13.1786 13.2305 13.1786 13.75C13.1786 14.2695 12.7487 14.6875 12.2143 14.6875H9.96429V16.875C9.96429 17.3945 9.53438 17.8125 9 17.8125C8.46562 17.8125 8.03571 17.3945 8.03571 16.875V14.6875H5.78571C5.25134 14.6875 4.82143 14.2695 4.82143 13.75C4.82143 13.2305 5.25134 12.8125 5.78571 12.8125H8.03571V10.625C8.03571 10.1055 8.46562 9.6875 9 9.6875Z" fill="black"/>
</svg>      </div>
      Planifier une formation
    </a>
  </div>
</div>
  </div>
</div>



        {/* Grid for Purchase Requests and Conventions */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Suivi des Demandes d'Achats */}
          <Card className="border-gray-200 rounded-[4px] shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  Suivi des Demandes d'Achats
                </div>
                <Button variant="outline" size="sm" className="bg-orange-500 text-white rounded-[4px]">
                  <Plus size={16} className="mr-2" /> Nouvelle DA
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>N° DA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>État DA</TableHead>
                    <TableHead>Affectation</TableHead>
                    <TableHead>État BC</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandesAchat.map((demande) => (
                    <TableRow key={demande.id}>
                      <TableCell>{demande.numero}</TableCell>
                      <TableCell>{demande.dateCreation}</TableCell>
                      <TableCell>
                        <StatusBadge status={demande.etatDA} />
                      </TableCell>
                      <TableCell>{demande.affectation}</TableCell>
                      <TableCell>
                        <StatusBadge status={demande.etatBC} />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="bg-orange-500 text-white rounded-[4px]">
                        Accéder
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Conventions et Partenariats */}
          <Card className="border-gray-200 rounded-[4px] shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  Conventions et Partenariats
                </div>
                <Button variant="outline" size="sm" className="bg-orange-500 text-white rounded-[4px]">
                  <Plus size={16} className="mr-2" /> Nouvelle Convention
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-[#EBEBEB]">
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>État</TableHead>
                    <TableHead>Date Signature</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conventions.map((convention) => (
                    <TableRow key={convention.id}>
                      <TableCell>{convention.partenaire}</TableCell>
                      <TableCell>{convention.type}</TableCell>
                      <TableCell>
                        <StatusBadge status={convention.etat} />
                      </TableCell>
                      <TableCell>{convention.dateSignature}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="bg-orange-500 text-white rounded-[4px]">
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

export default Coordination;