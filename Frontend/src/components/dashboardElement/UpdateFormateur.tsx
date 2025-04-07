import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Download, Eye } from 'lucide-react';
import { useEdc } from "@/contexts/EdcContext";
import { useFormateur } from "@/contexts/FormateurContext";

export interface Formateur {
  _id: string;
  utilisateur: {
    prenom: string;
    nom: string;
    email: string;
    telephone?: string;
    role: string;
  };
  odc?: string;
  ville?: string;
  specialite?: string;
  experience: string | number;
  dateIntegration?: string;
  actif: boolean;
  aPropos?: string;
  entity?: {
    type: string;
    ville: string;
    _id?: string;
  };
   cv: File | string | null; 
  imageFormateur: File | string | null;
  cvUrl?: string;
}

export const UpdateFormateur: React.FC = () => {
  const { id } = useParams();
  const { edcs, fetchEdcs } = useEdc();
  const { updateFormateur, getFormateurById, loading } = useFormateur();
  const [formateur, setFormateur] = useState<Formateur>({
    _id: '',
    utilisateur: {
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      role: 'formateur'
    },
    specialite: '',
    experience: '',
    dateIntegration: '',
    actif: true,
    aPropos: '',
    ville: '',
    entity: {
      type: '',
      ville: ''
    },
    imageFormateur: null,
    cv: null
  });
  
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [existingCvUrl, setExistingCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEdcs();
  }, [fetchEdcs]);
  
  useEffect(() => {
    const loadFormateurData = async () => {
      if (id && typeof id === 'string') {
        try {
          setIsLoading(true);
          const formateurData = await getFormateurById(id);
          
          // Format the date to YYYY-MM-DD for input type="date"
          let formattedDate = '';
          if (formateurData.dateIntegration) {
            const date = new Date(formateurData.dateIntegration);
            formattedDate = date.toISOString().split('T')[0];
          }
          
          // Set ville directly from entity if available
          let villeValue = '';
          if (formateurData.entity && formateurData.entity.ville) {
            villeValue = formateurData.entity.ville;
          }
          
          setFormateur({
            _id: formateurData._id,
            utilisateur: {
              prenom: formateurData.utilisateur.prenom || '',
              nom: formateurData.utilisateur.nom || '',
              email: formateurData.utilisateur.email || '',
              telephone: formateurData.utilisateur.telephone || '',
              role: formateurData.utilisateur.role || 'formateur'
            },
            specialite: formateurData.specialite || '',
            experience: formateurData.experience || '',
            dateIntegration: formattedDate,
            actif: formateurData.actif !== undefined ? formateurData.actif : true,
            aPropos: formateurData.aPropos || '',
            ville: villeValue, // Set ville value
            entity: formateurData.entity || {
              type: '',
              ville: ''
            },
            imageFormateur: formateurData.imageFormateur || null,
            cv: null
          });
          
          // Set image preview if available
          if (formateurData.imageFormateur && typeof formateurData.imageFormateur === 'string') {
            setImagePreviewUrl(formateurData.imageFormateur);
          }
          
          // Set CV info if available
          if (formateurData.cv && typeof formateurData.cv === 'string') {
            setExistingCvUrl(formateurData.cv);
            // Extract filename from URL
            const cvFileName = formateurData.cv.split('/').pop() || 'CV actuel';
            setCvName(decodeURIComponent(cvFileName));
          }
        } catch (error) {
          console.error("Error loading formateur data:", error);
          setSubmitError("Erreur lors du chargement des données du formateur");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadFormateurData();
  }, [id, getFormateurById, edcs]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Gestion des champs imbriqués
    if (name in formateur.utilisateur) {
      setFormateur(prev => ({
        ...prev,
        utilisateur: {
          ...prev.utilisateur,
          [name]: value
        }
      }));
    } else if (formateur.entity && name in formateur.entity) {
      setFormateur(prev => ({
        ...prev,
        entity: {
          ...prev.entity!,
          [name]: value
        }
      }));
    } else {
      setFormateur(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleCvButtonClick = () => {
    cvInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Vérification plus stricte du type d'image
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setSubmitError('Le format de l\'image doit être JPG, JPEG ou PNG');
        return;
      }
      
      setFormateur(prev => ({
        ...prev,
        imageFormateur: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Vérification plus stricte du type de CV
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setSubmitError(`Le CV doit être au format PDF ou DOC/DOCX. Type détecté: ${file.type}`);
        return;
      }
      
      setFormateur(prev => ({
        ...prev,
        cv: file
      }));
      setCvName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setFormateur(prev => ({
      ...prev,
      imageFormateur: null
    }));
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    // Ajoutez cette ligne pour indiquer la suppression
    setSubmitError('imageRemoved');
  };
  
  const handleRemoveCv = () => {
    setFormateur(prev => ({
      ...prev,
      cv: null
    }));
    setExistingCvUrl(null);
    setCvName(null);
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
    // Ajoutez cette ligne pour indiquer la suppression
    setSubmitError('cvRemoved');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validation des fichiers
    if (!formateur.imageFormateur && !imagePreviewUrl && submitError !== 'imageRemoved') {
      setSubmitError('Veuillez sélectionner une image');
      return;
    }
    
    if (!formateur.cv && !existingCvUrl && submitError !== 'cvRemoved') {
      setSubmitError('Veuillez sélectionner un CV');
      return;
    }
    
    setShowConfirmModal(true);
  };
  
  const handleConfirmSubmit = async () => {
    if (!id || typeof id !== 'string') {
      setSubmitError('ID du formateur non disponible');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
  
      // Ajout des champs texte
      formData.append('prenom', formateur.utilisateur.prenom);
      formData.append('nom', formateur.utilisateur.nom);
      formData.append('email', formateur.utilisateur.email);
      formData.append('numeroTelephone', formateur.utilisateur.telephone || '');
      formData.append('specialite', formateur.specialite || '');
      formData.append('experience', formateur.experience.toString());
      formData.append('dateIntegration', formateur.dateIntegration || '');
      formData.append('aPropos', formateur.aPropos || '');
  
      // Gestion de l'entité
      const selectedEdc = edcs.find(edc => edc.entity.ville === formateur.entity?.ville);
      if (selectedEdc) {
        formData.append('entityId', selectedEdc.entity._id);
      }
  
      // Gestion du CV
      // Gestion du CV
if (formateur.cv instanceof File) {
  formData.append('cv', formateur.cv);
  formData.append('updateCv', 'true');
} else if (submitError === 'cvRemoved') {
  // Explicitly indicate CV should be removed
  formData.append('updateCv', 'true');
  formData.append('removeCv', 'true'); // Add this line
} else if (existingCvUrl) {
  // Keep existing CV
  formData.append('keepExistingCv', 'true');
} else {
  setSubmitError('Veuillez fournir un CV');
  return;
}

  
      // Gestion de l'image
      if (formateur.imageFormateur instanceof File) {
        formData.append('imageFormateur', formateur.imageFormateur);
        // Indiquer au backend de remplacer l'ancienne image
        formData.append('updateImage', 'true');
      } else if (imagePreviewUrl) {
        // Garder l'ancienne image
        formData.append('keepExistingImage', 'true');
      } else {
        setSubmitError('Veuillez fournir une image');
        return;
      }
  
      // Envoi des données pour la mise à jour
      const response = await updateFormateur(id, formData);
      console.log('Formateur mis à jour avec succès:', response);
  
      // Redirection après mise à jour réussie
      window.location.href = '/manager/GestionFormateurManager';
  
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      let errorMessage = 'Erreur lors de la mise à jour du formateur. Veuillez réessayer.';
      
      if (error.response) {
        console.log("Données de réponse d'erreur:", error.response.data);
        console.log("Statut de réponse d'erreur:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleRetour = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
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
      
      <h2 className="text-2xl font-bold mb-6 mt-4">Modifier un formateur</h2>
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}
      
      {showConfirmModal && (         
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modifier un formateur</h3>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mb-6 text-[#666666]">Voulez-vous confirmer les modifications?</p>      
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
                className="px-4 py-2 bg-[#50BE87] text-white rounded hover:bg-[#50BE87]"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Chargement...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 pl-6">Informations personnelles</h3>
          
          
          <div className="grid grid-cols-2 gap-6">
            <div className="pl-6">
              <label htmlFor="prenom" className="block text-sm font-bold font-inter mb-2">
                Prénom <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="prenom" 
                name="prenom"
                value={formateur.utilisateur.prenom}
                onChange={handleInputChange}
                placeholder="Mohamed"
                className="w-full"
                required
              />
            </div>
            <div className="pr-6">
              <label htmlFor="nom" className="block text-sm font-bold font-inter mb-2">
                Nom <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="nom" 
                name="nom"
                value={formateur.utilisateur.nom}
                onChange={handleInputChange}
                placeholder="Bikarrane"
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="email" className="block text-sm font-bold font-inter mb-2">
                Adresse Email <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formateur.utilisateur.email}
                onChange={handleInputChange}
                placeholder="mohamed.bikarrane@orange.com"
                className="w-[600px]"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="telephone" className="block text-sm font-bold font-inter mb-2">
                Téléphone <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="telephone" 
                name="telephone"
                value={formateur.utilisateur.telephone || ''}
                onChange={handleInputChange}
                placeholder="060011220033"
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6 pb-2">
              <label htmlFor="ville" className="block text-sm font-bold font-inter mb-2">
                Ville <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Select 
  value={formateur.entity?.ville || ''}
  onValueChange={(value) => {
    const selectedEdc = edcs.find(edc => edc.entity.ville === value);
    if (selectedEdc) {
      setFormateur(prev => ({
        ...prev,
        entity: {
          ...prev.entity!,
          ville: value,
          _id: selectedEdc.entity._id,
          type: selectedEdc.entity.type
        }
      }));
      setSelectedEntityId(selectedEdc.entity._id);
    }
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Sélectionnez une ville" />
  </SelectTrigger>
  <SelectContent>
    {edcs.map((edc) => (
      <SelectItem 
        key={edc._id}  // Use the EDC's _id as key instead of ville
        value={edc.entity.ville}
      >
        {`${edc.entity.type} ${edc.entity.ville}`}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>
        </div>
      </div>

        {/* Informations professionnelles */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 pl-6">Informations professionnelles</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 px-6">
              <label htmlFor="specialite" className="block text-sm font-bold font-inter mb-2">
                Spécialité <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="specialite" 
                name="specialite"
                value={formateur.specialite || ''}
                onChange={handleInputChange}
                placeholder="UX/UI Design"
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="experience" className="block text-sm font-bold font-inter mb-2">
                Expérience (années) <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="experience" 
                name="experience"
                type="number"
                value={formateur.experience}
                onChange={handleInputChange}
                placeholder="07"
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="dateIntegration" className="block text-sm font-bold font-inter mb-2">
                Date d'inscription <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="dateIntegration" 
                name="dateIntegration"
                type="date"
                value={formateur.dateIntegration || ''}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="aPropos" className="block text-sm font-bold font-inter mb-2">
                À propos <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <textarea 
                id="aPropos"
                name="aPropos"
                value={formateur.aPropos || ''}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Mohamed Bikarrane, un passionné d'UX/UI Design. Avec une expérience sur plus de 20 projets diversifiés. Ma passion est la créativité."
                rows={4}
                required
              />
            </div>

            {/* CV Upload */}
            <div className="col-span-2 px-6">
            <label className="block text-sm font-bold text-black mb-2">
              CV <span className="text-red-500">*</span>
            </label>
            <div className="border-4 border-dashed border-gray-300 p-6 relative" style={{ borderSpacing: '10px' }}>
              {cvName || existingCvUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 w-full max-w-sm mx-auto">
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {cvName || 'CV actuel'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {existingCvUrl && (
                          <>
                            <a 
                              href={existingCvUrl} 
                              download 
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Download size={16} className="cursor-pointer" />
                            </a>
                            <a 
                              href={existingCvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Eye size={16} className="cursor-pointer" />
                            </a>
                          </>
                        )}
                        <button 
                          type="button"
                          onClick={handleRemoveCv}
                          className="p-1 text-gray-600 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    onChange={handleCvChange}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="rounded-none hidden"
                    ref={cvInputRef}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleCvButtonClick}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-12 h-12 mb-4 text-black">
                      <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Formats supportés: <strong>PDF, DOC, DOCX</strong>.
                    </p>
                    <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
                      Select a file
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

            {/* Image Upload */}
            <div className="col-span-2 px-6">
              <label className="block text-sm font-bold text-black mb-2">
                Image Formateur <span className="text-red-500">*</span>
              </label>
              <div className="border-4 border-dashed border-gray-300 p-6 relative" style={{ borderSpacing: '10px' }}>
                {imagePreviewUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4 w-full max-w-sm mx-auto">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Prévisualisation" 
                        className="w-full h-auto rounded object-cover max-h-60"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {formateur.imageFormateur instanceof File ? formateur.imageFormateur.name : "Image actuelle"}
                        </span>
                        <button 
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1 text-gray-600 hover:text-red-500"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="rounded-none hidden"
                      ref={imageInputRef}
                    />
                    <button
                      type="button"
                      onClick={handleImageButtonClick}
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <div className="w-12 h-12 mb-4 text-black">
                        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Taille maximum: <strong>2 MB</strong>. Formats supportés: jpg, jpeg, png.
                      </p>
                      <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
                        Select a file
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-orange-500 hover:bg-orange-600"
            disabled={loading || isSubmitting}
          >
            Mettre à jour
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateFormateur;