import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from 'lucide-react';
import { useEdc } from "@/contexts/EdcContext";
import { useFormateur } from "@/contexts/FormateurContext";

interface Formateur {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  specialite: string;
  experience: string;
  dateInscription: string;
  description: string;
  cv: File | null;
  imageFormateur: File | null;
}

export const AjoutFormateur: React.FC = () => {
  const { edcs, fetchEdcs } = useEdc();
  const { addFormateur, loading } = useFormateur();
  const [formateur, setFormateur] = useState<Formateur>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    specialite: '',
    experience: '',
    dateInscription: '',
    description: '',
    cv: null,
    imageFormateur: null
  });
  
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEdcs();
  }, [fetchEdcs]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormateur(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      console.log("Image file type:", file.type); // Debug info
      
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
        console.log("Invalid file type:", file.type); // Debug info
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
    setSubmitError(null);
  };

  const handleRemoveCv = () => {
    setFormateur(prev => ({
      ...prev,
      cv: null
    }));
    setCvName(null);
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Validation pour les fichiers
    if (!formateur.imageFormateur || !formateur.cv) {
      setSubmitError('Veuillez sélectionner une image et un CV');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const formData = new FormData();
            
      // Ajout des champs texte
      formData.append('prenom', formateur.prenom);
      formData.append('nom', formateur.nom);
      formData.append('email', formateur.email);
      formData.append('numeroTelephone', formateur.telephone);
      formData.append('specialite', formateur.specialite);
      formData.append('experience', formateur.experience);
      formData.append('dateIntegration', formateur.dateInscription);
      formData.append('aPropos', formateur.description);
  
      // Extraction correcte de l'ID de l'entité
      const villeValue = formateur.ville;
      if (villeValue && villeValue.includes('-')) {
        const entityId = villeValue.split('-')[0]; // Cette valeur sera maintenant edc.entity._id
        formData.append('entityId', entityId);
      } else {
        formData.append('entityId', villeValue);
      }
  
      // Ajout des fichiers avec information explicite sur le type
      if (formateur.cv) {
        formData.append('cv', formateur.cv);
        
        // Détermine le type de CV
        let cvType = '';
        if (formateur.cv.type === 'application/pdf') {
          cvType = 'pdf';
        } else if (formateur.cv.type === 'application/msword') {
          cvType = 'doc';
        } else if (formateur.cv.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          cvType = 'docx';
        }
        formData.append('cvType', cvType);
      }
  
      if (formateur.imageFormateur) {
        formData.append('imageFormateur', formateur.imageFormateur);
        
        // Détermine le type d'image
        let imageType = '';
        if (formateur.imageFormateur.type === 'image/jpeg') {
          imageType = 'jpg';
        } else if (formateur.imageFormateur.type === 'image/png') {
          imageType = 'png';
        }
        formData.append('imageType', imageType);
      }
      
      // Debug - Affiche ce que nous envoyons
      console.log("Envoi du formulaire avec les données:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `${pair[1].name} (${pair[1].type})` : pair[1]));
      }
      
      // Envoi des données
      const response = await addFormateur(formData);
      console.log('Formateur ajouté avec succès:', response);
      
      resetForm();
      window.location.href = '/manager/GestionFormateurManager';
      
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      let errorMessage = 'Erreur lors de l\'ajout du formateur. Veuillez réessayer.';
      
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
    }
  };
  
  const resetForm = () => {
    setFormateur({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      ville: '',
      specialite: '',
      experience: '',
      dateInscription: '',
      description: '',
      cv: null,
      imageFormateur: null
    });
    setImagePreviewUrl(null);
    setCvName(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  const handleRetour = () => {
    window.history.back();
  };

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
      
      <h2 className="text-2xl font-bold mb-6 mt-4">Ajouter un formateur</h2>
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
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
                value={formateur.prenom}
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
                value={formateur.nom}
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
                value={formateur.email}
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
                value={formateur.telephone}
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
                value={formateur.ville}
                onValueChange={(value) => setFormateur(prev => ({...prev, ville: value}))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une ville" />
                </SelectTrigger>
                <SelectContent>
                {edcs.map((edc) => {
                  // Utilisez entity._id au lieu de _id dans la valeur
                  const uniqueValue = `${edc.entity._id}-${edc.entity.ville}`;
                  return (
                    <SelectItem 
                      key={uniqueValue}
                      value={uniqueValue}
                    >
                      {`${edc.entity.type} ${edc.entity.ville}`}
                    </SelectItem>
                  );
                })}
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
                value={formateur.specialite}
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
              <label htmlFor="dateInscription" className="block text-sm font-bold font-inter mb-2">
                Date d'inscription <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <Input 
                id="dateInscription" 
                name="dateInscription"
                type="date"
                value={formateur.dateInscription}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="col-span-2 px-6">
              <label htmlFor="description" className="block text-sm font-bold font-inter mb-2">
                À propos <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
              </label>
              <textarea 
                id="description"
                name="description"
                value={formateur.description}
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
                {cvName ? (
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4 w-full max-w-sm mx-auto">
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-700 truncate flex-1">
                          {cvName}
                        </span>
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
                          {formateur.imageFormateur?.name}
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
                      required
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
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? 'Chargement...' : 'Ajouter un formateur'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AjoutFormateur;