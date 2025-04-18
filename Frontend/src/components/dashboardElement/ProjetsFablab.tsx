import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProjetFab } from "@/contexts/projetFabContext";
import { ProjetFabWithEncadrants } from "@/services/projetFabService";

const ProjetsFablab = () => {
  const [projetFilter, setProjetFilter] = useState<string>('En Cours');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProjets, setFilteredProjets] = useState<ProjetFabWithEncadrants[]>([]);
  const projetsPerPage = 4;
  
  const { 
    projetsFab, 
    loading, 
    error, 
    getAllProjetsFab 
  } = useProjetFab();

  useEffect(() => {
    // Charger tous les projets au montage du composant
    getAllProjetsFab();
  }, []);

  useEffect(() => {
    // Filtrer les projets en fonction du statut sélectionné directement dans le front-end
    if (projetsFab && projetsFab.length > 0) {
      const filtered = projetsFab.filter(projet => projet.status === projetFilter);
      setFilteredProjets(filtered);
      // Réinitialiser la page courante lors du changement de filtre
      setCurrentPage(1);
    }
  }, [projetFilter, projetsFab]);

  // Pagination
  const currentProjets = filteredProjets.slice(
    (currentPage - 1) * projetsPerPage,
    currentPage * projetsPerPage
  );

  const FilterButton = ({ label, active, onClick }) => (
    <button 
      className={`px-4 py-1 text-sm rounded-[4px] ${active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const ProgressBar = ({ percentage, color = "bg-green-500" }) => (
    <div className="w-full bg-green-100 rounded-full h-2 mb-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900]";
      case "Avenir":
        return "bg-[#F2E7FF] text-[#9C00C3]";
      case "Terminé":
        return "bg-[#E6F7EA] text-[#00C31F]";
      default:
        return "";
    }
  };

  if (loading) {
    return <div className="flex-1 p-4">Chargement des projets...</div>;
  }

  if (error) {
    return <div className="flex-1 p-4 text-red-500">{error}</div>;
  }

  // Fonction pour remplir avec des projets vides si nécessaire
  const fillEmptyProjects = (projects) => {
    const emptyProjects = [];
    if (projects.length < projetsPerPage) {
      for (let i = 0; i < projetsPerPage - projects.length; i++) {
        emptyProjects.push({
          _id: `empty-${i}`,
          isEmpty: true
        });
      }
    }
    return [...projects, ...emptyProjects];
  };

  // Projets à afficher avec des emplacements vides si nécessaire
  const displayProjets = filteredProjets.length > 0 
    ? fillEmptyProjects(currentProjets) 
    : [];

  return (
    <div className="flex-1 max-w-[800px] bg-white rounded-[4px] p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projets Fablab</h2>
        <button className="bg-orange-500 text-white px-4 py-1 rounded-[4px]">
          Découvrir
        </button>
      </div>
      
      <div className="flex mb-3 gap-2">
        <FilterButton 
          label="En Cours" 
          active={projetFilter === 'En Cours'} 
          onClick={() => setProjetFilter('En Cours')} 
        />
        <FilterButton 
          label="Avenir"
          active={projetFilter === 'Avenir'} 
          onClick={() => setProjetFilter('Avenir')} 
        />
        <FilterButton 
          label="Terminé" 
          active={projetFilter === 'Terminé'} 
          onClick={() => setProjetFilter('Terminé')} 
        />
        <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
        </Button>
      </div>
      
      {/* Conteneur avec hauteur fixe mais sans espace supplémentaire */}
      <div className="min-h-[400px] flex flex-col">
        {filteredProjets.length === 0 ? (
          <div className="text-center py-8 flex-grow">Aucun projet {projetFilter.toLowerCase()} trouvé.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 flex-grow">
            {displayProjets.map((projet) => (
              <div key={projet._id} className={`border border-gray-200 rounded-[4px] p-3 ${projet.isEmpty ? 'opacity-0' : ''}`}>
                {!projet.isEmpty && (
                  <>
                    <div className="flex items-center mb-2">
                      <div className="w-20 h-20 bg-gray-200 rounded-[4px] mr-3 overflow-hidden">
                        {projet.baseFormation?.image ? (
                          <img 
                            src={projet.baseFormation.image} 
                            alt={projet.baseFormation.nom}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">Pas d'image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{projet.baseFormation?.nom}</h3>
                        <div className={`p-2 rounded-full mb-1 ${getStatusClass(projet.status)}`} style={{
                          display: 'flex',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          textAlign: 'center',
                          fontFeatureSettings: "'dlig' on",
                          fontFamily: 'Inter',
                          fontSize: '13px',
                          fontStyle: 'normal',
                          fontWeight: '300',
                          lineHeight: '10px',
                          width: '10px',
                          height: '19px',
                          minWidth: '84px',
                          maxWidth: '480px',
                          padding: '0px 16px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexShrink: 0,
                          borderRadius: '12px',
                        }}>
                          {projet.status}
                        </div>
                        <div style={{
                          color: 'var(--Neutral-500, #666)',
                          fontFeatureSettings: "'dlig' on",
                          fontFamily: 'Inter',
                          fontSize: '16px',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          lineHeight: '21px'
                        }}>
                          {projet.nombreParticipants} participants
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1 text-gray-600">
                        <span>Progress</span>
                        <span>{projet.progress}%</span>
                      </div>
                      <ProgressBar percentage={projet.progress} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination intégrée sans marge supplémentaire */}
        {filteredProjets.length > projetsPerPage && (
          <div className="flex justify-center mt-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white rounded-[4px] text-sm border border-gray-200 disabled:opacity-50"
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.ceil(filteredProjets.length / projetsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-[4px] text-sm mx-1 ${
                  currentPage === index + 1 
                    ? 'bg-gray-100 text-black border border-gray-200' 
                    : 'bg-white border border-gray-200 rounded-[4px]'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjets.length / projetsPerPage)))}
              disabled={currentPage === Math.ceil(filteredProjets.length / projetsPerPage)}
              className="px-3 py-1 bg-white rounded-[4px] text-sm border border-gray-200 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjetsFablab;