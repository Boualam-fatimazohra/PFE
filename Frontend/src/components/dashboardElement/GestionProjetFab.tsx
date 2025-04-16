import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Eye, Edit } from 'lucide-react';
import LoadingSpinner from "../layout/LoadingSpinner";

export interface Projet {
  _id: string;
  titre: string;
  description: string;
  status: "En cours" | "À venir" | "Terminé";
  participants: number;
  progress: number;
  dateDebut: string;
  dateFin?: string;
  image?: string;
  responsable?: string;
  odc?: string;
}

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
  const [projets, setProjets] = useState([
    { 
      _id: "1", 
      titre: "Imprimante 3D", 
      description: "Projet de création d'une imprimante 3D pour le Fablab",
      status: "En cours", 
      participants: 12, 
      progress: 75, 
      dateDebut: "2024-02-15",
      odc: "Rabat",
      image: "/api/placeholder/84/84"
    },
    { 
      _id: "2", 
      titre: "Robot éducatif", 
      description: "Conception d'un robot pour l'apprentissage de la programmation",
      status: "À venir", 
      participants: 8, 
      progress: 0, 
      dateDebut: "2024-05-10",
      odc: "Casablanca",
      image: "/api/placeholder/84/84"
    },
    { 
      _id: "3", 
      titre: "Domotique low-cost", 
      description: "Système domotique abordable pour tous",
      status: "Terminé", 
      participants: 15, 
      progress: 100, 
      dateDebut: "2023-10-05",
      dateFin: "2024-01-20",
      odc: "Rabat",
      image: "/api/placeholder/84/84"
    },
    { 
      _id: "4", 
      titre: "Drone de surveillance", 
      description: "Drone autonome pour la surveillance environnementale",
      status: "En cours", 
      participants: 10, 
      progress: 45, 
      dateDebut: "2024-01-10",
      odc: "Agadir",
      image: "/api/placeholder/84/84"
    },
    { 
      _id: "5", 
      titre: "Lampe LED interactive", 
      description: "Conception d'une lampe LED réagissant au son",
      status: "En cours", 
      participants: 6, 
      progress: 60, 
      dateDebut: "2024-03-01",
      odc: "Casablanca",
      image: "/api/placeholder/84/84"
    },
    { 
      _id: "6", 
      titre: "Carte électronique éducative", 
      description: "Carte programmable pour l'initiation à l'électronique",
      status: "À venir", 
      participants: 20, 
      progress: 0, 
      dateDebut: "2024-06-15",
      odc: "Rabat",
      image: "/api/placeholder/84/84"
    }
  ]);
  
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjet, setNewProjet] = useState({
    titre: "",
    description: "",
    status: "À venir",
    participants: 0,
    progress: 0,
    dateDebut: "",
    dateFin: "",
    odc: "Rabat",
    image: "/api/placeholder/84/84"
  });
  
  const projetsPerPage = 4;
  const navigate = useNavigate();
  
  const handleDetail = (id) => {
    navigate(`/manager/DetailProjet/${id}`);
  };
  
  const handleEdit = (id) => {
    navigate(`/manager/ModifierProjet/${id}`);
  };
  
  // Filtered projects based on search and filters
  const filteredProjets = projets.filter(projet => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          projet.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || projet.status === statusFilter;
    const matchesCity = !cityFilter || projet.odc.toLowerCase() === cityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCity;
  });
  
  // Pagination logic
  const indexOfLastProjet = currentPage * projetsPerPage;
  const indexOfFirstProjet = indexOfLastProjet - projetsPerPage;
  const currentProjets = filteredProjets.slice(indexOfFirstProjet, indexOfLastProjet);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleAddProject = (e) => {
    e.preventDefault();
    
    const newId = (parseInt(projets[projets.length - 1]._id) + 1).toString();
    const createdProject = {
      ...newProjet,
      _id: newId,
    };
    
    setProjets([...projets, createdProject]);
    setShowAddForm(false);
    setNewProjet({
      titre: "",
      description: "",
      status: "À venir",
      participants: 0,
      progress: 0,
      dateDebut: "",
      dateFin: "",
      odc: "Rabat",
      image: "/api/placeholder/84/84"
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjet({
      ...newProjet,
      [name]: name === "participants" || name === "progress" ? parseInt(value) : value,
    });
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">
            Gestion des Projets Fablab
          </h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un projet
          </button>
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
            <option value="rabat">Rabat</option>
            <option value="casablanca">Casablanca</option>
            <option value="agadir">Agadir</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {currentProjets.map((projet) => (
            <div key={projet._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-md mr-3 overflow-hidden">
                    <img src={projet.image} alt={projet.titre} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{projet.titre}</h3>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        projet.status === "En cours" ? 'bg-blue-100 text-blue-600' : 
                        projet.status === "À venir" ? 'bg-orange-100 text-orange-600' : 
                        'bg-green-100 text-green-600'
                      }`}>
                        {projet.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{projet.participants} participants</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{projet.description}</p>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1 text-gray-600">
                    <span>Progression</span>
                    <span>{projet.progress}%</span>
                  </div>
                  <ProgressBar percentage={projet.progress} />
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <div>ODC: {projet.odc}</div>
                  <div>Date début: {new Date(projet.dateDebut).toLocaleDateString()}</div>
                  {projet.dateFin && (
                    <div>Date fin: {new Date(projet.dateFin).toLocaleDateString()}</div>
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
          ))}
        </div>

        {/* Pagination */}
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
      </div>

      {/* Modal Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un nouveau projet</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Titre du projet
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={newProjet.titre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={newProjet.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="À venir">À venir</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Centre ODC
                  </label>
                  <select
                    name="odc"
                    value={newProjet.odc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Rabat">Rabat</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Agadir">Agadir</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={newProjet.participants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Progression (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={newProjet.progress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="dateDebut"
                    value={newProjet.dateDebut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date de fin (optionnel)
                  </label>
                  <input
                    type="date"
                    name="dateFin"
                    value={newProjet.dateFin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newProjet.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded"
                >
                  Créer le projet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProjetFab;