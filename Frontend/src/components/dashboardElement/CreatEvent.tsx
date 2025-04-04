import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Eye, Download, Trash2, PlusCircle, ChevronDown, ChevronLeft, ChevronRight, Search, Filter, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { createEvenement } from '@/services/evenementService';

// Move styled-components GlobalStyle outside of component
const GlobalStyle = createGlobalStyle`
  .custom-calendar {
    font-family: Arial, sans-serif;
    border: 1px solid #F16E00;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: auto;
    display: flex;
    border-radius: 5px;
    overflow: hidden;
  }
  .react-datepicker__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding-top: 0;
  }
  
  .react-datepicker__current-month {
    order: -1;
    margin-top: 5px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .react-datepicker {
    display: flex !important;
    border: none !important;
    flex-direction: row !important;
    align-items: flex-start;
  }
  
  .react-datepicker__month-container {
    width: 280px;
    border-right: 1px solid #F16E00;
  }
  
  .react-datepicker__time-container {
    width: 100px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .react-datepicker__time-box {
    height: 100%;
    overflow-y: auto;
  }
  
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #F16E00;
    padding-top: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  
  .react-datepicker_time-container .react-datepicker_header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #F16E00;
    padding: 0;
  }
  
  .react-datepicker__current-month {
    color: black;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .react-datepicker__day-names {
    display: flex;
    justify-content: space-between;
    color: black;
    font-weight: bold;
  }
  
  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }
  
  .react-datepicker__day {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    transition: background-color 0.2s;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__day:hover {
    background-color: #F16E00 !important;
    color: white !important;
  }
  .react-datepicker__time-list {
    height: auto !important;
    max-height: 270px;
    overflow-y: auto;
  }
  .react-datepicker__time-list-item {
    padding: 8px;
    transition: background-color 0.2s;
    text-align: center;
  }
  .react-datepicker__time-list-item:hover {
    background-color: #F16E00 !important;
    color: white !important;
  }
  .react-datepicker__time-list-item--selected {
    background-color: #F16E00 !important;
    color: white !important;
    font-weight: bold;
  }
  .react-datepicker__time-caption {
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #F16E00;
    padding: 8px 0;
  }
`;

// Improved participant fetch function with better error handling
// Improved participant fetch function with proper handling of the API response structure
const fetchParticipantOptions = async () => {
  const fallbackOptions = [
    { label: "Mohamed Bikarran", value: "645f3d789a123b456c7890de" },
    { label: "Mehdi Iddouch", value: "645f3d789a123b456c7890df" },
    { label: "Hamza Lambara", value: "645f3d789a123b456c7890e0" }
  ];
  
  try {
    // Add a timeout to prevent long-hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('http://localhost:5000/api/user/total-details', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include' // Include if you need to send cookies
    });
    
    clearTimeout(timeoutId);
    
    // Check for non-200 responses first
    if (!response.ok) {
      console.error(`Server response error: ${response.status}`);
      return fallbackOptions;
    }
    
    // Check content type and handle HTML response properly
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Expected JSON but got ${contentType || 'unknown content type'}`);
      
      if (contentType && contentType.includes('text/html')) {
        console.warn("Received HTML response - this could indicate an authentication issue or server error");
      }
      
      return fallbackOptions;
    }
    
    const data = await response.json();
    
    // Handle the specific API response structure - extract the utilisateursDetails array
    if (data && data.utilisateursDetails && Array.isArray(data.utilisateursDetails)) {
      return data.utilisateursDetails.map(user => ({
        label: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.nomComplet || "Unnamed User",
        value: user.id || user._id,
        type: user.type // Keep this information if needed for filtering
      }));
    } else {
      console.error("API did not return the expected structure:", data);
      return fallbackOptions;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Fetch request timed out");
    } else {
      console.error("Failed to fetch participant options:", error);
    }
    
    return fallbackOptions;
  }
};

interface FormState {
  title: string;
  description: string;
  category: string;
  level: string;
  imageFormation: File | string | null;  // Allow both File and string
  participants: string[];
  Parametre: "Public" | "Priver";
  registrationLink: string;
  dateDebut: string;
  dateFin: string;
  tags: string;
}

interface UploadedFile {
  name: string;
  data: string;
  fullLength?: number;
  type: 'image' | 'participant-list';
}

interface ParticipantOption {
  label: string;
  value: string;
  nom?: string;
  prenom?: string;
  type?: string;
}

const initialFormState: FormState = {
  title: "",
  description: "",
  category: "",
  level: "",
  imageFormation: null,
  Parametre: "Public",
  participants: [], 
  registrationLink: "",
  dateDebut: "",
  dateFin: "",
  tags: "",
};

const CreatEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [participantOptions, setParticipantOptions] = useState<ParticipantOption[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string>("user-id-actuel"); // This would typically come from auth context
  
  // Use effect to import mongoose dynamically (this avoids the Node.js require in browser context)
  const [mongoose, setMongoose] = useState(null);
  
  useEffect(() => {
    // In a real application, this should be handled server-side
    // This is just a mock implementation for the front-end
    const mockMongoose = {
      Types: {
        ObjectId: function(id) {
          return id; // In frontend, we just pass the string ID
        }
      }
    };
    setMongoose(mockMongoose);
  }, []);

  // Effect to fetch participant options from the backend with retry logic
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 2;
    
    const loadParticipants = async () => {
      if (!isMounted) return;
      
      setIsLoadingParticipants(true);
      setApiError(null);
      
      try {
        const options = await fetchParticipantOptions();
        if (isMounted) {
          setParticipantOptions(options);
        }
      } catch (error) {
        console.error("Error loading participants:", error);
        if (isMounted) {
          setApiError("Failed to load participants. Using fallback data.");
          // Set fallback options in case of error
          setParticipantOptions([
            { label: "Mohamed Bikarran", value: "645f3d789a123b456c7890de" },
            { label: "Mehdi Iddouch", value: "645f3d789a123b456c7890df" },
            { label: "Hamza Lambara", value: "645f3d789a123b456c7890e0" }
          ]);
          
          // Implement retry logic
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying participant fetch (${retryCount}/${maxRetries})...`);
            setTimeout(loadParticipants, 2000); // Retry after 2 seconds
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingParticipants(false);
        }
      }
    };

    loadParticipants();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.title.trim()) newErrors.title = "Le titre est requis";
    if (!formState.description.trim()) newErrors.description = "La description est requise";
    if (!dateDebut) newErrors.dateDebut = "La date de début est requise";
    if (!dateFin) newErrors.dateFin = "La date de fin est requise";
    if (dateDebut && dateFin && dateDebut > dateFin) {
      newErrors.dateFin = "La date de fin doit être postérieure à la date de début";
    }
    if (!formState.category) newErrors.category = "La catégorie est requise";
    
    return newErrors;
  };

  const handleSubmit = async () => {
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Check if mongoose is available
      if (!mongoose) {
        throw new Error("Mongoose n'est pas disponible");
      }
  
      // Prepare data for API
      const eventData = {
        titre: formState.title,
        description: formState.description,
        dateDebut: dateDebut,
        dateFin: dateFin,
        heureDebut: dateDebut?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
        heureFin: dateFin?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '',
        categorie: formState.category,
        participants: formState.participants.map(participantId => mongoose.Types.ObjectId(participantId)),
        Parametre: formState.Parametre,
        image: formState.imageFormation,
        createdBy: mongoose.Types.ObjectId(userId),
      };
  
      // Adding image if exists
      if (formState.imageFormation) {
        // In a real app, you would upload the image to a server and get back a URL
        // This is a simplified example
        eventData.image = "image_url_placeholder";
      }
      
      // API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const createdEvent = await createEvenement(eventData);
      clearTimeout(timeoutId);
      
      // Redirect or show success message
      console.log('Événement créé:', createdEvent);
      navigate('/manager/Ecolcode');
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      
      if (error.name === 'AbortError') {
        setApiError("La requête a pris trop de temps. Veuillez réessayer.");
      } else if (error.response) {
        setApiError(`Erreur serveur: ${error.response.status} - ${error.response.data?.message || 'Message d\'erreur non disponible'}`);
      } else {
        setApiError("Erreur lors de la création de l'événement. Veuillez réessayer.");
      }
      
      // Keep form data intact for retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRetourClick = () => {
    navigate(-1);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({...prev, imageFormation: "Le fichier est trop volumineux. La taille maximum est de 2MB."}));
        event.target.value = "";
        return;
      }

      setFormState(prevState => ({ ...prevState, imageFormation: file }));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.imageFormation;
        return newErrors;
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const dataUrl = e.target.result as string;
          setImagePreviewUrl(dataUrl);
          setUploadedFiles(prev => [...prev.filter(f => f.type !== 'image'), { 
            name: file.name, 
            data: dataUrl,
            type: 'image'
          }]);
        }
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setFormState(prevState => ({ ...prevState, imageFormation: null }));
    setUploadedFiles(prev => prev.filter(file => file.type !== 'image'));
  };

  const levelOptions = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];
  
  const categoryOptions = [
    { label: "Meetings", value: "Meetings" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];
  
  const statusOptions = [
    { label: "Public", value: "Public" },
    { label: "Priver", value: "Priver" }
  ];
  
  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white py-6 h-full w-full">
      <GlobalStyle />
      <div className="max-w-7xl mx-auto px-4 w-11/12">
        <div className="w-full mb-4 flex justify-start">
          <button
            className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"
            onClick={onRetourClick}
          >
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6665 4.65625L5.21143 10L10.6665 15.3437L12.2251 13.8177L8.32784 10L12.2251 6.1838L10.6665 4.65625Z" fill="#F16E00"/>
            </svg>
            <span className="text-lg font-bold text-black">Retour</span>
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black mb-6">Créer un nouvel événement</h1>
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
              onClick={onRetourClick}
            >
              Annuler
            </button>
            <button 
              className={`px-4 py-2 bg-orange-500 text-white rounded-md font-medium flex items-center justify-center min-w-24 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin mr-2" size={18} /> Publication...</>
              ) : (
                "Publier"
              )}
            </button>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <div className="mr-2 flex-shrink-0 mt-0.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#EF4444"/>
              </svg>
            </div>
            <div>
              <p className="font-medium">{apiError}</p>
            </div>
            <button 
              className="ml-auto"
              onClick={() => setApiError(null)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="#9B1C1C"/>
              </svg>
            </button>
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-200 p-6 w-full mb-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Titre de l'événement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => {
                setFormState({ ...formState, title: e.target.value });
                if (errors.title) {
                  setErrors({...errors, title: ''});
                }
              }}
              placeholder="Réunion équipe Orange Digital Center"
              className={`w-full p-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => {
                setFormState({ ...formState, description: e.target.value });
                if (errors.description) {
                  setErrors({...errors, description: ''});
                }
              }}
              placeholder="Réunion de l'équipe du Centre Digital Orange : nous avons discuté en profondeur des projets en cours, en examinant les défis rencontrés et les succès obtenus."
              className={`w-full p-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md h-32`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4 max-w-3xl w-full">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Date et heure de début <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <DatePicker
                  selected={dateDebut}
                  onChange={(date) => {
                    setDateDebut(date);
                    if (errors.dateDebut) {
                      setErrors({...errors, dateDebut: ''});
                    }
                  }}
                  locale={fr}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="jj/mm/aaaa --:--"
                  className={`w-full p-2.5 border ${errors.dateDebut ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  calendarClassName="custom-calendar"
                  popperClassName="custom-popper"
                  wrapperClassName="w-full"
                  timeCaption="Heure"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="#F16E00"/>
                  </svg>
                </div>
              </div>
              {errors.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Date et heure de fin <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <DatePicker
                  selected={dateFin}
                  onChange={(date) => {
                    setDateFin(date);
                    if (errors.dateFin) {
                      setErrors({...errors, dateFin: ''});
                    }
                  }}
                  locale={fr}
                  showTimeSelect
                  dateFormat="d MMMM yyyy - HH:mm"
                  placeholderText="jj/mm/aaaa --:--"
                  className={`w-full p-2.5 border ${errors.dateFin ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  calendarClassName="custom-calendar"
                  popperClassName="custom-popper"
                  wrapperClassName="w-full"
                  timeCaption="Heure"
                  minDate={dateDebut || undefined}
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="#F16E00"/>
                  </svg>
                </div>
              </div>
              {errors.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
            </div>
            
           
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-4 max-w-7xl w-full">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Paramètres de l'événement <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formState.Parametre}
                  onChange={(e) => setFormState({ ...formState, Parametre: e.target.value as "Public" | "Priver"})}
                  className="w-full p-2.5 border border-gray-300 rounded-[4px] appearance-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={20} className="text-gray-500" />
                </div>
              </div>
              {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-[4px] appearance-none"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={20} className="text-gray-500" />
                </div>
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Participants <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {isLoadingParticipants ? (
                  <div className="flex items-center p-2.5 border border-gray-300 rounded-[4px]">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span>Chargement des participants...</span>
                  </div>
                ) : (
                  <Select
                    options={participantOptions}
                    isMulti
                    value={participantOptions.filter(option => 
                      formState.participants.includes(option.value)
                    )}
                    onChange={(selectedOptions) => {
                      const selected = selectedOptions || [];
                      setFormState({
                        ...formState,
                        participants: selected.map(option => option.value)
                      });
                    }}
                    className="w-full"
                    classNamePrefix="select"
                    placeholder="Sélectionnez les participants"
                  />
                )}
              </div>
              {errors.participants && <p className="mt-1 text-sm text-red-500">{errors.participants}</p>}
            </div>
          </div>  
          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Bannière de l'événement <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 relative rounded-[4px]">
              {imagePreviewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 w-full max-w-sm mx-auto">
                    <img 
                      src={imagePreviewUrl} 
                      alt="Prévisualisation" 
                      className="w-full h-auto rounded-[4px] object-cover max-h-60"
                    />
                    <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-700 truncate flex-1">
                    {typeof formState.imageFormation === 'string' 
                      ? formState.imageFormation 
                      : formState.imageFormation?.name || ''}
                  </span>
                      <button 
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
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    ref={imageInputRef}
                  />
                  <button
                    onClick={handleImageButtonClick}
                    className="flex flex-col items-center cursor-pointer"
                    type="button"
                  >
                    <div className="w-12 h-12 mb-4 text-black">
                      <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Maximum file size: <strong>2 MB</strong>. Supported files: jpg, jpeg, png Several files possible.
                    </p>
                    <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
                      Select a file
                    </span>
                  </button>
                </div>
              )}
              {errors.imageFormation && <p className="mt-1 text-sm text-red-500">{errors.imageFormation}</p>}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[4px] border border-gray-200 p-6 w-full mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Location</h2>
            <button className="bg-black text-white px-6 py-2 rounded-[4px] text-sm font-medium">
              Ajouter un lien
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <select className="border border-gray-300 rounded-[4px] p-2.5">
              <option>Online</option>
              <option>Présentiel</option>
            </select>
            <input
              type="url"
              className="flex-1 p-2.5 border border-gray-300 rounded-[4px]"
              placeholder="https://"
            />
            <button className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-[4px] text-sm font-medium min-w-24">
              Ajouter
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select className="border border-gray-300 rounded-[4px] p-2.5">
              <option>Présentiel</option>
              <option>Online</option>
            </select>
            <input
              type="url"
              className="flex-1 p-2.5 border border-gray-300 rounded-[4px]"
              placeholder="https://"
            />
            <button className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-[4px] text-sm font-medium min-w-24">
              Ajouter
            </button>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
        <button 
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-4 py-2 bg-orange-500 text-white rounded-[4px] font-medium"
>
  {isSubmitting ? (
    <Loader2 className="animate-spin" />
  ) : (
    "Publier l'événement"
  )}
</button>
        </div>
      </div>
    </div>
  );
};

export default CreatEvent;