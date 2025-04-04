import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from 'lucide-react';
import { useEdc } from "@/contexts/EdcContext";
import LoadingSpinner from "../layout/LoadingSpinner";

export interface Formateur {
  _id: string;
  utilisateur: {
    prenom: string;
    nom: string;
    email: string;
    numeroTelephone?: string;
    role: string;
  };
  odc?: string;
  specialite?: string;
  dateIntegration?: string;
  actif: boolean;
  entity?: {
    ville: string;
  };
  imageFormateur?: string;
  cv: File | null;
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

const GestionFormateurManager = () => {
  const {
    edcFormateurs,
    loading,
    error,
    fetchEdcFormateurs
  } = useEdc();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const navigate = useNavigate();
  
  const handleEdit = (id: string) => {
    navigate(`/manager/ModifieFormateur/${id}`);
  };

  useEffect(() => {
    fetchEdcFormateurs();
  }, [fetchEdcFormateurs]);

  const transformedFormateurs = edcFormateurs && edcFormateurs.length > 0
    ? edcFormateurs.map(formateur => ({
        id: formateur._id,
        nom: `${formateur.utilisateur.prenom} ${formateur.utilisateur.nom}`,
        odc: formateur.entity?.ville || "ODC Rabat",
        role: formateur.utilisateur.role || "Responsable Formateur",
        depuis: formateur.dateIntegration ? new Date(formateur.dateIntegration).getFullYear().toString() : "2023",
        actif: formateur.actif !== false,
        image: formateur.imageFormateur || null,
      }))
    : [
        { id: "1", nom: "Nom/Prénom", odc: "ODC Rabat", role: "Responsable Formateur ODC Rabat", depuis: "2023", actif: true, image: null },
        { id: "2", nom: "Nom/Prénom", odc: "ODC Rabat", role: "Responsable Formateur ODC Rabat", depuis: "2023", actif: true, image: null },
      ];

  const filteredFormateurs = transformedFormateurs.filter(formateur => {
    const matchesSearch = formateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formateur.odc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === "actif" && formateur.actif) || 
      (statusFilter === "inactif" && !formateur.actif);
    
    const matchesCity = !cityFilter || formateur.odc.toLowerCase() === cityFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p>Erreur de chargement des formateurs : {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[28px] font-bold leading-[28px] text-black">
            Gestion des Formateurs
          </h1>
          <button 
            onClick={() => navigate('/manager/AjoutFormateur')}
            className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          >
            <span className="mr-2">+</span>
            Ajouter un formateur
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un formateur..."
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
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
          
          <select 
            className="border rounded px-3 py-2 font-semibold"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Toutes les villes</option>
            <option value="rabat">Rabat</option>
            <option value="casablanca">Casablanca</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFormateurs.map((formateur) => (
            <div key={formateur.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <Avatar 
                    imageUrl={formateur.image} 
                    name={formateur.nom} 
                  />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{formateur.nom}</h3>
                    <p className="text-sm text-gray-600">{formateur.odc}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formateur.actif ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {formateur.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="p-4 text-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-gray-500 mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="19" viewBox="0 0 23 19" fill="none">
                      <g clipPath="url(#clip0_1171_1634)">
                        <path d="M14.1163 0.0445867C13.5054 -0.137249 12.8693 0.230134 12.6932 0.860993L8.0932 17.486C7.91711 18.1169 8.27289 18.7737 8.88383 18.9555C9.49476 19.1374 10.1309 18.77 10.307 18.1391L14.907 1.51412C15.083 0.883259 14.7273 0.226423 14.1163 0.0445867ZM17.0129 4.50142C16.5637 4.96529 16.5637 5.71861 17.0129 6.18248L20.2221 9.50006L17.0093 12.8176C16.5601 13.2815 16.5601 14.0348 17.0093 14.4987C17.4585 14.9626 18.188 14.9626 18.6373 14.4987L22.6623 10.3424C23.1115 9.87857 23.1115 9.12525 22.6623 8.66138L18.6373 4.50513C18.188 4.04127 17.4585 4.04127 17.0093 4.50513L17.0129 4.50142ZM5.99086 4.50142C5.54164 4.03756 4.81211 4.03756 4.36289 4.50142L0.337891 8.65767C-0.111328 9.12154 -0.111328 9.87486 0.337891 10.3387L4.36289 14.495C4.81211 14.9588 5.54164 14.9588 5.99086 14.495C6.44008 14.0311 6.44008 13.2778 5.99086 12.8139L2.77805 9.50006L5.99086 6.18248C6.44008 5.71861 6.44008 4.96529 5.99086 4.50142Z" fill="black"/>
                      </g>
                    </svg>
                  </span>
                  <p className="text-sm">{formateur.role}</p>
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-gray-500 mr-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="18" viewBox="0 0 16 18" fill="none">
                      <g clipPath="url(#clip0_1171_1638)">
                        <path d="M3.42857 1.125V2.25H1.71429C0.767857 2.25 0 3.00586 0 3.9375V5.625H16V3.9375C16 3.00586 15.2321 2.25 14.2857 2.25H12.5714V1.125C12.5714 0.502734 12.0607 0 11.4286 0C10.7964 0 10.2857 0.502734 10.2857 1.125V2.25H5.71429V1.125C5.71429 0.502734 5.20357 0 4.57143 0C3.93929 0 3.42857 0.502734 3.42857 1.125ZM16 6.75H0V16.3125C0 17.2441 0.767857 18 1.71429 18H14.2857C15.2321 18 16 17.2441 16 16.3125V6.75Z" fill="black"/>
                      </g>
                    </svg>
                  </span>
                  <p className="text-sm">Depuis {formateur.depuis}</p>
                </div>
              </div>

              <div className="flex border-t">
                <button className="flex-1 py-2 text-center text-white bg-black text-sm flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                    <g clipPath="url(#clip0_1171_1644)">
                      <path d="M7.87505 2.9375C6.09224 2.9375 4.62661 3.74688 3.50278 4.78867C2.45005 5.76758 1.72271 6.92969 1.35083 7.75C1.72271 8.57031 2.45005 9.73242 3.50005 10.7113C4.62661 11.7531 6.09224 12.5625 7.87505 12.5625C9.65786 12.5625 11.1235 11.7531 12.2473 10.7113C13.3 9.73242 14.0274 8.57031 14.3993 7.75C14.0274 6.92969 13.3 5.76758 12.25 4.78867C11.1235 3.74688 9.65786 2.9375 7.87505 2.9375ZM2.60864 3.82891C3.89653 2.63125 5.66567 1.625 7.87505 1.625C10.0844 1.625 11.8536 2.63125 13.1415 3.82891C14.4211 5.01836 15.277 6.4375 15.6844 7.41367C15.7747 7.62969 15.7747 7.87031 15.6844 8.08633C15.277 9.0625 14.4211 10.4844 13.1415 11.6711C11.8536 12.8687 10.0844 13.875 7.87505 13.875C5.66567 13.875 3.89653 12.8687 2.60864 11.6711C1.32896 10.4844 0.473096 9.0625 0.0684082 8.08633C-0.0218262 7.87031 -0.0218262 7.62969 0.0684082 7.41367C0.473096 6.4375 1.32896 5.01562 2.60864 3.82891ZM7.87505 9.9375C9.08364 9.9375 10.0625 8.95859 10.0625 7.75C10.0625 6.54141 9.08364 5.5625 7.87505 5.5625C7.85591 5.5625 7.8395 5.5625 7.82036 5.5625C7.85591 5.70195 7.87505 5.84961 7.87505 6C7.87505 6.96523 7.09028 7.75 6.12505 7.75C5.97466 7.75 5.827 7.73086 5.68755 7.69531C5.68755 7.71445 5.68755 7.73086 5.68755 7.75C5.68755 8.95859 6.66646 9.9375 7.87505 9.9375ZM7.87505 4.25C8.80331 4.25 9.69355 4.61875 10.3499 5.27513C11.0063 5.9315 11.375 6.82174 11.375 7.75C11.375 8.67826 11.0063 9.5685 10.3499 10.2249C9.69355 10.8813 8.80331 11.25 7.87505 11.25C6.94679 11.25 6.05655 10.8813 5.40018 10.2249C4.7438 9.5685 4.37505 8.67826 4.37505 7.75C4.37505 6.82174 4.7438 5.9315 5.40018 5.27513C6.05655 4.61875 6.94679 4.25 7.87505 4.25Z" fill="white"/>
                    </g>
                  </svg>
                  Détails
                </button>
                <button 
                  className="flex-1 py-2 text-center text-sm border-l flex items-center justify-center gap-2"
                  onClick={() => handleEdit(formateur.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                    <g clipPath="url(#clip0_1171_1650)">
                      <path d="M12.0586 2.36052L12.3895 2.69138C12.6465 2.94841 12.6465 3.36404 12.3895 3.61834L11.5938 4.41677L10.3332 3.15623L11.1289 2.36052C11.3859 2.10349 11.8016 2.10349 12.0559 2.36052H12.0586ZM5.73672 7.75544L9.40625 4.08318L10.6668 5.34373L6.99453 9.01326C6.91523 9.09255 6.8168 9.14998 6.71016 9.18005L5.11055 9.63669L5.56719 8.03709C5.59727 7.93044 5.65469 7.83201 5.73398 7.75271L5.73672 7.75544ZM10.202 1.43357L4.80703 6.82576C4.56914 7.06365 4.39687 7.35623 4.30664 7.67615L3.52461 10.4105C3.45898 10.6402 3.52187 10.8863 3.69141 11.0558C3.86094 11.2254 4.10703 11.2883 4.33672 11.2226L7.07109 10.4406C7.39375 10.3476 7.68633 10.1754 7.92148 9.94021L13.3164 4.54802C14.0848 3.77966 14.0848 2.53279 13.3164 1.76443L12.9855 1.43357C12.2172 0.66521 10.9703 0.66521 10.202 1.43357ZM2.40625 2.49998C1.07734 2.49998 0 3.57732 0 4.90623V12.3437C0 13.6726 1.07734 14.75 2.40625 14.75H9.84375C11.1727 14.75 12.25 13.6726 12.25 12.3437V9.28123C12.25 8.91755 11.9574 8.62498 11.5938 8.62498C11.2301 8.62498 10.9375 8.91755 10.9375 9.28123V12.3437C10.9375 12.948 10.448 13.4375 9.84375 13.4375H2.40625C1.80195 13.4375 1.3125 12.948 1.3125 12.3437V4.90623C1.3125 4.30193 1.80195 3.81248 2.40625 3.81248H5.46875C5.83242 3.81248 6.125 3.5199 6.125 3.15623C6.125 2.79255 5.83242 2.49998 5.46875 2.49998H2.40625Z" fill="black"/>
                    </g>
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

export default GestionFormateurManager;