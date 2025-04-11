import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FormationItem } from "@/pages/types";
import { useNavigate } from "react-router-dom";
import { Formation } from "@/components/formation-modal/types"
import { useEdc } from "@/contexts/EdcContext";

interface FormationsTableProps {
  formations?: Formation[];
  onShowDetails?: (formation: FormationItem) => void;
}

export const FormationsTable = ({
  formations = [],
  onShowDetails
}: FormationsTableProps) => {
  const navigate = useNavigate();
  const { fetchBeneficiairesCountByFormation } = useEdc();
  const [activeFilter, setActiveFilter] = React.useState<string>("En Cours");
  const [beneficiairesCounts, setBeneficiairesCounts] = React.useState<Record<string, { total: number, confirmed: number }>>({});
  const [loadingCounts, setLoadingCounts] = React.useState<Record<string, boolean>>({});
  
  React.useEffect(() => {
    const loadCounts = async () => {
      const countsToLoad = formations.filter(f => 
        f._id && !beneficiairesCounts[f._id]
      );
      
      if (countsToLoad.length === 0) return;
  
      const newCounts: Record<string, { total: number, confirmed: number }> = {};
      const newLoading: Record<string, boolean> = {};
      
      for (const formation of countsToLoad) {
        if (!formation._id) continue;
        
        newLoading[formation._id] = true;
        try {
          // Now this matches the updated return type
          const counts = await fetchBeneficiairesCountByFormation(formation._id);
          newCounts[formation._id] = counts;
        } catch (error) {
          console.error(`Error loading count for formation ${formation._id}:`, error);
          newCounts[formation._id] = { total: 0, confirmed: 0 };
        } finally {
          newLoading[formation._id] = false;
        }
      }
      
      setBeneficiairesCounts(prev => ({ ...prev, ...newCounts }));
      setLoadingCounts(prev => ({ ...prev, ...newLoading }));
    };
  
    loadCounts();
  }, [formations, fetchBeneficiairesCountByFormation]);

  
  const formatDate = (dateString: string) => {
    // Si la date est déjà au format JJ/MM/AAAA
    if (dateString.includes('/')) {
      const [jour, mois, annee] = dateString.split('/');
      
      // Tableau des noms de mois en français
      const moisFrancais = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      
      // Le mois dans le format JJ/MM/AAAA est 1-indexé (1-12), mais l'index du tableau est 0-indexé
      const moisIndex = parseInt(mois, 10) - 1;
      const nomMois = moisFrancais[moisIndex];
      
      return `${jour} ${nomMois} ${annee}`;
    }
    
    // Fallback au cas où la date serait dans un autre format
    const date = new Date(dateString);
    const moisFrancais = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return `${date.getDate()} ${moisFrancais[date.getMonth()]} ${date.getFullYear()}`;
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
                      <span
                        style={{
                          color: 'var(--Neutral-700, #333)',
                          fontFeatureSettings: "'dlig' on",
                          fontFamily: 'Inter',
                          fontSize: '16px',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          lineHeight: '21px',
                        }}
                      >
                        {formation.nom}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{color: 'var(--Neutral-700, #333)',fontFeatureSettings: "'dlig' on",fontFamily: 'Inter',fontSize: '16px',fontStyle: 'normal',fontWeight: 600, lineHeight: '21px', }}>
                          {formation.formateurName}
                    </div>
                    <div className="bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-medium inline-block mt-1">
                      {formation.formateurCity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        color: 'var(--Neutral-500, #666)',
                        fontFeatureSettings: "'dlig' on",
                        fontFamily: 'Inter',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '21px',
                      }}
                    >
                      {formatDate(formation.dateDebut)}
                    </div>

                    {formation.dateFin ? (
                      formation.dateDebut !== formation.dateFin && (
                        <div
                          style={{
                            marginTop: '4px',
                            color: 'var(--Neutral-500, #666)',
                            fontFeatureSettings: "'dlig' on",
                            fontFamily: 'Inter',
                            fontSize: '16px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                            lineHeight: '21px',
                          }}
                        >
                          {formatDate(formation.dateFin)}
                        </div>
                      )
                    ) : (
                      <div
                        style={{marginTop: '4px',color: 'var(--Neutral-500, #666)',fontFeatureSettings: "'dlig' on",fontFamily: 'Inter',fontSize: '16px',fontStyle: 'normal',fontWeight: 500,lineHeight: '21px',}}> -
                      </div>)}
                  </TableCell>
                  <TableCell>
                    <div className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${getStatusColor(formation.status)}`}>
                      {formation.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    {loadingCounts[formation._id as string] ? (
                      <div className="text-sm text-gray-500">Chargement...</div>
                    ) : (
                      <div className="text-sm font-bold">
                        {beneficiairesCounts[formation._id as string] ? 
                          `${beneficiairesCounts[formation._id as string].confirmed}/${beneficiairesCounts[formation._id as string].total}` : 
                          '0/0'}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold">N/A</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-800 rounded-[4px]"
                      style={{
                        overflow: 'hidden',
                        color: '#FFF',
                        textAlign: 'center',
                        fontFeatureSettings: "'dlig' on",
                        textOverflow: 'ellipsis',
                        fontFamily: 'Inter',
                        fontSize: '13px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '21px',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        alignSelf: 'stretch',
                      }}
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