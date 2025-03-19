import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export interface FormateurItem {
  id: string;
  nom: string;
  role: string;
  ville: string;
  disponible: boolean;
  enFormation: boolean;
}

interface FormateurListProps {
  formateurs?: FormateurItem[];
  onAccederClick?: (formateur: FormateurItem) => void;
}

export const FormateurList = ({
  formateurs = [
    { id: "1", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Agadir", disponible: false, enFormation: true },
    { id: "2", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Rabat", disponible: true, enFormation: false },
    { id: "3", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Casablanca", disponible: false, enFormation: true },
    { id: "4", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Casablanca", disponible: false, enFormation: false },
    { id: "5", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Agadir", disponible: true, enFormation: false },
    { id: "6", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Rabat", disponible: true, enFormation: false },
    { id: "7", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Rabat", disponible: false, enFormation: false },
    { id: "8", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Rabat", disponible: false, enFormation: true },
    { id: "9", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Casablanca", disponible: true, enFormation: false },
    { id: "10", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Casablanca", disponible: true, enFormation: false },
    { id: "11", nom: "Nom/Prénom", role: "Formateur", ville: "ODC Casablanca", disponible: true, enFormation: false },  ],
  onAccederClick
}: FormateurListProps) => {
  const [activeFilter, setActiveFilter] = React.useState<string>("Tous");
  const [activeVille, setActiveVille] = React.useState<string>("Tous");
  const navigate = useNavigate();

  const filteredFormateurs = React.useMemo(() => {
    let result = [...formateurs];
    
    // Filter by city if not "Tous"
    if (activeVille !== "Tous") {
      result = result.filter(f => f.ville.includes(activeVille));
    }
    
    return result;
  }, [formateurs, activeVille]);

  return (
    <Card className="font-inter">
      <CardHeader className="pb-2">
        <CardTitle>Formateur École du code</CardTitle>
      </CardHeader>  
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant={activeVille === "Tous" ? "default" : "outline"}
            className={`rounded-[4px] ${activeVille === "Tous" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
            size="sm"
            onClick={() => setActiveVille("Tous")}
          >
            Tous
          </Button>
          <Button 
            variant={activeVille === "Rabat" ? "default" : "outline"}
            className={`rounded-[4px] ${activeVille === "Rabat" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
            size="sm"
            onClick={() => setActiveVille("Rabat")}
          >
            Rabat
          </Button>
          <Button 
            variant={activeVille === "Agadir" ? "default" : "outline"}
            className={`rounded-[4px] ${activeVille === "Agadir" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
            size="sm"
            onClick={() => setActiveVille("Agadir")}
          >
            Agadir
          </Button>
          <Button 
            variant={activeVille === "Casablanca" ? "default" : "outline"}
            className={`rounded-[4px] ${activeVille === "Casablanca" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
            size="sm"
            onClick={() => setActiveVille("Casablanca")}
          >
            Casablanca
          </Button>
          <div className="mr-auto">
          <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
              </svg>
              Filtres
            </Button>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-[4px]"
            onClick={() => navigate("/manager/GestionFormateurManager")}
          >
            Découvrir
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFormateurs.map((formateur) => (
            <div key={formateur.id} className="border border-gray-300 rounded-[4px] p-4 flex flex-col font-inter">
              <div className="flex items-start mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="font-medium text-gray-900">{formateur.nom}</div>
                  <div className="text-sm text-gray-500">{formateur.role} {formateur.ville}</div>
                </div>
                {formateur.enFormation && (
                <span
                  className="bg-orange-100 text-orange-400 px-3 py-1 rounded-full text-sm "
                >
                  En formation
                </span>
              )}

              {!formateur.enFormation && formateur.disponible && (
                <span
                  className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm "
                >
                  Disponible
                </span>
              )}

                  {!formateur.enFormation && !formateur.disponible && (
                    <span
                    className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm "
                  >
                    Disponible
                  </span>
                  
                  )}
              </div>
              <div className="flex justify-between items-center">
              <Button
                variant="default"
                size="sm"
                className="bg-black text-white hover:bg-gray-900 rounded-[4px] px-4 py-0 text-sm font-medium transition duration-200"
                onClick={() => onAccederClick && onAccederClick(formateur)}
              >
                Accéder
              </Button>

                <button className="p-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M0 0H16V16H0V0Z" stroke="#E5E7EB"/>
                <path d="M2 3.5C1.725 3.5 1.5 3.725 1.5 4V4.69063L6.89062 9.11563C7.5375 9.64688 8.46562 9.64688 9.1125 9.11563L14.5 4.69063V4C14.5 3.725 14.275 3.5 14 3.5H2ZM1.5 6.63125V12C1.5 12.275 1.725 12.5 2 12.5H14C14.275 12.5 14.5 12.275 14.5 12V6.63125L10.0625 10.275C8.8625 11.2594 7.13438 11.2594 5.9375 10.275L1.5 6.63125ZM0 4C0 2.89688 0.896875 2 2 2H14C15.1031 2 16 2.89688 16 4V12C16 13.1031 15.1031 14 14 14H2C0.896875 14 0 13.1031 0 12V4Z" fill="black"/>
                </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormateurList;