import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormationItem } from "@/pages/types";
import { useNavigate } from "react-router-dom";
import { Formation } from "@/components/formation-modal/types"

interface FormationsTableProps {
  formations?: Formation[];
  onShowDetails?: (formation: FormationItem) => void;
}

export const FormationsTable = ({
  formations = [],
  onShowDetails
}: FormationsTableProps) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = React.useState<string>("En Cours");
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} Mars ${date.getFullYear()}`;
  };

  const filteredFormations = React.useMemo(() => {
    // First filter by status
    const statusFiltered = activeFilter === "Tous" 
      ? formations 
      : formations.filter(formation => formation.status === activeFilter);
    
    // Then sort by date (most recent first)
    const sortedFormations = [...statusFiltered].sort((a, b) => {
      return new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime();
    });
    
    // Limit to 5 most recent formations
    return sortedFormations.slice(0, 5);
  }, [formations, activeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900]";
      case "Avenir":
        return "bg-[#F2E7FF] text-[#9C00C3]";
      case "Terminé":
        return "bg-[#E6F7EA] text-[#00C31F]";
      case "Replanifier":
        return "bg-[#F5F5F5] text-[#4D4D4D]";
      default:
        return "";
    }
  };

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 p-4" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex flex-col mb-4">
        <h2 className="text-xl font-bold mb-2">Formations Ecole du code</h2>
        <div className="flex items-end mt-4 space-x-2">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant={activeFilter === "En Cours" ? "default" : "outline"}
              className={`rounded-[4px] ${activeFilter === "En Cours" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
              size="sm"
              onClick={() => setActiveFilter("En Cours")}
            >
              En Cours
            </Button>
            <Button 
              variant={activeFilter === "Avenir" ? "default" : "outline"}
              className={`rounded-[4px] ${activeFilter === "Avenir" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
              size="sm"
              onClick={() => setActiveFilter("Avenir")}
            >
              À Venir
            </Button>
            <Button 
              variant={activeFilter === "Terminé" ? "default" : "outline"}
              className={`rounded-[4px] ${activeFilter === "Terminé" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
              size="sm"
              onClick={() => setActiveFilter("Terminé")}
            >
              Terminé
            </Button>
            <Button 
              variant={activeFilter === "Replanifié" ? "default" : "outline"}
              className={`rounded-[4px] ${activeFilter === "Replanifié" ? "bg-orange-500 text-white hover:bg-orange-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"}`}
              size="sm"
              onClick={() => setActiveFilter("Replanifié")}
            >
              Replanifié
            </Button>
            <div className="mr-auto">
              <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
                </svg>
                Filtres
              </Button>
            </div>
          </div>

          <div className="flex-grow"></div>

          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-[4px]"
            onClick={() => navigate("/manager/GestionFormation")}
          >
            Découvrir
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-bold font-inter text-black" style={{ width: '25%' }}>Titre Formation</TableHead>
              <TableHead className="font-bold font-inter text-black" style={{ width: '20%' }}>Formateur</TableHead>
              <TableHead className="font-bold font-inter text-black" style={{ width: '15%' }}>Date</TableHead>
              <TableHead className="font-bold font-inter text-black" style={{ width: '10%' }}>Status</TableHead>
              <TableHead className="font-bold font-inter text-black" style={{ width: '10%' }}>Participants</TableHead>
              <TableHead className="font-bold font-inter text-black" style={{ width: '10%' }}>Satisfaction</TableHead>
              <TableHead className="font-bold font-inter text-black text-center" style={{ width: '10%' }}>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFormations.length > 0 ? (
              filteredFormations.map((formation) => (
                <TableRow key={formation._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {formation.image ? (
                        <img 
                          src={formation.image as string} 
                          alt="" 
                          className="w-12 h-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="7" r="4"></circle>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-600">{formation.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-base font-bold text-gray-900">
                      {formation.formateurName}
                    </div>
                    <div className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium inline-block mt-1">
                      {formation.formateurCity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600">
                      {formatDate(formation.dateDebut)}
                    </div>
                    {formation.dateFin ? (
                      formation.dateDebut !== formation.dateFin && (
                        <div className="text-sm text-gray-600 mt-1">
                          {formatDate(formation.dateFin)}
                        </div>
                      )
                    ) : (
                      <div className="text-sm text-gray-600 mt-1">-</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${getStatusColor(formation.status)}`}>
                      {formation.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold">N/A</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold">N/A</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800 rounded-[4px]"
                      onClick={() => onShowDetails && onShowDetails(formation as FormationItem)}
                    >
                      Accéder
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  Aucune formation trouvée pour ce filtre
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};