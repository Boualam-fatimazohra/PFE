import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Formateur } from "../formation-modal/types";

interface FormateurListProps {
  formateurs?: Formateur[];
  onAccederClick?: (formateur: Formateur) => void;
}

// Composant Avatar réutilisable
const Avatar = ({ imageUrl, name }: { imageUrl?: string | null, name: string }) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  // Image par défaut avec les initiales
  const initials = name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-gray-500 font-medium">{initials}</span>
    </div>
  );
};

export const FormateurList = ({
  formateurs = [],
  onAccederClick
}: FormateurListProps) => {
  const [activeFilter, setActiveFilter] = React.useState<string>("Tous");
  const [activeVille, setActiveVille] = React.useState<string>("Tous");
  const navigate = useNavigate();

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredFormateurs = React.useMemo(() => {
    let result = [...formateurs];
    
    // Filter by city if not "Tous"
    if (activeVille !== "Tous") {
      result = result.filter(f => f.entity?.ville?.includes(activeVille));
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
          {filteredFormateurs.slice(0, 12).map((formateur) => (
            <div key={formateur._id} className="border border-gray-300 rounded-[4px] p-4 flex flex-col font-inter">
              <div className="flex items-start mb-2">
                {/* Remplacez l'avatar par défaut par notre composant Avatar */}
                <Avatar 
                  imageUrl={formateur.imageFormateur} 
                  name={`${formateur.utilisateur?.prenom} ${formateur.utilisateur?.nom}`} 
                />
                <div className="flex-grow ml-4">
                  <div className="font-medium text-gray-900">
                    {formateur.utilisateur?.prenom} {formateur.utilisateur?.nom}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formateur.utilisateur?.role} {formateur.entity?.type} {formateur.entity?.ville}
                  </div>
                </div>
                {!formateur.isAvailable && (
                  <span className="bg-orange-100 text-orange-400 px-3 py-1 rounded-full text-sm">
                    En formation 
                  </span>
                )}
                {formateur.isAvailable && (
                  <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
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

                <button 
                  className="p-1"
                  onClick={() => handleEmailClick(formateur.utilisateur?.email || '')}
                >
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