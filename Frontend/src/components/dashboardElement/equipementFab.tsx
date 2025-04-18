import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useEquipement } from "@/contexts/equipementContext";

const FilterButton = ({ label, active, onClick }: {
  label: string;
  active: boolean;
  onClick: () => void
}) => (
  <button
    className={`px-4 py-1 text-sm rounded-[4px] ${active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const EquipementFab: React.FC = () => {
  const { equipements, loading, error, getAllEquipements } = useEquipement();
  const [filter, setFilter] = useState<string>("all");
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  
  useEffect(() => {
    getAllEquipements();
  }, []);

  // Extraire les noms uniques d'équipements pour les filtres
  useEffect(() => {
    if (equipements.length > 0) {
      const names = Array.from(new Set(equipements.map(e => e.nom)));
      setAvailableNames(names);
    }
  }, [equipements]);

  // Filtrer les équipements selon le filtre actif
  const filteredEquipements = filter === "all" 
    ? equipements 
    : equipements.filter(equip => equip.nom === filter);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  if (loading) {
    return <div className="flex-1 max-w-[500px] bg-white rounded-[4px] p-4 shadow-sm border border-gray-200">
      <p>Chargement des équipements...</p>
    </div>;
  }

  if (error) {
    return <div className="flex-1 max-w-[500px] bg-white rounded-[4px] p-4 shadow-sm border border-gray-200">
      <p className="text-red-500">Erreur: {error}</p>
    </div>;
  }

  return (
    <div className="flex-1 max-w-[500px] bg-white rounded-[4px] p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">État des équipements</h2>
        <Link
          to="/manager/GestionEquipement"
          className="bg-orange-500 text-white px-4 py-1 rounded-[4px]"
        >
          Découvrir
        </Link>
      </div>
     
      {/* Filtres par nom */}
      <div className="flex mb-4 gap-2 rounded-[4px] overflow-x-auto">
        {availableNames.map(nom => (
          <FilterButton
            key={nom}
            label={nom}
            active={filter === nom}
            onClick={() => handleFilterChange(nom)}
          />
        ))}
      </div>

      {/* Liste des équipements */}
      <div className="space-y-4">
        {filteredEquipements.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Aucun équipement trouvé</p>
        ) : (
          filteredEquipements.map((equip) => (
            <div
              key={equip._id}
              className="flex items-center justify-between bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="mr-3">
                  {equip.image ? (
                    <img
                      src={equip.image}
                      alt={equip.type}
                      className="w-[50px] h-[40px] object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/50/40";
                      }}
                    />
                  ) : (
                    <div className="w-[50px] h-[40px] bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{equip.type}</h3>
                  <div
                    className={`text-xs px-2 py-0.5 rounded-full inline-block
                      ${
                        equip.etat === 'disponible'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                  >
                    {equip.etat === 'disponible' ? 'Disponible' : 'En maintenance'}
                  </div>
                </div>
              </div>
              <Link to={`/manager/equipement/${equip._id}`} className="bg-black text-white px-3 py-1 text-sm rounded-[4px]">
                Accéder
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};