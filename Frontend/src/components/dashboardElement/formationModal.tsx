// src/components/formation-modal/FormationModal.tsx
import * as React from 'react';
import { useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormations } from "../../contexts/FormationContext";

// Components
import StepIndicator from '@/components/formation-modal/StepIndicator';
import FormStepOne from '@/components/formation-modal/form-steps/FormStepOne';
import FormStepTwo from '@/components/formation-modal/form-steps/FormStepTwo';
import FormStepThree from '@/components/formation-modal/form-steps/FormStepThree';
import FormStepFour from '@/components/formation-modal/form-steps/FormStepFour';
import FormNavigationButtons from '@/components/formation-modal/ui/FormNavigationButtons';

// Types and Styles
import { 
  FormState, 
  Step, 
  Participant, 
  ProcessingResults, 
  UploadedFile, 
  Message, 
  FormOption 
} from '@/components/formation-modal/types';
import { GlobalStyle, inlineStyles } from '@/components/formation-modal/styles';
import { uploadBeneficiairesFromExcel } from '@/services/beneficiaireService';

// Initial form state
const initialFormState: FormState = {
  title: "",
  description: "",
  status: "En Cours",
  category: "",
  level: "",
  imageFormation: null,
  registrationLink: "",
  dateDebut: "",
  dateFin: "",
  tags: "",
};

const FormationModal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNewFormation, createFormationDraft } = useFormations();
  const formationFromState = location.state?.formation;
  const fromDraft = location.state?.fromDraft;

  // State
  const [currentStep, setCurrentStep] = useState<number>(formationFromState?.currentStep || 1);
  const [formState, setFormState] = useState<FormState>(formationFromState || initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateDebut, setDateDebut] = useState<Date | null>(null);
  const [dateFin, setDateFin] = useState<Date | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [processingResults, setProcessingResults] = useState<ProcessingResults | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [useIcon, setUseIcon] = useState<boolean>(true);
  const [formationId, setFormationId] = useState<string | null>(
    formationFromState?.id || null
  );

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const participantListInputRef = useRef<HTMLInputElement>(null);

  // Options for select inputs
  const statusOptions: FormOption[] = [
    { label: "En Cours", value: "En Cours" },
    { label: "Terminé", value: "Terminé" },
    { label: "Avenir", value: "Avenir" },
    { label: "Replanifier", value: "Replanifier" }
  ];

  const categoryOptions: FormOption[] = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  const levelOptions: FormOption[] = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  // Define steps
  const steps: Step[] = [
    { number: "1", label: "Informations générales", active: currentStep === 1, completed: currentStep > 1 },
    { number: "2", label: "Participants & Classes", active: currentStep === 2, completed: currentStep > 2 },
    { number: "3", label: "Confirmations", active: currentStep === 3, completed: currentStep > 3 },
    { number: "✓", label: "Terminé", active: currentStep === 4, completed: currentStep > 3 }
  ];

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

  const handleImageButtonClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleParticipantListButtonClick = () => {
    if (participantListInputRef.current) {
      participantListInputRef.current.click();
    }
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

          // Définir l'URL de prévisualisation
          setImagePreviewUrl(dataUrl);

          setUploadedFiles(prev => [...prev, { 
            name: file.name, 
            data: dataUrl,
            type: 'image'  // Mark this as an image type
          }]);
        }
      };

      reader.readAsDataURL(file); // Use readAsDataURL for images
      event.target.value = "";
    }
  };


  const handleParticipantListChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // This is now handled in FormStepTwo directly via validateAndProcessFiles
    // The parent component doesn't need to handle validation logic anymore
    
    // We're keeping this as a placeholder to pass to FormStepTwo
    // The actual implementation is in FormStepTwo
  };

  const handleRemoveImage = () => {
    setImagePreviewUrl(null);
    setFormState(prevState => ({ ...prevState, imageFormation: null }));
    setUploadedFiles(prev => prev.filter(file => file.type !== 'image'));
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
      
      // Date validation
      if (!dateDebut) {
        newErrors.dateDebut = "La date de début est obligatoire";
      } else {
        // Convert date to ISO string
        formState.dateDebut = dateDebut.toISOString();
      }

      if (!dateFin) {
        newErrors.dateFin = "La date de fin est obligatoire";
      } else {
        // Convert date to ISO string
        formState.dateFin = dateFin.toISOString();
      }

      // Additional validation for dates
      if (dateDebut && dateFin && dateFin <= dateDebut) {
        newErrors.dateFin = "La date de fin doit être postérieure à la date de début";
      }

      if (!formState.imageFormation) {
        newErrors.imageFormation = "L'image est obligatoire";
      }
      
      if (!formState.registrationLink) {
        newErrors.registrationLink = "Le lien est obligatoire";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
// Fixed handleNext function
const handleNext = async () => {
  if (validateForm()) {
    if (currentStep === 1) {
      // Create formation in backend before moving to next step
      await handleSubmitFormation();
    } else if (currentStep === 2) {
      // Process beneficiaires at step 2
      if (!formationId) { // Fixed condition - check if formationId does NOT exist
        // Formation ID is needed for beneficiaire upload
        setErrors(prevErrors => ({
          ...prevErrors,
          general: "Veuillez d'abord créer la formation avant de continuer"
        }));
        return;
      }
      
      // Process files that have been uploaded but not processed yet
      const filesToProcess = uploadedFiles.filter(file => 
        file.status === 'uploaded' && file.uploadId && !file.processed
      );
      
      if (filesToProcess.length > 0) {
        setIsSubmitting(true);
        setProcessingResults(null);
        
        try {
          // Track results for each file
          const results = [];
          let hasError = false;
          
          for (const file of filesToProcess) {
            try {
              // Fetch file from URL to process
              const response = await fetch(file.url);
              const blob = await response.blob();
              const fetchedFile = new File([blob], file.name, { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
              });
              
              // Upload beneficiaires from Excel file
              const result = await uploadBeneficiairesFromExcel(fetchedFile, formationId);
              
              // Add to results
              results.push({
                fileName: file.name,
                success: true,
                nouveauxBeneficiaires: result.nouveauxBeneficiaires,
                nouvellesInstances: result.nouvellesInstances,
                message: result.message
              });
              
              // Mark file as processed
              setUploadedFiles(prev => 
                prev.map(f => 
                  f.uploadId === file.uploadId 
                    ? { ...f, processed: true } 
                    : f
                )
              );
            } catch (error) {
              console.error(`Error processing file ${file.name}:`, error);
              hasError = true;
              results.push({
                fileName: file.name,
                success: false,
                message: error.message || "Une erreur est survenue lors du traitement du fichier"
              });
            }
          }
          
          // Update processing results
          /*setProcessingResults({
            success: !hasError,
            message: hasError 
              ? "Des erreurs sont survenues lors du traitement des fichiers" 
              : "Traitement des fichiers terminé avec succès",
            results: results
          });*/
          console.log("OOOOW Uploaded Successfuly");
          // If successful, move to next step
          if (!hasError) {
            setCurrentStep(currentStep + 1);
          }
        } catch (error) {
          console.error("Error processing beneficiaire files:", error);
          /*setProcessingResults({
            success: false,
            message: `Erreur de traitement: ${error.message || "Une erreur inattendue est survenue"}`,
            results: []
          });*/
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // No files to process, proceed to next step
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < steps.length) {
      // For other steps, just proceed to next step
      setCurrentStep(currentStep + 1);
    }
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
    alert('Formation Steps créée avec succès!');
    setFormState(initialFormState);
    setCurrentStep(1);
    setFileList([]);
  };

  const handleSubmitFormation = async () => {
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
  
    try {
      // Map formState to the structure needed by the API
      const formationData = {
        nom: formState.title,
        description: formState.description,
        status: formState.status,
        categorie: formState.category,
        niveau: formState.level,
        image: formState.imageFormation,
        lienInscription: formState.registrationLink,
        dateDebut: formState.dateDebut,
        dateFin: formState.dateFin,
        tags: formState.tags,
        currentStep: currentStep
      };
  
      try {
        // Store the response to get the formation ID
        const result = await createFormationDraft(formationData);
        console.log("Formation result:", result);
        
        // The ID is inside the data property
        if (result && result.data && result.data._id) {
          setFormationId(result.data._id);
          console.log(`Formation Created ID: ${result.data._id}`);
        } else {
          console.error("Could not find formation ID in result:", result);
        }
        
        alert('Formation Successfully created as Draft!');
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error('Error creating formation draft:', err);
        alert('Erreur lors de la création de la formation en brouillon. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting formation:', error);
      alert('Erreur lors de la création de la formation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitDraft = async () => {
    console.log("formation submited as Draft; FormationId: ", formationId);
    navigate("formateur/dashboardFormateur");
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStepOne
            formState={formState}
            setFormState={setFormState}
            errors={errors}
            dateDebut={dateDebut}
            setDateDebut={setDateDebut}
            dateFin={dateFin}
            setDateFin={setDateFin}
            imagePreviewUrl={imagePreviewUrl}
            handleImageButtonClick={handleImageButtonClick}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            imageInputRef={imageInputRef}
            GlobalStyle={GlobalStyle}
            statusOptions={statusOptions}
            categoryOptions={categoryOptions}
            levelOptions={levelOptions}
          />
        );
      case 2:
        return (
          <FormStepTwo
            fileList={fileList}
            setFileList={setFileList}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles} // Add this prop
            loading={loading}
            processingResults={processingResults}
            setMessages={setMessages}
            setProcessingResults={setProcessingResults}
            setLoading={setLoading}
            handleParticipantListButtonClick={handleParticipantListButtonClick}
            handleParticipantListChange={handleParticipantListChange}
            participantListInputRef={participantListInputRef}
            formationId={formationId || undefined} // Pass formationId correctly
          />
        );
      case 3:
        return (
          <FormStepThree
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            participants={participants}
            useIcon={useIcon}
          />
        );
      case 4:
        return <FormStepFour />;
      default:
        return null;
    }
  };

  return (
    <>
      <style>{inlineStyles}</style>
      <main className="max-w-6xl mx-auto mt-8 p-4">
        <h1 className="text-4xl font-bold mb-6">Créer une formation</h1>
        
        <StepIndicator steps={steps} />
        
        {renderStepContent()}
        
        <FormNavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          handleBack={handleBack}
          handleNext={handleNext}
          handleSubmit={handleSubmit}
          handleSubmitDraft={handleSubmitDraft}
          isSubmitting={isSubmitting}
        />
      </main>
    </>
  );
};

export default FormationModal;