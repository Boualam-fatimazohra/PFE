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
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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

// Fetch encadrants function
const fetchEncadrantOptions = async () => {
  const fallbackOptions = [
    { label: "Mohamed Bikarran", value: "645f3d789a123b456c7890de" },
    { label: "Mehdi Iddouch", value: "645f3d789a123b456c7890df" },
    { label: "Hamza Lambara", value: "645f3d789a123b456c7890e0" }
  ];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('http://localhost:5000/api/encadrants', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`Server response error: ${response.status}`);
      return fallbackOptions;
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`Expected JSON but got ${contentType || 'unknown content type'}`);
      return fallbackOptions;
    }
    
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map(encadrant => ({
        label: `${encadrant.utilisateur?.prenom || ''} ${encadrant.utilisateur?.nom || ''}`.trim(),
        value: encadrant._id
      }));
    } else {
      console.error("API did not return the expected structure:", data);
      return fallbackOptions;
    }
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Fetch request timed out");
    } else {
      console.error("Failed to fetch encadrant options:", error);
    }
    
    return fallbackOptions;
  }
};

// Service function to create a ProjetFab
const createProjetFab = async (projectData) => {
  try {
    const response = await fetch('http://localhost:5000/api/projets-fab', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

interface FormState {
  nom: string;
  description: string;
  status: string;
  progress: number;
  nombreParticipants: number;
  encadrantIds: string[];
  Participant: File | null;
  dateDebut: Date | null;
  dateFin: Date | null;
}

const initialFormState: FormState = {
  nom: "",
  description: "",
  status: "Avenir",
  progress: 0,
  nombreParticipants: 0,
  encadrantIds: [],
  Participant: null,
  dateDebut: null,
  dateFin: null
};

const CreatProjetFab = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [ParticipantPreviewUrl, setParticipantPreviewUrl] = useState<string | null>(null);
  const ParticipantInputRef = useRef<HTMLInputElement>(null);
  const [encadrantOptions, setEncadrantOptions] = useState([]);
  const [isLoadingEncadrants, setIsLoadingEncadrants] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success'|'error'|'warning'|'info'>('success');

  const showAlert = (message: string, severity: 'success'|'error'|'warning'|'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Effect to fetch encadrant options from the backend
  useEffect(() => {
    let isMounted = true;
    
    const loadEncadrants = async () => {
      if (!isMounted) return;
      
      setIsLoadingEncadrants(true);
      setApiError(null);
      
      try {
        const options = await fetchEncadrantOptions();
        if (isMounted) {
          setEncadrantOptions(options);
        }
      } catch (error) {
        console.error("Error loading encadrants:", error);
        if (isMounted) {
          setApiError("Failed to load encadrants. Using fallback data.");
          setEncadrantOptions([
            { label: "Mohamed Bikarran", value: "645f3d789a123b456c7890de" },
            { label: "Mehdi Iddouch", value: "645f3d789a123b456c7890df" },
            { label: "Hamza Lambara", value: "645f3d789a123b456c7890e0" }
          ]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingEncadrants(false);
        }
      }
    };

    loadEncadrants();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formState.description.trim()) newErrors.description = "La description est requise";
    if (!dateDebut) newErrors.dateDebut = "La date de début est requise";
    if (!dateFin) newErrors.dateFin = "La date de fin est requise";
    if (dateDebut && dateFin && dateDebut > dateFin) {
      newErrors.dateFin = "La date de fin doit être postérieure à la date de début";
    }
    if (formState.encadrantIds.length > 3) {
      newErrors.encadrantIds = "Vous ne pouvez assigner que 3 encadrants maximum";
    }
    if (formState.progress < 0 || formState.progress > 100) {
      newErrors.progress = "La progression doit être entre 0 et 100";
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    // Update the form state with the dates
    setFormState(prev => ({
      ...prev,
      dateDebut,
      dateFin
    }));

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append('nom', formState.nom);
      formData.append('description', formState.description);
      formData.append('dateDebut', dateDebut.toISOString());
      formData.append('dateFin', dateFin.toISOString());
      formData.append('status', formState.status);
      formData.append('progress', formState.progress.toString());
      formData.append('nombreParticipants', formState.nombreParticipants.toString());
      
      // Add encadrants
      formState.encadrantIds.forEach(id => {
        formData.append('encadrantIds', id);
      });
      
      // Add Participant if exists
      if (formState.Participant) {
        formData.append('Participant', formState.Participant);
      }
      
      // Make API call
      const response = await fetch('http://localhost:5000/api/projets-fab', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Show success message and redirect
      showAlert('Projet de fabrication créé avec succès', 'success');
      setTimeout(() => {
        navigate('/projets-fab');
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      setApiError(error.message || "Une erreur est survenue lors de la création du projet");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRetourClick = () => {
    navigate(-1);
  };
  
  const handleParticipantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({...prev, Participant: "Le fichier est trop volumineux. La taille maximum est de 2MB."}));
        event.target.value = "";
        return;
      }

      setFormState(prevState => ({ ...prevState, Participant: file }));
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors.Participant;
        return newErrors;
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setParticipantPreviewUrl(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
      event.target.value = "";
    }
  };
  
  const handleRemoveParticipant = () => {
    setParticipantPreviewUrl(null);
    setFormState(prevState => ({ ...prevState, Participant: null }));
  };

  const handleParticipantButtonClick = () => {
    if (ParticipantInputRef.current) {
        ParticipantInputRef.current.click();
    }
  };

  const statusOptions = [
    { label: "Avenir", value: "Avenir" },
    { label: "En Cours", value: "En Cours" },
    { label: "Terminé", value: "Terminé" },
    { label: "Replanifier", value: "Replanifier" }
  ];

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
          <h1 className="text-2xl font-bold text-black mb-6">Créer un nouveau Projet de Fabrication</h1>
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
              Nom du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.nom}
              onChange={(e) => {
                setFormState({ ...formState, nom: e.target.value });
                if (errors.nom) {
                  setErrors({...errors, nom: ''});
                }
              }}
              placeholder="Nom du projet de fabrication"
              className={`w-full p-2.5 border ${errors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
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
              placeholder="Description du projet de fabrication"
              className={`w-full p-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md h-32`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4 max-w-3xl w-full">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Date de début <span className="text-red-500">*</span>
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
                  dateFormat="d MMMM yyyy - HH:mm"
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
                Date de fin <span className="text-red-500">*</span>
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

         
          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Participant de Projet <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 p-6 relative rounded-[4px]">
              {ParticipantPreviewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 w-full max-w-sm mx-auto">
                    <img 
                      src={ParticipantPreviewUrl} 
                      alt="Prévisualisation" 
                      className="w-full h-auto rounded-[4px] object-cover max-h-60"
                    />
                    <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-700 truncate flex-1">
                    {typeof formState.Participant === 'string' 
                      ? formState.Participant 
                      : formState.Participant?.name || ''}
                  </span>
                      <button 
                        onClick={handleRemoveParticipant}
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
                    onChange={handleParticipantChange}
                    accept=".xsl,.xscl,.doc,.docx,.xlsx,.xls"
                    className="hidden"
                    ref={ParticipantInputRef}
                    />

                  <button
                    onClick={handleParticipantButtonClick}
                    className="flex flex-col items-center cursor-pointer"
                    type="button"
                  >
                    <div className="w-12 h-12 mb-4 text-black">
                      <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Maximum file size: <strong>2 MB</strong>. Supported files: xsl, doc, xscl Several files possible.
                    </p>
                    <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
                      Select a file
                    </span>
                  </button>
                </div>
              )}
              {errors.ParticipantFormation && <p className="mt-1 text-sm text-red-500">{errors.ParticipantFormation}</p>}
            </div>
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
      <Snackbar
  open={alertOpen}
  autoHideDuration={2000}
  onClose={() => setAlertOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert 
    severity={alertSeverity}
    onClose={() => setAlertOpen(false)}
    sx={{ 
      width: '100%',
      boxShadow: 3,
      fontSize: '0.875rem',
      '.MuiAlert-icon': { fontSize: '1.25rem' }
    }}
  >
    {alertMessage}
  </Alert>
</Snackbar>
    </div>
  );
};

export default CreatProjetFab;