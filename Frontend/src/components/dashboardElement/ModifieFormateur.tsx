import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Download, Eye } from 'lucide-react';
import { useEdc } from '@/contexts/EdcContext';

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
  aPropos?:string;
  entity?: {
    ville: string;
  };
  imageFormateur?: string;
  cv: File | null;
}

const ModifieFormateur: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { edcFormateurs, loading, error } = useEdc();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    specialite: '',
    experience: '',
    dateIntegration: '',
    aPropos: '',
    image: '',
    cv:null
  });

  useEffect(() => {
    if (edcFormateurs && id) {
      const formateur = edcFormateurs.find(f => f._id === id);
      if (formateur) {
        setFormData({
          prenom: formateur.utilisateur.prenom || '',
          nom: formateur.utilisateur.nom || '',
          email: formateur.utilisateur.email || '',
          telephone: formateur.utilisateur.numeroTelephone || '',
          adresse: formateur.entity?.ville || '',
          specialite: formateur.specialite || '',
          experience: formateur.experience || '',
          dateIntegration: formateur.dateIntegration ? new Date(formateur.dateIntegration).toLocaleDateString() : '',
          aPropos: formateur.aPropos || '',
          image: formateur.imageFormateur || '',
          cv: formateur.cv || ''
        });
      }
    }
  }, [edcFormateurs, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRetour = () => {
    window.history.back();
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto p-8 bg-white">
        <button           
          className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"           
          onClick={handleRetour}         
        >           
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">             
            <path d="M10.6665 4.65625L5.21143 10L10.6665 15.3437L12.2251 13.8177L8.32784 10L12.2251 6.1838L10.6665 4.65625Z" fill="#F16E00"/>           
          </svg>           
          <span className="text-lg font-bold text-[#000000]"> Retour</span>         
        </button>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <div>
            <h1 className="text-xl pl-8 font-bold">{formData.prenom} {formData.nom}</h1>
            <p className="text-gray-500 pl-8 text-sm">Responsable Formateur</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select 
                className="bg-gray-100 border border-gray-300 text-gray-800 rounded px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300" 
                style={{ width: '300px', height: '40px' }}
              >
                <option>Actif</option>
                <option>Inactif</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <button 
              className="bg-black text-white px-1 rounded" 
              style={{ width: '148px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}
            >
              Modifier formateur
            </button>
          </div>
        </div>

        {/* Card - Personal Information */}
        <div className="border mb-7 p-6 rounded-[4px]">
          <h2 className="text-lg font-semibold mb-5 pl-1">Informations personnelles</h2>
          
          {/* Profile Image */}
          <div className="mb-9">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt={`${formData.prenom} ${formData.nom}`}
                className="w-40 h-40 rounded-full object-cover"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Form fields - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prenom" className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Prénom <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Nom <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Adresse Email <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Téléphone <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Adresse (Ville) <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Card - Professional Information */}
        <div className="border p-6 rounded-[4px]">
          <h2 className="text-lg font-semibold mb-5 pl-1">Informations professionnelles</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Spécialité <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="specialite"
                value={formData.specialite}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Experience (années) <span className="text-[#CD3C14]">*</span>
              </label>
              <input 
                type="text" 
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                Date d'intégration <span className="text-[#CD3C14]">*</span>
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  name="dateIntegration"
                  value={formData.dateIntegration}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 pr-10"
                />
                <Calendar className="absolute right-3 top-3 text-gray-500" size={16} />
              </div>
            </div>

            {/* About section */}
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                À propos <span className="text-[#CD3C14]">*</span>
              </label>
              <textarea 
                name="aPropos"
                value={formData.aPropos}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2 h-24"
              />
            </div>
            
            {/* CV Section */}
            <div>
              <label className="block text-sm font-bold font-inter mb-2 text-[#666666]">
                CV <span className="text-[#CD3C14]">*</span>
              </label>
              {formData.cv ? (
                <div className="border-t border-b rounded-none p-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2">📄</span>
                    <span>CV_{formData.prenom}_{formData.nom}.pdf</span>
                    <span className="ml-4 text-gray-400 text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={formData.cv} 
                      download 
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Download size={16} className="cursor-pointer" />
                    </a>
                    <a 
                      href={formData.cv} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Eye size={16} className="cursor-pointer" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="border-t border-b rounded-none p-2 text-gray-500">
                  Aucun CV téléchargé
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          <button className="bg-red-50 font-bold text-[#CD3C14] px-4 py-2 rounded">Supprimer</button>
          <button 
            className="bg-black text-white px-1 rounded" 
            style={{ width: '148px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}
          >
            Modifier formateur
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifieFormateur;