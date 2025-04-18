import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Eye, Edit } from 'lucide-react';
import LoadingSpinner from "../layout/LoadingSpinner";
import { useProjetFab } from "@/contexts/projetFabContext";

export interface Projet {
  _id: string;
  baseFormation: {
    _id: string;
    nom: string;
    dateDebut: string;
    dateFin: string;
    description: string;
    image?: string;
  };
  status: "En Cours" | "Terminé" | "Avenir" | "Replanifier";
  progress: number;
  nombreParticipants: number;
  encadrants?: Array<{
    _id: string;
    encadrant: {
      _id: string;
      utilisateur: {
        nom: string;
        prenom: string;
        email: string;
      };
    };
    dateAssignment: string;
  }>;
}

const statusMapping = {
  "En Cours": "En cours",
  "Terminé": "Terminé",
  "Avenir": "À venir",
  "Replanifier": "À venir"
};

const FilterButton = ({ label, active, onClick }) => (
  <button
    className={`px-3 py-1 text-sm font-medium rounded-md ${
      active 
        ? 'bg-orange-500 text-white' 
        : 'bg-white text-gray-600 border border-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const ProgressBar = ({ percentage }) => (
  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div 
      className="h-full bg-orange-500 rounded-full"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const GestionProjetFab = () => {
  const { projetsFab, loading, error, refreshData } = useProjetFab();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const projetsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();
  }, []);
  
  const handleDetail = (id) => {
    navigate(`/manager/DetailProjet/${id}`);
  };
  
  const handleEdit = (id) => {
    navigate(`/manager/ModifierProjet/${id}`);
  };
  
  // Extract unique ODC cities from projects
  const cities = [...new Set(projetsFab.map(projet => {
    // Check if we can extract an ODC from description or other fields
    const description = projet.baseFormation.description || "";
    const match = description.match(/ODC\s*:\s*([A-Za-z]+)/i);
    return match ? match[1] : "Non spécifié";
  }))];
  
  // Filtered projects based on search and filters
  const filteredProjets = projetsFab.filter(projet => {
    // Extract searchable text
    const projectTitle = projet.baseFormation.nom || "";
    const projectDesc = projet.baseFormation.description || "";
    const matchesSearch = 
      projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectDesc.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map backend status to UI status
    const uiStatus = statusMapping[projet.status] || projet.status;
    const matchesStatus = !statusFilter || uiStatus === statusFilter;
    
    // Extract city from description or default to empty
    const description = projet.baseFormation.description || "";
    const match = description.match(/ODC\s*:\s*([A-Za-z]+)/i);
    const projectCity = match ? match[1].toLowerCase() : "";
    
    const matchesCity = !cityFilter || projectCity.includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  });
  
  // Pagination logic
  const indexOfLastProjet = currentPage * projetsPerPage;
  const indexOfFirstProjet = indexOfLastProjet - projetsPerPage;
  const currentProjets = filteredProjets.slice(indexOfFirstProjet, indexOfLastProjet);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={refreshData}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Gestion des Projets Fablab
          </h1>
          <Link
            to="/manager/CreatProjetFab"
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un projet
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un projet..."
              className="w-full pl-3 pr-10 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500">
              <Search size={20} />
            </button>
          </div>
          
          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="En cours">En cours</option>
            <option value="À venir">À venir</option>
            <option value="Terminé">Terminé</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Toutes les villes</option>
            {cities.map((city, index) => (
              <option key={index} value={city.toLowerCase()}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {currentProjets.length > 0 ? (
            currentProjets.map((projet) => {
              // Extract city from description or default to empty
              const description = projet.baseFormation.description || "";
              const match = description.match(/ODC\s*:\s*([A-Za-z]+)/i);
              const projectCity = match ? match[1] : "Non spécifié";
              
              // Map backend status to UI status
              const uiStatus = statusMapping[projet.status] || projet.status;
              
              return (
                <div key={projet._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 overflow-hidden">
                        <img src={projet.baseFormation.image || "/api/placeholder/84/84"} alt={projet.baseFormation.nom} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{projet.baseFormation.nom}</h3>
                        <div className="mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            uiStatus === "En cours" ? 'bg-blue-100 text-blue-600' : 
                            uiStatus === "À venir" ? 'bg-orange-100 text-orange-600' : 
                            'bg-green-100 text-green-600'
                          }`}>
                            {uiStatus}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{projet.nombreParticipants} participants</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{projet.baseFormation.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1 text-gray-600">
                        <span>Progression</span>
                        <span>{projet.progress}%</span>
                      </div>
                      <ProgressBar percentage={projet.progress} />
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <div>ODC: {projectCity}</div>
                      <div>Date début: {new Date(projet.baseFormation.dateDebut).toLocaleDateString()}</div>
                      {projet.baseFormation.dateFin && (
                        <div>Date fin: {new Date(projet.baseFormation.dateFin).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex border-t">
                    <button 
                      className="flex-1 py-2 text-center text-white bg-black text-sm flex items-center justify-center gap-2"
                      onClick={() => handleDetail(projet._id)}
                    >
                      <Eye size={16} />
                      Détails
                    </button>
                    <button 
                      className="flex-1 py-2 text-center text-sm border-l flex items-center justify-center gap-2"
                      onClick={() => handleEdit(projet._id)}
                    >
                      <Edit size={16} />
                      Modifier
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-500">Aucun projet trouvé</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProjets.length > projetsPerPage && (
          <div className="flex justify-center mt-6 gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white rounded text-sm border border-gray-200 disabled:opacity-50"
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.ceil(filteredProjets.length / projetsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === index + 1 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjets.length / projetsPerPage)))}
              disabled={currentPage === Math.ceil(filteredProjets.length / projetsPerPage)}
              className="px-3 py-1 bg-white rounded text-sm border border-gray-200 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionProjetFab;