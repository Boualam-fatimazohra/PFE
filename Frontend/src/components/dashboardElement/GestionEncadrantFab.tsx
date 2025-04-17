import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react';
import LoadingSpinner from "../layout/LoadingSpinner";

export interface Encadrant {
  _id: string;
  utilisateur: {
    prenom: string;
    nom: string;
    email: string;
    numeroTelephone?: string;
    role: string;
  };
  fabLab?: string;
  specialite?: string;
  dateIntegration?: string;
  actif: boolean;
  type: "interne" | "externe";
  entity?: {
    nom: string;
  };
  imageEncadrant?: string;
  certificats: File[] | null;
}

const Avatar = ({ imageUrl, name }: { imageUrl?: string | null, name: string }) => {
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  }

  const initials = name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
      <span className="text-gray-600 font-medium">{initials}</span>
    </div>
  );
};

const GestionEncadrantFab = () => {
  // Added proper hook definition with default values
  const [fabLabEncadrants, setFabLabEncadrants] = useState<Encadrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [specialiteFilter, setSpecialiteFilter] = useState("");
  const navigate = useNavigate();
  
  const handleEdit = (id: string) => {
    navigate(`/manager/ModifieEncadrant/${id}`);
  };
  
  const handleDetail = (id: string) => {
    navigate(`/manager/DetailEncadrant/${id}`);
  };

  // Added fetchFabLabEncadrants function
  const fetchFabLabEncadrants = async () => {
    try {
      setLoading(true);
      // Here you would normally fetch data from an API
      // For now, we'll just simulate a delay and return mock data
      setTimeout(() => {
        setFabLabEncadrants([
          {
            _id: "1",
            utilisateur: {
              prenom: "Mehdi",
              nom: "Alaoui",
              email: "mehdi.alaoui@example.com",
              role: "Encadrant Principal"
            },
            fabLab: "Fab Lab Central",
            specialite: "Impression 3D",
            dateIntegration: "2023-01-15",
            actif: true,
            type: "interne",
            certificats: null
          },
          {
            _id: "2",
            utilisateur: {
              prenom: "Sarah",
              nom: "Benali",
              email: "sarah.benali@example.com",
              role: "Encadrant"
            },
            fabLab: "Fab Lab Central",
            specialite: "Robotique",
            dateIntegration: "2023-03-10",
            actif: true,
            type: "externe",
            entity: { nom: "TechInnov" },
            certificats: null
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Erreur lors du chargement des encadrants");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFabLabEncadrants();
  }, []);

  // Safety check for fabLabEncadrants being undefined
  const transformedEncadrants = fabLabEncadrants && fabLabEncadrants.length > 0
    ? fabLabEncadrants.map(encadrant => ({
        id: encadrant._id,
        nom: `${encadrant.utilisateur.prenom} ${encadrant.utilisateur.nom}`,
        fabLab: encadrant.fabLab || "Fab Lab Central",
        specialite: encadrant.specialite || "Impression 3D",
        role: encadrant.utilisateur.role || "Encadrant",
        depuis: encadrant.dateIntegration ? new Date(encadrant.dateIntegration).getFullYear().toString() : "2023",
        actif: encadrant.actif !== false,
        type: encadrant.type || "interne",
        entity: encadrant.entity?.nom || (encadrant.type === "externe" ? "Entreprise Partenaire" : ""),
        image: encadrant.imageEncadrant || null,
      }))
    : [
        { id: "1", nom: "Mehdi Alaoui", fabLab: "Fab Lab Central", specialite: "Impression 3D", role: "Encadrant Principal", depuis: "2023", actif: true, type: "interne", entity: "", image: null },
        { id: "2", nom: "Sarah Benali", fabLab: "Fab Lab Central", specialite: "Robotique", role: "Encadrant", depuis: "2023", actif: true, type: "externe", entity: "TechInnov", image: null },
      ];

  const filteredEncadrants = transformedEncadrants.filter(encadrant => {
    const matchesSearch = encadrant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          encadrant.fabLab.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          encadrant.specialite.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === "actif" && encadrant.actif) || 
      (statusFilter === "inactif" && !encadrant.actif);
    
    const matchesType = !typeFilter || encadrant.type.toLowerCase() === typeFilter.toLowerCase();
    
    const matchesSpecialite = !specialiteFilter || encadrant.specialite.toLowerCase() === specialiteFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType && matchesSpecialite;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p>Erreur de chargement des encadrants : {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[28px] font-bold leading-[28px] text-black">
            Gestion des Encadrants
          </h1>
          <button 
            onClick={() => navigate('/manager/AjoutEncadrant')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">+</span>
            Ajouter un encadrant
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder="Rechercher un encadrant..."
              className="w-full pl-3 pr-10 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600">
              <Search size={20} />
            </button>
          </div>
          
          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="interne">Interne</option>
            <option value="externe">Externe</option>
          </select>

          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={specialiteFilter}
            onChange={(e) => setSpecialiteFilter(e.target.value)}
          >
            <option value="">Toutes les spécialités</option>
            <option value="impression 3d">Impression 3D</option>
            <option value="découpe laser">Découpe Laser</option>
            <option value="robotique">Robotique</option>
            <option value="électronique">Électronique</option>
            <option value="iot">IoT</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEncadrants.map((encadrant) => (
            <div key={encadrant.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <Avatar 
                    imageUrl={encadrant.image} 
                    name={encadrant.nom} 
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{encadrant.nom}</h3>
                    <p className="text-sm text-gray-600">{encadrant.fabLab}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mb-1 ${
                    encadrant.actif ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {encadrant.actif ? 'Actif' : 'Inactif'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    encadrant.type === 'interne' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {encadrant.type === 'interne' ? 'Interne' : 'Externe'}
                  </span>
                </div>
              </div>

              <div className="p-4 text-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-gray-500 mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </span>
                  <p className="text-sm">{encadrant.specialite}</p>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-500 mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  <p className="text-sm">Depuis {encadrant.depuis}</p>
                </div>
                {encadrant.type === 'externe' && encadrant.entity && (
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </span>
                    <p className="text-sm">{encadrant.entity}</p>
                  </div>
                )}
              </div>

              <div className="flex border-t">
                <button 
                  className="flex-1 py-2 text-center text-white bg-black text-sm flex items-center justify-center gap-2"
                  onClick={() => handleDetail(encadrant.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Détails
                </button>
                <button 
                  className="flex-1 py-2 text-center text-sm border-l flex items-center justify-center gap-2"
                  onClick={() => handleEdit(encadrant.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GestionEncadrantFab;