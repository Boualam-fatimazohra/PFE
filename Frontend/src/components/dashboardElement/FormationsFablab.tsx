import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useEncadrantFormation } from "@/contexts/EncadrantFormationContext ";

interface Formation {
  id?: string;
  image: string;
  titre: string;
  encadrant: string;
  ville: string;
  datedebut: string;
  datefin: string;
  status: 'En Cours' | 'Avenir' | 'Terminé' | 'Replanifier';
  participants: string;
}

const FormationsFablab = () => {
  const [formationFilter, setFormationFilter] = useState('En Cours');
  const [localFormations, setLocalFormations] = useState<Formation[]>([]);
  
  // Utiliser le contexte pour accéder aux formations
  const { 
    formationsWithEncadrants, 
    loading, 
    error, 
    listFormationsWithEncadrants 
  } = useEncadrantFormation();

  // Données statiques de secours en cas de problème avec l'API
  const fallbackFormations: Formation[] = [
    { 
      image: "/api/placeholder/200/100",
      titre: "Atelier Découpe Laser et développement", 
      encadrant: "Oussama Paul", 
      ville: "Agadir",
      datedebut: "15 Mars 2025", 
      datefin: "-",
      status: "En Cours",
      participants: "24/30"
    },
    { 
      image: "/api/placeholder/200/100", 
      titre: "Atelier Développement Web", 
      encadrant: "Sarah Martinez", 
      ville: "Rabat",
      datedebut: "20 Mars 2025", 
      datefin: "-",
      status: "Avenir",
      participants: "15/25"
    },
    { 
      image: "/api/placeholder/200/100", 
      titre: "Introduction à l'impression 3D", 
      encadrant: "Mohammed Alami", 
      ville: "Casablanca",
      datedebut: "10 Février 2025", 
      datefin: "28 Février 2025",
      status: "Terminé",
      participants: "30/30"
    }
  ];

  // Charger les formations au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        await listFormationsWithEncadrants();
      } catch (error) {
        console.error("Erreur lors du chargement des formations:", error);
        // En cas d'erreur, utilisez les données statiques
        setLocalFormations(fallbackFormations);
      }
    };
    
    fetchData();
  }, []);

  // Mettre à jour les formations locales lorsque les données du contexte changent
  useEffect(() => {
    console.log("Formations reçues:", formationsWithEncadrants);
    
    if (formationsWithEncadrants && Array.isArray(formationsWithEncadrants) && formationsWithEncadrants.length > 0) {
      try {
        // Transformer les données du backend au format attendu par notre composant
        const mappedFormations = formationsWithEncadrants.map(formation => {
          if (!formation) {
            return null;
          }
          
          // Extraire les informations de l'encadrant s'il existe
          const encadrant = formation.encadrants && formation.encadrants.length > 0 
            ? formation.encadrants[0]
            : null;
          
          // Extraire le nom de l'encadrant
          const encadrantNom = encadrant
            ? `${encadrant.prenom || ''} ${encadrant.nom || ''}`.trim() 
            : "Non assigné";
            
          // Récupérer la ville depuis l'entité de l'encadrant
          const villeEncadrant = encadrant?.entity?.ville || "";
          
          return {
            id: formation._id || "",
            image: formation.image || "/api/placeholder/200/100",
            titre: formation.nom || "Formation sans titre",
            encadrant: encadrantNom,
            // Priorité à la ville de l'encadrant si disponible
            ville: villeEncadrant ||  "Non spécifiée",
            datedebut: formatDate(formation.dateDebut),
            datefin: formation.dateFin ? formatDate(formation.dateFin) : "-",
            status: formation.status || determineStatus(formation.dateDebut, formation.dateFin),
            participants: formation.participantsActuels 
              ? `${formation.participantsActuels}/${formation.participantsMax || 0}`
              : "0/0"
          };
        }).filter(Boolean); // Filtrer les entrées null
  
        setLocalFormations(mappedFormations);
      } catch (error) {
        console.error("Erreur lors du traitement des données de formation:", error);
        // En cas d'erreur, utilisez les données statiques
        setLocalFormations(fallbackFormations);
      }
    } else if (formationsWithEncadrants && Array.isArray(formationsWithEncadrants) && formationsWithEncadrants.length === 0) {
      // Aucune formation trouvée, mais API a répondu correctement
      setLocalFormations([]);
    }
  }, [formationsWithEncadrants]);

  // Formater une date en format lisible
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Non définie";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Retourner la chaîne d'origine en cas d'erreur
    }
  };

  // Déterminer le statut en fonction des dates
  const determineStatus = (dateDebut?: string, dateFin?: string): 'En Cours' | 'Avenir' | 'Terminé' | 'Replanifier' => {
    if (!dateDebut) return 'Avenir';
    
    try {
      const now = new Date();
      const debut = new Date(dateDebut);
      const fin = dateFin ? new Date(dateFin) : null;
      
      if (debut > now) return 'Avenir';
      if (fin && fin < now) return 'Terminé';
      return 'En Cours';
    } catch (error) {
      return 'En Cours'; // Valeur par défaut en cas d'erreur
    }
  };

  // Obtenir la classe CSS correspondant au statut
  const getStatusClass = (status) => {
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

  // Filtrer les formations selon le critère sélectionné - CORRECTION ICI
  const filteredFormations = localFormations.filter(formation => {
    // Filtrage exact sans normalisation pour éviter les problèmes
    return formation.status === formationFilter;
  });

  const FilterButton = ({ label, value, active, onClick }) => (
    <button 
      className={`px-4 py-1 text-sm rounded-[4px] ${active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white rounded-[4px] p-3 mb-5 shadow-sm border border-gray-200 max-w-[990px] flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Formations Fablab</h2>
        <button className="bg-orange-500 text-white px-4 py-1 rounded-[4px]">
          Découvrir
        </button>
      </div>
      
      <div className="flex mb-3 gap-2" style={{ width: '60%', height:'10%' }}>
        <FilterButton 
          label="En cours" 
          value="En Cours"
          active={formationFilter === 'En Cours'} 
          onClick={setFormationFilter} 
        />
        <FilterButton 
          label="À venir"
          value="Avenir"
          active={formationFilter === 'Avenir'} 
          onClick={setFormationFilter} 
        />
        <FilterButton 
          label="Terminée" 
          value="Terminé"
          active={formationFilter === 'Terminé'} 
          onClick={setFormationFilter} 
        />
        <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-6">Chargement des formations...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-100 text-left w-90%" style={{ height: '40px' }}>
            <tr>
              <th className="font-bold font-inter text-black" style={{ width: '30%' }}>Titre Formation</th>
              <th className="font-bold font-inter text-black" style={{ width: '20%' }}>Encadrant</th>
              <th className="font-bold font-inter text-black" style={{ width: '18%' }}>Date</th>
              <th className="font-bold font-inter text-black" style={{ width: '20%' }}>Status</th>
              <th className="font-bold font-inter text-black" style={{ width: '80%' }}>Participants</th>
              <th className="font-bold font-inter text-black" style={{ width: '20%' }}>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {filteredFormations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Aucune formation {formationFilter} disponible</td>
              </tr>
            ) : (
              filteredFormations.map((formation, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="p-2 flex items-center" style={{
                    color: 'var(--Neutral-700, #333)',
                    fontFeatureSettings: "'dlig' on",
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: '600',
                    lineHeight: '21px'
                  }}>
                    <div className="p-2 mr-2">
                      <img src={formation.image} className="w-[70px] h-[40px] object-cover" alt={formation.titre} />
                    </div> 
                    {formation.titre}
                  </td>
                  <td className="p-2 font-inter" style={{
                      color: 'var(--Neutral-700, #333)',
                      fontFeatureSettings: "'dlig' on",
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      lineHeight: '21px',
                  }}>
                    <div style={{color: 'var(--Neutral-700, #333)',fontFeatureSettings: "'dlig' on",fontFamily: 'inter',fontSize: '16px',fontStyle: 'normal',fontWeight: 600, lineHeight: '21px', }}>
                      {formation.encadrant}
                    </div>
                    <div className="bg-gray-200 text-black px-2 py-1 rounded-full text-xs font-medium inline-block mt-1">
                      {formation.ville}
                    </div>
                  </td>
                  <td className="p-2">
                    {formation.datedebut}<br />
                    {formation.datefin}
                  </td>
                  <td className="p-2 text-center">
                    <div
                      className={`flex justify-center items-center overflow-hidden text-ellipsis font-inter text-sm font-medium leading-[21px] min-w-[20px] max-w-[480px] px-2 h-6 rounded-[12px] mx-auto ${getStatusClass(formation.status)}`}
                    >
                      {formation.status}
                    </div>
                  </td>
                  <td className="p-2 font-bold" style={{color: 'var(--Neutral-700, #333)',fontFeatureSettings: "'dlig' on",fontFamily: 'Inter',fontSize: '16px',fontStyle: 'normal',fontWeight: '600',lineHeight: '21px',}}>
                    {formation.participants}
                  </td>
                  <td className="p-2">
                    <button className="bg-black text-white px-3 py-1 text-sm rounded-[4px]">
                      Accéder
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FormationsFablab;