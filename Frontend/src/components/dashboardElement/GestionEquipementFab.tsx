import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, Settings, AlertTriangle } from 'lucide-react';
import LoadingSpinner from "../layout/LoadingSpinner";

export interface Equipement {
  _id: string;
  nom: string;
  categorie: string;
  etat: "Disponible" | "En maintenance" | "Hors service";
  dernierEntretien?: string;
  prochainEntretien?: string;
  localisation: string;
  image?: string;
  description?: string;
  numeroSerie?: string;
  dateAcquisition?: string;
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

const GestionEquipement = () => {
  const [categories] = useState([
    "Imprimantes 3D",
    "Découpe Laser",
    "Scanner 3D",
    "CNC",
    "Électronique",
    "Robotique"
  ]);

  const [equipements, setEquipements] = useState([
    { 
      _id: "1", 
      nom: "Imprimante 3D Ultimaker", 
      categorie: "Imprimantes 3D", 
      etat: "Disponible", 
      dernierEntretien: "2024-03-15",
      prochainEntretien: "2024-06-15",
      localisation: "Salle 101",
      description: "Imprimante 3D haute précision avec double extrudeur",
      numeroSerie: "ULT-2023-5678",
      dateAcquisition: "2023-01-15",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "2", 
      nom: "Imprimante 3D Prusa i3", 
      categorie: "Imprimantes 3D", 
      etat: "En maintenance", 
      dernierEntretien: "2024-02-20",
      prochainEntretien: "2024-05-20",
      localisation: "Salle 101",
      description: "Imprimante 3D open-source fiable",
      numeroSerie: "PR-2022-1234",
      dateAcquisition: "2022-11-05",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "3", 
      nom: "Découpeuse Laser Epilog", 
      categorie: "Découpe Laser", 
      etat: "Disponible", 
      dernierEntretien: "2024-04-01",
      prochainEntretien: "2024-07-01",
      localisation: "Salle 102",
      description: "Découpeuse laser précise pour matériaux divers",
      numeroSerie: "EP-2023-9876",
      dateAcquisition: "2023-03-10",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "4", 
      nom: "Scanner 3D Artec", 
      categorie: "Scanner 3D", 
      etat: "Disponible", 
      dernierEntretien: "2024-03-25",
      prochainEntretien: "2024-06-25",
      localisation: "Salle 103",
      description: "Scanner 3D portable haute résolution",
      numeroSerie: "AR-2023-4321",
      dateAcquisition: "2023-05-12",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "5", 
      nom: "CNC Roland", 
      categorie: "CNC", 
      etat: "Hors service", 
      dernierEntretien: "2024-01-10",
      prochainEntretien: "2024-04-10",
      localisation: "Salle 102",
      description: "Machine CNC de précision pour usinage",
      numeroSerie: "RO-2022-8765",
      dateAcquisition: "2022-07-20",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "6", 
      nom: "Kit Arduino Pro", 
      categorie: "Électronique", 
      etat: "Disponible", 
      dernierEntretien: "2024-04-05",
      prochainEntretien: "2024-07-05",
      localisation: "Salle 104",
      description: "Kit complet Arduino pour prototypage électronique",
      numeroSerie: "ARD-2023-1122",
      dateAcquisition: "2023-06-15",
      image: "/api/placeholder/50/40"
    },
    { 
      _id: "7", 
      nom: "Bras robotique KUKA", 
      categorie: "Robotique", 
      etat: "En maintenance", 
      dernierEntretien: "2024-02-28",
      prochainEntretien: "2024-05-28",
      localisation: "Salle 105",
      description: "Bras robotique programmable pour automatisation",
      numeroSerie: "KU-2022-3344",
      dateAcquisition: "2022-12-10",
      image: "/api/placeholder/50/40"
    }
  ]);
  
  const [activeCategory, setActiveCategory] = useState("Imprimantes 3D");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newEquipement, setNewEquipement] = useState({
    nom: "",
    categorie: "Imprimantes 3D",
    etat: "Disponible",
    dernierEntretien: "",
    prochainEntretien: "",
    localisation: "",
    description: "",
    numeroSerie: "",
    dateAcquisition: "",
    image: "/api/placeholder/50/40"
  });
  
  const equipementsPerPage = 5;
  const navigate = useNavigate();
  
  // Filtered equipements based on search, category and status filters
  const filteredEquipements = equipements.filter(equipement => {
    const matchesSearch = equipement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equipement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          equipement.numeroSerie?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !activeCategory || equipement.categorie === activeCategory;
    const matchesStatus = !statusFilter || equipement.etat === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Pagination logic
  const indexOfLastEquipement = currentPage * equipementsPerPage;
  const indexOfFirstEquipement = indexOfLastEquipement - equipementsPerPage;
  const currentEquipements = filteredEquipements.slice(indexOfFirstEquipement, indexOfLastEquipement);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleAddEquipement = (e) => {
    e.preventDefault();
    
    const newId = (parseInt(equipements[equipements.length - 1]._id) + 1).toString();
    const createdEquipement = {
      ...newEquipement,
      _id: newId,
    };
    
    setEquipements([...equipements, createdEquipement]);
    setShowAddForm(false);
    setNewEquipement({
      nom: "",
      categorie: "Imprimantes 3D",
      etat: "Disponible",
      dernierEntretien: "",
      prochainEntretien: "",
      localisation: "",
      description: "",
      numeroSerie: "",
      dateAcquisition: "",
      image: "/api/placeholder/50/40"
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipement({
      ...newEquipement,
      [name]: value,
    });
  };
  
  const handleUpdateStatus = (id, newStatus) => {
    setEquipements(
      equipements.map(equip => 
        equip._id === id ? { ...equip, etat: newStatus } : equip
      )
    );
  };
  
  const handleEquipementDetail = (id) => {
    navigate(`/manager/DetailEquipement/${id}`);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">
            Gestion des Équipements
          </h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Ajouter un équipement
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[300px]">
            <input
              type="text"
              placeholder="Rechercher un équipement..."
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
            <option value="">Tous les états</option>
            <option value="Disponible">Disponible</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Hors service">Hors service</option>
          </select>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap mb-6 gap-2">
          {categories.map(category => (
            <FilterButton
              key={category}
              label={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category === activeCategory ? "" : category)}
            />
          ))}
          <button 
            onClick={() => setActiveCategory("")}
            className="px-3 py-1 text-sm font-medium rounded-md bg-gray-200 text-gray-700"
          >
            Réinitialiser
          </button>
        </div>

        {/* Statistical Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">
                {equipements.filter(e => e.etat === "Disponible").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En maintenance</p>
              <p className="text-2xl font-bold text-orange-600">
                {equipements.filter(e => e.etat === "En maintenance").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Settings size={24} />
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hors service</p>
              <p className="text-2xl font-bold text-red-600">
                {equipements.filter(e => e.etat === "Hors service").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-700">
            <div className="col-span-5">Équipement</div>
            <div className="col-span-2">État</div>
            <div className="col-span-3">Localisation</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {currentEquipements.length > 0 ? (
              currentEquipements.map((equipement) => (
                <div key={equipement._id} className="grid grid-cols-12 p-4 items-center">
                  <div className="col-span-5 flex items-center">
                    <div className="mr-3">
                      <img 
                        src={equipement.image} 
                        alt={equipement.nom}
                        className="w-14 h-12 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{equipement.nom}</h3>
                      <p className="text-sm text-gray-500">{equipement.categorie}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      equipement.etat === 'Disponible'
                        ? 'bg-green-100 text-green-600'
                        : equipement.etat === 'En maintenance'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {equipement.etat}
                    </span>
                  </div>
                  
                  <div className="col-span-3 text-sm text-gray-600">
                    {equipement.localisation}
                  </div>
                  
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={() => handleEquipementDetail(equipement._id)}
                      className="bg-black text-white px-3 py-1 text-sm rounded"
                    >
                      Détails
                    </button>
                    
                    <select
                      value={equipement.etat}
                      onChange={(e) => handleUpdateStatus(equipement._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="En maintenance">En maintenance</option>
                      <option value="Hors service">Hors service</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                Aucun équipement ne correspond à vos critères de recherche.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredEquipements.length > equipementsPerPage && (
          <div className="flex justify-center mt-6 gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white rounded text-sm border border-gray-200 disabled:opacity-50"
            >
              Précédent
            </button>
            
            {Array.from({ length: Math.ceil(filteredEquipements.length / equipementsPerPage) }).map((_, index) => (
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEquipements.length / equipementsPerPage)))}
              disabled={currentPage === Math.ceil(filteredEquipements.length / equipementsPerPage)}
              className="px-3 py-1 bg-white rounded text-sm border border-gray-200 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Modal Add Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un nouvel équipement</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddEquipement}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nom de l'équipement
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={newEquipement.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Catégorie
                  </label>
                  <select
                    name="categorie"
                    value={newEquipement.categorie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    État
                  </label>
                  <select
                    name="etat"
                    value={newEquipement.etat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En maintenance">En maintenance</option>
                    <option value="Hors service">Hors service</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="localisation"
                    value={newEquipement.localisation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Numéro de série
                  </label>
                  <input
                    type="text"
                    name="numeroSerie"
                    value={newEquipement.numeroSerie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date d'acquisition
                  </label>
                  <input
                    type="date"
                    name="dateAcquisition"
                    value={newEquipement.dateAcquisition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dernier entretien
                  </label>
                  <input
                    type="date"
                    name="dernierEntretien"
                    value={newEquipement.dernierEntretien}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Prochain entretien
                  </label>
                  <input
                    type="date"
                    name="prochainEntretien"
                    value={newEquipement.prochainEntretien}
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
                  value={newEquipement.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
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
                  Ajouter l'équipement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEquipement;