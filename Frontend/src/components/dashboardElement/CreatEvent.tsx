import * as React from "react";
import { useState, useRef } from "react";
import { Eye, Download, Trash2, PlusCircle, ChevronDown, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled, { createGlobalStyle } from "styled-components";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

interface FormState {
  title: string;
  description: string;
  status: "Public" | "Priver";
  category: string;
  level: string;
  imageFormation: File | null;
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

const initialFormState: FormState = {
  title: "",
  description: "",
  status: "Public",
  category: "",
  level: "",
  imageFormation: null,
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

  const onRetourClick = () => {
    navigate(-1);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. La taille maximum est de 2MB.");
        event.target.value = "";
        return;
      }

      setFormState(prevState => ({ ...prevState, imageFormation: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const dataUrl = e.target.result as string;
          setImagePreviewUrl(dataUrl);
          setUploadedFiles(prev => [...prev, { 
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
  
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
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
  
  const participantsOptions = [
    { label: "Mohamed Bikarran", value: "bikarran" },
    { label: "Mehdi Iddouch", value: "iddouch" },
    { label: "Hamza Lambara",value:"lambara" },
  ];
  
  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  
  const imageInputRef = useRef<HTMLInputElement>(null);

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
  const handleChange = (selectedOptions) => {
    // Convertir MultiValue en tableau modifiable
    setSelectedParticipants(selectedOptions ? [...selectedOptions] : []);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white py-6 h-[100%] w-[100%]">
      <div className=" max-w-7xl mx-auto px-4 w-[90%]">
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
    <button className="px-4 py-2 border border-gray-300 rounded-[4px] bg-white text-gray-700">
      Annuler
    </button>
    <button className="px-4 py-2 bg-orange-500 text-white rounded-[4px] font-medium">
      Publier
    </button>
  </div>
</div>

        

        
        <div className="bg-white rounded-[4px] border border-gray-200 p-6 w-full mb-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Titre de l'événement <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              placeholder="Réunion équipe Orange Digital Center"
              className="w-full p-2.5 border border-gray-300 rounded-[4px]"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-black mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              placeholder="Réunion de l'équipe du Centre Digital Orange : nous avons discuté en profondeur des projets en cours, en examinant les défis rencontrés et les succès obtenus. Nous avons également mis à jour nos objectifs pour le trimestre à venir, en fixant des indicateurs de performance clairs. Enfin, nous avons planifié les prochaines étapes, en assignant des responsabilités spécifiques à chaque membre de l'équipe pour garantir une exécution efficace."
              className="w-full p-2.5 border border-gray-300 rounded-[4px] h-32"
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-4 max-w-3xl w-full">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Date et heure de début <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <GlobalStyle />
                <DatePicker
                  selected={dateDebut}
                  onChange={(date) => setDateDebut(date)}
                  locale={fr}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholderText="jj/mm/aaaa --:--"
                  className="w-full p-2.5 border border-gray-300 rounded-[4px]"
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
            </div>
            
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Date et heure de fin <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <GlobalStyle />
                <DatePicker
                  selected={dateFin}
                  onChange={(date) => setDateFin(date)}
                  locale={fr}
                  showTimeSelect
                  dateFormat="d MMMM yyyy - HH:mm"
                  placeholderText="jj/mm/aaaa --:--"
                  className="w-full p-2.5 border border-gray-300 rounded-[4px]"
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
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-4 max-w-7xl w-full">
            <div>
              <label className="block text-sm font-bold text-black mb-1">
                Paramètres de l'événement <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value as "Public" | "Priver"})}
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
                <Select
                  options={participantsOptions}
                  isMulti
                  value={selectedParticipants}
                  onChange={handleChange}
                  className="w-full "
                  classNamePrefix="select"
                  placeholder="Sélectionnez les participants"
                />
              </div>
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
                        {formState.imageFormation?.name}
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
          <button className="px-4 py-2 bg-orange-500 text-white rounded-[4px] font-medium">
          Publier l’événement
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatEvent;