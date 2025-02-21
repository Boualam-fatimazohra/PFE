/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useState, useRef } from "react";
import { Eye, Download, Trash2, PlusCircle, ChevronDown, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ParticipantsSection from "../Formation/ParticipantsSection";
// Types
interface Step {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}

interface Participant {
  date: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  telephone: string;
  confTel: string;
  confEmail: string;
}

interface FormState {
  title: string;
  description: string;
  status: string;
  category: string;
  level: string;
  imageFormation: File | null;
  registrationLink: string;
  listeParticipants?: File[];
  dateDebut: string;
  dateFin: string;
}

const FormationModal = () => {
  // Initial form state
  const initialFormState: FormState = {
    title: "",
    description: "",
    status: "",
    category: "",
    level: "",
    imageFormation: null,
    registrationLink: "",
    listeParticipants: [],
    dateDebut: "",
    dateFin: ""
  };

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options for select inputs
  const statusOptions = [
    { label: "En Cours", value: "En Cours" },
    { label: "Terminé", value: "Terminé" },
    { label: "Avenir", value: "Avenir" }
  ];

  const categoryOptions = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  const levelOptions = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  const steps: Step[] = [
    { number: "1", label: "Informations générales", active: currentStep === 1, completed: currentStep > 1 },
    { number: "2", label: "Participants & Classes", active: currentStep === 2, completed: currentStep > 2 },
    { number: "3", label: "Confirmations", active: currentStep === 3, completed: currentStep > 3 },
    { number: "✓", label: "Terminé", active: currentStep === 4, completed: currentStep > 3 }
  ];
  const [useIcon, setUseIcon] = useState(true); // Valeur par défaut à true ou false selon votre besoin

  // Sample participant data
  const participants: Participant[] = [
    {
      date: "26/03/2024",
      nom: "Bikarrane",
      prenom: "Mohamed",
      email: "mohamed.bikarrab@gmail...",
      genre: "Homme",
      telephone: "0644544512",
      confTel: "Confirmé (e)",
      confEmail: "En cours"
    },
    {
      date: "26/03/2024",
      nom: "Boualam",
      prenom: "Fatima",
      email: "fatima.boualam@gmail...",
      genre: "femme",
      telephone: "0644544512",
      confTel: "En cours",
      confEmail: "Confirmé (e)"
    },
    {
      date: "26/03/2024",
      nom: "AS-SAAD",
      prenom: "Ikram",
      email: "assad.ikram@gmail...",
      genre: "femme",
      telephone: "0644544512",
      confTel: "Confirmé (e)",
      confEmail: "Confirmé (e)"
    },
    {
      date: "26/03/2024",
      nom: "Trif",
      prenom: "Ouidad",
      email: "ouidad.tarif@gmail...",
      genre: "femme",
      telephone: "0644544512",
      confTel: "En cours",
      confEmail: "En cours"
    }
  ];

  // Handlers
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. La taille maximum est de 2MB.");
        return;
      }
      
      setFormState(prev => ({
        ...prev,
        imageFormation: file
      }));
    }
  };
 
  

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formState.title.trim()) {
        newErrors.title = "Le titre est obligatoire";
      }
      if (!formState.description.trim()) {
        newErrors.description = "La description est obligatoire";
      }
      if (!formState.status) {
        newErrors.status = "Le statut est obligatoire";
      }
      if (!formState.category) {
        newErrors.category = "La catégorie est obligatoire";
      }
      if (!formState.level) {
        newErrors.level = "Le niveau est obligatoire";
      }
      if (!formState.dateDebut) {
        newErrors.dateDebut = "La date de début est obligatoire";
      }
      if (!formState.imageFormation) {
        newErrors.imageFormation = "L'image est obligatoire";
      }
      if (!formState.registrationLink) {
        newErrors.registrationLink = "Le lein est obligatoire";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateForm() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('nom', formState.title);
      formData.append('description', formState.description);
      formData.append('status', formState.status);
      formData.append('categorie', formState.category);
      formData.append('niveau', formState.level);
      formData.append('lienInscription', formState.registrationLink);
      formData.append('dateDebut', formState.dateDebut);
      formData.append('dateFin', formState.dateFin);
      
      if (formState.imageFormation) {
        formData.append('image', formState.imageFormation);
      }

      const response = await fetch('/api/Addformation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert('Formation créée avec succès!');
      setFormState(initialFormState);
      setCurrentStep(1);
      setFileList([]);
    } catch (error) {
      console.error('Error submitting formation:', error);
      alert('Erreur lors de la création de la formation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step Indicator
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between w-full mb-8 max-w-10xl mx-auto relative gap-x-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative flex-1">
          {/* Trait de connexion entre les cercles */}
          {index > 0 && (
            <div className={`font-bold font-inter absolute h-px -left-1/2 right-1/2 top-5 -z-10 ${
              steps[index - 1].completed ? "bg-black" : "bg-gray-200"
            }`}></div>
          )}
          {/* Cercle du step */}
          <div
  className={`w-12 h-12 flex items-center justify-center rounded-full 
    ${step.active ? "bg-white border-4 border-orange-400" : 
      step.completed ? "bg-white border-2 border-black text-black" : 
      "bg-white border-2 border-gray-300 text-gray-500"} 
    text-lg font-medium mb-2 z-10`}
>
  {step.number}
</div>

  
          {/* Label */}
          <span className={`text-sm font-medium ${step.active ? "text-gray-900" : "text-gray-500"}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
  
  
  
  // Render functions
  const renderStep1 = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Informations générales</h1>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Titre de la formation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            className={`rounded-none w-full p-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            className={`rounded-none w-full p-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg h-32`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="rounded-none block text-sm font-bold text-black mb-1">
              Date début formation <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formState.dateDebut}
              onChange={(e) => setFormState({ ...formState, dateDebut: e.target.value })}
              className={`rounded-none w-full p-2.5 border ${errors.dateDebut ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
            />
            {errors.dateDebut && <p className="mt-1 text-sm text-red-500">{errors.dateDebut}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Date fin formation
            </label>
            <input
              type="datetime-local"
              value={formState.dateFin}
              onChange={(e) => setFormState({ ...formState, dateFin: e.target.value })}
              className="rounded-none w-full p-2.5 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className={`rounded-none w-full p-2.5 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
            >
              <option value="">Sélectionnez un status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.category}
              onChange={(e) => setFormState({ ...formState, category: e.target.value })}
              className={`rounded-none w-full p-2.5 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
            >
              <option value="">Sélectionnez une catégorie</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Niveau <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.level}
              onChange={(e) => setFormState({ ...formState, level: e.target.value })}
              className={`rounded-none w-full p-2.5 border ${errors.level ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
            >
              <option value="">Sélectionnez un niveau</option>
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
          </div>
        </div>
        <div>
  <label className="block text-sm font-bold text-black mb-1">
    Image de formation <span className="text-red-500">*</span>
  </label>
  <div className="border-4 border-dashed border-gray-300 p-10 relative" style={{ borderSpacing: '10px' }}>
    <div className="flex flex-col items-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png"
        className="rounded-none hidden"
        ref={fileInputRef}
      />
      <button
        onClick={handleFileButtonClick}
        className="flex flex-col items-center cursor-pointer"
      >
        <div className="w-12 h-12 mb-4 text-black">
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
          </svg>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Maximum file size: <strong>2 MB</strong>. Supported files: jpg, jpeg, png. Several files possible.
        </p>
        <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
          Select a file
        </span>
      </button>
    </div>
  </div>
</div>

     
        <div className="rounded-none bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Lien d'inscription</h2>
            <button className="bg-black text-white px-6 py-2 text-sm w-32">
              Créer un lien
            </button>
          </div>
          <label className="block text-sm font-bold text-black mb-1">
            Insérer Lien <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 ">
            <input
              type="url"
              value={formState.registrationLink}
              onChange={(e) => setFormState({ ...formState, registrationLink: e.target.value })}
              className="rounded-none flex-1 p-2.5 border border-gray-300 rounded-lg"
              placeholder="https://"
            />
            <button className="bg-gray-200 text-gray-700 px-6 py-2 text-sm w-32">
              Ajouter
            </button>
            {errors.registrationLink && <p className="mt-1 text-sm text-red-500">{errors.registrationLink}</p>}
          </div>
        </div>
        </div>
     </div>
      );
   
  

  // const renderStep2 = () => (
  //   <div className="bg-white rounded-lg border border-gray-200 p-6">
  //     <div className="space-y-6">
  //       <div className="flex justify-between items-center mb-4">
  //         <h2 className="text-lg font-semibold">Listes des Participants</h2>
  //         <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
  //           <PlusCircle size={20} />
  //           Enhance List
  //         </button>
  //       </div>

  //       <div className="space-y-4">
  //         {fileList.map((file, index) => (
  //           <div key={index} className="border rounded-lg p-4">
  //             <div className="flex items-center justify-between">
  //               <div className="flex items-center gap-3">
  //                 <div className="text-gray-600">
  //                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  //                     <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
  //                     <polyline points="13 2 13 9 20 9"></polyline>
  //                   </svg>
  //                 </div>
  //                 <div>
  //                   <div className="font-medium">{file.name}</div>
  //                   <div className="text-sm text-gray-500">
  //                     {new Date().toLocaleDateString()}
  //                   </div>
  //                 </div>
  //               </div>
  //               <div className="flex items-center gap-2">
  //                 <button className="p-2 text-gray-600">
  //                   <Eye size={20} />
  //                 </button>
  //                 <button className="p-2 text-gray-600">
  //                   <Download size={20} />
  //                 </button>
  //                 <button 
  //                   className="p-2 text-gray-600"
  //                   onClick={() => setFileList(fileList.filter((_, i) => i !== index))}
  //                 >
  //                   <Trash2 size={20} />
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         ))}

  //         <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
  //           <div className="flex flex-col items-center">
  //             <div className="mb-4">
                
  //               <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/> </svg>
  //             </div>
  //             <p className="text-sm text-gray-500 mb-1">Maximum file size: 100 MB, liste Excel ou fichier CSV</p>
  //             <button
  //               onClick={handleFileButtonClick}
  //               className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
  //             >
  //               Select a file
  //             </button>
  //             <input
  //               type="file"
  //               ref={fileInputRef}
  //               className="hidden"
  //               onChange={handleFileChange}
  //               accept=".xlsx,.xls,.csv"
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  const renderStep2 = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Listes des Participants</h2>
          <button 
            className={`${
              fileList.length > 0 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
            disabled={fileList.length === 0}
          >
            <PlusCircle size={20} />
            Enhance List
          </button>
        </div>
  
        <div className="space-y-4">
          {fileList.map((file, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-gray-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <Eye size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800">
                    <Download size={20} />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setFileList(fileList.filter((_, i) => i !== index))}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
  
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">Maximum file size: 100 MB, liste Excel ou fichier CSV</p>
              <button
                onClick={handleFileButtonClick}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Select a file
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-8 w-full h-auto">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Liste de confirmation</h2>
        <div className="flex flex-col gap-4 w-full">
  {/* Barre de recherche avec filtre */}
  <div className="flex items-center gap-4 w-full">
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Recherche participants..."
        className="w-full pl-10 pr-12 py-3 border rounded-lg text-lg"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Icône de recherche à gauche */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

      {/* Icône loupe orange à droite */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2765 13.1102L10.6661 9.49975C11.2718 8.65338 11.5966 7.6383 11.5949 6.59754C11.5949 3.83754 9.35745 1.6001 6.59742 1.6001C3.83738 1.6001 1.59998 3.83751 1.59998 6.59754C1.59998 9.35757 3.83738 11.595 6.59742 11.595C7.63822 11.5966 8.65333 11.2718 9.49981 10.6662L13.1101 14.2765C13.2665 14.4321 13.5192 14.4321 13.6756 14.2765L14.2765 13.6757C14.432 13.5193 14.432 13.2667 14.2765 13.1102ZM6.59742 9.99581C4.72062 9.99581 3.19916 8.47434 3.19916 6.59754C3.19916 4.72074 4.72062 3.19928 6.59742 3.19928C8.47422 3.19928 9.99569 4.72074 9.99569 6.59754C9.99569 8.47434 8.47422 9.99581 6.59742 9.99581Z"
          />
        </svg>
      </div>
    </div>

    {/* Bouton Filtre */}
    <button className="p-3 border rounded-lg flex items-center justify-center w-12 h-12 bg-black">
  <Filter size={20} className="text-white" />
</button>

  </div>
  </div>
  {/* Bouton Générer liste en dessous */}
  <div className="flex justify-end">
  <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
    <Download size={20} />
    Générer liste présence
  </button>
</div>
<div className="overflow-x-auto">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100 border-b text-gray-700 text-sm">
        <th className="w-6 p-3">
          <input type="checkbox" className="rounded" />
        </th>
        <th className="p-3 text-left">Date & Heure</th>
        <th className="p-3 text-left">Nom</th>
        <th className="p-3 text-left">Prénom</th>
        <th className="p-3 text-left">Email</th>
        <th className="p-3 text-left">Genre</th>
        <th className="p-3 text-left">Téléphone</th>
        <th className="p-3 text-left">Conf Tél</th>
        <th className="p-3 text-left">Conf Email</th>
        <th className="w-8"></th>
      </tr>
    </thead>
    <tbody>
      {participants.map((participant, index) => (
        <tr key={index} className="border-b text-sm hover:bg-gray-50">
          <td className="p-3">
            <input type="checkbox" className="rounded" />
          </td>
          <td className="p-3">{participant.date}</td>
          <td className="p-3">{participant.nom}</td>
          <td className="p-3">{participant.prenom}</td>
          <td className="p-3">{participant.email}</td>
          <td className="p-3">{participant.genre}</td>
          <td className="p-3">{participant.telephone}</td>
          <td className="p-3">
            <div className="flex items-center gap-1">
              <span
                className={`font-semibold ${
                  participant.confTel === "Confirmé (e)"
                    ? "text-green-500"
                    : "text-orange-500"
                }`}
              >
                {participant.confTel}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </td>
          <td className="p-3">
            <div className="flex items-center gap-1">
              <span
                className={`font-semibold ${
                  participant.confEmail === "Confirmé (e)"
                    ? "text-green-500"
                    : "text-orange-500"
                }`}
              >
                {participant.confEmail}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </td>
          {/* <td className="p-3">
            <button className="text-black hover:text-gray-600">
              <ChevronRight size={20} />
            </button>
          </td> */}
          <td className="p-3">
  <button className="text-black hover:text-gray-600">
    {useIcon ? (
      <ChevronRight size={20} />
    ) : (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M13.0629 18.0114C12.7967 18.2286 12.4856 18.3375 12.1305 18.3375C11.7695 18.3375 11.4544 18.2301 11.1851 18.0153C10.9159 17.8007 10.7812 17.5006 10.7812 17.1148C10.7812 16.7778 10.9098 16.491 11.1672 16.2545C11.4247 16.0182 11.7401 15.9 12.1129 15.9C12.4856 15.9 12.8039 16.0182 13.0674 16.2545C13.3307 16.491 13.4625 16.7778 13.4625 17.1148C13.4625 17.4951 13.3293 17.7941 13.0629 18.0114ZM11.1672 6.04998C11.4113 5.80199 11.7313 5.67522 12.1219 5.6625C12.5122 5.67522 12.8322 5.80199 13.0763 6.04998C13.3335 6.31157 13.4625 6.67601 13.4625 7.14326C13.4625 7.48635 12.9563 13.7974 12.8322 14.0534C12.7077 14.3096 12.4857 14.4375 12.166 14.4375C12.1501 14.4375 12.1374 14.4331 12.1219 14.4323C12.1064 14.4331 12.0932 14.4375 12.0775 14.4375C11.7578 14.4375 11.5359 14.3096 11.4116 14.0534C11.2871 13.7974 10.7812 7.48635 10.7812 7.14326C10.7812 6.67601 10.9098 6.31157 11.1672 6.04998ZM12 2.25C6.61522 2.25 2.25 6.61525 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61525 17.3848 2.25 12 2.25Z" fill="#FFCD0B"/>
      </svg>
    )}
  </button>
</td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

        <div className="flex justify-center items-center gap-2 mt-4">
          <button className="p-1 border rounded">
            <ChevronLeft size={20} />
          </button>
          <button className="px-3 py-1 bg-gray-900 text-white rounded">1</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-1 hover:bg-gray-100 rounded">3</button>
          <button className="p-1 border rounded">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">AWS : Développement, déploiement et gestion</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total Formations</div>
                <div className="text-2xl font-bold">41</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total Formations</div>
                <div className="text-2xl font-bold">25</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(65%) sepia(54%) saturate(2651%) hue-rotate(346deg) brightness(98%) contrast(96%);
          cursor: pointer;
          transition: opacity 0.2s ease-in-out;
        }
        
        input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0.7;
        }
      `}</style>
    <main className="max-w-6xl mx-auto mt-8 p-4">
<h1 className="text-4xl font-bold mb-6">Créer une formation</h1>
      
      {renderStepIndicator()}

      {renderStepContent()}

      <div className="flex justify-end mt-6 gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-none px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50  font-bold"
            >
              Retour
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              disabled={isSubmitting}
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-green-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'En cours...' : 'Valider'}
            </button>
          )}
        </div>

    </main>
    </>
  );
};

export default FormationModal;