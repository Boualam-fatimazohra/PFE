import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Download, Eye } from 'lucide-react';
import { useEdc } from '@/contexts/EdcContext';
import { useFormateur } from '@/contexts/FormateurContext';

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
  aPropos?: string;
  entity?: {
    type: string;
    ville: string;
  };
  imageFormateur?: string;
  cv: File | null;
  experience?: string;
}

const DetailFormateur: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { edcFormateurs, loading, error } = useEdc();
  const { deleteFormateur } = useFormateur();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    cv: null,
    entity: '',
    ville: ''
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
          cv: formateur.cv || null,
          entity: formateur.entity?.type || '',
          ville: formateur.entity?.ville || ''
        });
      }
    }
  }, [edcFormateurs, id]);

  const handleRetour = () => {
    navigate(-1); // Utilisation de navigate pour la navigation
  };

  const handleEdit = () => {
    navigate(`/manager/updateFormateur/${id}`); // Passage de l'ID dans l'URL
  };

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await deleteFormateur(id);
      setShowConfirmModal(false);
      navigate('/GestionFormateurManager');
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="text-gray-500 pl-8 text-sm">Responsable Formateur {formData.entity} {formData.ville}</p>
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
              onClick={handleEdit}
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                  className="w-full border rounded px-3 py-2 pr-10 bg-gray-100 text-gray-700 cursor-not-allowed"
                  readOnly
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
                className="w-full border rounded px-3 py-2 h-24 bg-gray-100 text-gray-700 cursor-not-allowed"
                readOnly
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
                    <span className="mr-2">
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="38" height="38" rx="4" fill="#EEEEEE"/>
                    <path d="M22.5 7.9165V9.6665C22.5 11.3162 22.5 12.141 23.0133 12.6532C23.5243 13.1665 24.3492 13.1665 26 13.1665H27.75" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.6665 23.6666V14.3333C9.6665 11.0339 9.6665 9.38309 10.692 8.35875C11.7163 7.33325 13.3672 7.33325 16.6665 7.33325H21.5338C22.0098 7.33325 22.249 7.33325 22.4637 7.42192C22.6772 7.51059 22.8463 7.67859 23.1835 8.01692L27.6495 12.4829C27.9878 12.8213 28.1558 12.9893 28.2445 13.2039C28.3332 13.4174 28.3332 13.6566 28.3332 14.1326V23.6666C28.3332 26.9659 28.3332 28.6168 27.3077 29.6411C26.2833 30.6666 24.6325 30.6666 21.3332 30.6666H16.6665C13.3672 30.6666 11.7163 30.6666 10.692 29.6411C9.6665 28.6168 9.6665 26.9659 9.6665 23.6666Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 17.8333V21.3333M19 21.3333V24.8333M19 21.3333H13.75M19 21.3333H24.25M16.0833 24.8333H21.9167C23.0168 24.8333 23.5663 24.8333 23.9082 24.4914C24.25 24.1496 24.25 23.6001 24.25 22.4999V20.1666C24.25 19.0664 24.25 18.5169 23.9082 18.1751C23.5663 17.8333 23.0168 17.8333 21.9167 17.8333H16.0833C14.9832 17.8333 14.4337 17.8333 14.0918 18.1751C13.75 18.5169 13.75 19.0664 13.75 20.1666V22.4999C13.75 23.6001 13.75 24.1496 14.0918 24.4914C14.4337 24.8333 14.9832 24.8333 16.0833 24.8333Z" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                    </span>
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
          <button 
            className="bg-red-50 font-bold text-[#CD3C14] px-4 py-2 rounded"
            onClick={handleDelete}
          >
            Supprimer
          </button>
          <button 
            className="bg-black text-white px-1 rounded" 
            style={{ width: '148px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}
            onClick={handleEdit}
          >
            Modifier formateur
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Supprimer un formateur</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-6 text-[#666666]">
              Êtes-vous sûr de vouloir supprimer ce formateur ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded text-[#999999] hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-[#CD3C14] text-white rounded hover:bg-[#B03010]"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Chargement...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailFormateur;