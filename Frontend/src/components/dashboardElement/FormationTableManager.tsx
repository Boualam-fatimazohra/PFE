import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormationItem } from "@/pages/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export interface FormationTableItem {
  _id: string;
  title: string;
  dateDebut: string;
  dateFin: string;
  status: "En Cours" | "Avenir" | "Terminé" | "Replanifier";
  formateur?: string;
  role?: string;
  participants?: string;
  satisfaction?: string;
  image?: string;
}

interface FormationsTableProps {
  formations?: FormationTableItem[];
  onShowDetails?: (formation: FormationItem) => void;
}

export const FormationsTable = ({
  formations = [
    { _id: "1", title: "Atelier IA Générative en design", dateDebut: "2025-03-15", dateFin: "2025-03-20", status: "En Cours", formateur: "Mohamed Bikarrane", role: "Aadir", participants: "24/30", satisfaction: "75%", image: "/api/placeholder/60/60" },
    { _id: "2", title: "AWS : Développement, déploiement et gestion", dateDebut: "2025-03-17", dateFin: "2025-03-25", status: "En Cours", formateur: "Mehdi Iddouche", role: "Agadir", participants: "24/30", satisfaction: "75%", image: "/api/placeholder/60/60" },
    { _id: "3", title: "Maîtriser le développement d'applications natives avec Java", dateDebut: "2025-03-15", dateFin: "2025-03-30", status: "En Cours", formateur: "Aymen Hafsi", role: "Agadir", participants: "24/30", satisfaction: "75%", image: "/api/placeholder/60/60" },
    { _id: "4", title: "Maîtriser le développement d'applications natives avec Java", dateDebut: "2025-03-15", dateFin: "2025-03-28", status: "En Cours", formateur: "Mohamed Bikarrane", role: "Agadir", participants: "24/30", satisfaction: "75%", image: "/api/placeholder/60/60" },
  ],
  onShowDetails
}: FormationsTableProps) => {
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} Mars ${date.getFullYear()}`;
};


  const renderStatusBadge = (status: string) => {
    return (
      <div className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm inline-block">
        En Cours
      </div>
    );
  };


  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold mb-2">Formations Ecole du code</h2>
        <div className="flex items-end mt-4 space-x-2">
  <div className="flex space-x-2">
    <Badge className="bg-orange-500 text-white py-2 px-3 rounded-[4px]">En Cours</Badge>
    <Badge className="bg-gray-200 text-gray-700 py-2 px-3 rounded-[4px]">À venir</Badge>
    <Badge className="bg-gray-300 text-gray-700 py-2 px-3 rounded-[4px]">Terminée</Badge>
    <Button size="sm" className="bg-transparent shadow-none p-0 flex items-center py-2 px-3">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M18 2.5V4L11.5 10.5V18.5L8.5 15.5V10.5L2 4V2.5C2.00006 1.94774 2.44774 1.50006 3 1.5H17C17.5523 1.50006 17.9999 1.94774 18 2.5Z" fill="black"/>
      </svg>
      <span className="ml-2 text-black">Filtres</span>
    </Button>
  </div>

  {/* Ajout d'un div qui prend tout l'espace disponible pour pousser le bouton à droite */}
  <div className="flex-grow"></div>

  <Button
    className="bg-orange-500 hover:bg-orange-600 text-white"
    onClick={() => navigate("/manager/GestionFormation")}
  >
    Découvrir
  </Button>
</div>




      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100 font-bold">
            <TableRow>
              <TableHead className="font-medium text-gray-600 font-bold">Titre Formation</TableHead>
              <TableHead className="font-medium text-gray-600 font-bold">Formateur</TableHead>
              <TableHead className="font-medium text-gray-600 font-bold">Date</TableHead>
              <TableHead className="font-medium text-gray-600 font-bold">Status</TableHead>
              <TableHead className="font-medium text-gray-600 font-bold">Participants</TableHead>
              <TableHead className="font-medium text-gray-600 font-bold">Satisfaction</TableHead>
              <TableHead className="font-medium text-gray-600 text-center font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formations.map((formation) => (
              <TableRow key={formation._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    </svg>
                    </div>

                    <span className="text-sm font-bold text-gray-600" style={{ fontFamily: "Inter", color: "#333" }}>{formation.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                <div className="text-base font-bold text-gray-900" style={{ fontFamily: "Inter" }}>
                  {formation.formateur}
                </div>
                <div
                  className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm font-medium"
                  style={{ fontFamily: "Inter", display: "inline-block", marginTop: "4px" }}
                >
                  {formation.role}
                </div>
              </TableCell>


                <TableCell>
                  <div className="text-sm"style={{ fontFamily: "Inter" ,color :"#666"}}>
                    {formatDate(formation.dateDebut)}
                  
                  </div>
                </TableCell>
                <TableCell>
                  {renderStatusBadge(formation.status)}
                </TableCell>
                <TableCell>
                    <div className="text-sm font-bold">
                    {formation.participants}</div></TableCell>
                <TableCell><div className="text-sm font-bold">{formation.satisfaction}</div></TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-gray-800"
                    onClick={() => onShowDetails && onShowDetails(formation as FormationItem)}
                  >
                    Accéder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
    </div>
  );
};