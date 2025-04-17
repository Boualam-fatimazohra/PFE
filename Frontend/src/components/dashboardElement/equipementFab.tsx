import { Link } from "react-router-dom";

interface Equipement {
  id: string;
  nom: string;
  image: string;
  etat: 'Disponible' | 'En maintenance';
}

interface EquipementFabProps {
  equipements: Equipement[];
}

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

export const EquipementFab = ({ equipements }: EquipementFabProps) => {
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
      
      {/* Filtres */}
      <div className="flex mb-4 gap-2 rounded-[4px]">
        <FilterButton label="Imprimantes 3D" active={true} onClick={() => {}} />
        <FilterButton label="Découpe Laser" active={false} onClick={() => {}} />
        <FilterButton label="3D Laser" active={false} onClick={() => {}} />
        <FilterButton label="Vol" active={false} onClick={() => {}} />
      </div>

      {/* Liste des équipements */}
      <div className="space-y-4">
        {equipements.map((equip) => (
          <div
            key={equip.id}
            className="flex items-center justify-between bg-gray-100 border border-gray-300 p-4 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="mr-3">
                <img 
                  src={equip.image} 
                  alt={equip.nom}
                  className="w-[50px] h-[40px] object-cover" 
                />
              </div>
              <div>
                <h3 className="font-medium">{equip.nom}</h3>
                <div
                  className={`text-xs px-2 py-0.5 rounded-full inline-block
                    ${
                      equip.etat === 'Disponible'
                        ? 'bg-green-100 text-[#10B981]'
                        : equip.etat === 'En maintenance'
                        ? 'bg-red-100 text-[#FF0F00]'
                        : 'bg-red-100 text-red-500'
                    }`}
                >
                  {equip.etat}
                </div>
              </div>
            </div>
            <button className="bg-black text-white px-3 py-1 text-sm rounded-[4px]">
              Accéder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};