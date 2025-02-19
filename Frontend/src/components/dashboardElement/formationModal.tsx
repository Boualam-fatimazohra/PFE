import * as React from "react";
import { useState, useRef } from "react";
import { Eye, Download, Trash2, PlusCircle } from "lucide-react";

interface Step {
  number: string;
  label: string;
  active: boolean;
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
}

interface Step2ContentProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

interface FormInputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  error?: string;
}

interface FormSelectProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
}

interface FileUploadProps {
  label: string;
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="border border-gray-400 bg-white w-full max-w-[1300px] flex flex-col items-stretch mt-[46px] pt-[19px] pb-[42px] px-[22px] max-md:max-w-full max-md:mt-10 max-md:pr-5">
      <h2 className="text-black text-xl font-bold leading-[1.4]">{title}</h2>
      {children}
    </div>
  );
};

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  required = false, 
  value, 
  onChange, 
  multiline = false,
  error 
}) => {
  return (
    <div className="mt-5">
      <label className="block text-sm font-bold text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded min-h-[120px]`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const FormSelect: React.FC<FormSelectProps> = ({ 
  label, 
  required = false, 
  value, 
  onChange, 
  options,
  error 
}) => {
  return (
    <div className="mt-5">
      <label className="block text-sm font-bold text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
      >
        <option value="">Sélectionnez une option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  required = false, 
  onFileSelect,
  selectedFile,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Vérifier la taille du fichier (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        alert("Le fichier est trop volumineux. La taille maximum est de 2MB.");
        return;
      }
      
      // Vérifier le type de fichier
      if (!['image/jpeg', 'image/jpg', 'application/pdf', 'application/msword'].includes(file.type)) {
        alert("Format de fichier non supporté. Utilisez JPG, JPEG, PDF ou DOC.");
        return;
      }

      onFileSelect(file);
    }
  };

  const handleClickSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-5">
      <label className="block text-sm font-bold text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`border-2 border-dashed ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg p-8 text-center`}>
        <div className="flex flex-col items-center">
          {selectedFile ? (
            <div className="flex flex-col items-center">
              {selectedFile.type.startsWith('image/') && (
                <img 
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview" 
                  className="max-w-xs max-h-48 mb-4"
                />
              )}
              <span className="text-sm text-gray-500">{selectedFile.name}</span>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="mt-2 text-sm text-gray-500">
                Maximum file size 2 MB. Supported formats: jpg, jpeg, pdf, doc
              </span>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.pdf,.doc"
            className="hidden"
          />
          <button 
            onClick={handleClickSelectFile}
            className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            type="button"
          >
            {selectedFile ? 'Changer le fichier' : 'Sélectionner un fichier'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const Step1Content: React.FC<{
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  statusOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  levelOptions: { label: string; value: string }[];
  errors: Record<string, string>;
}> = ({ formState, setFormState, statusOptions, categoryOptions, levelOptions, errors }) => {
  return (
    <FormSection title="Informations générales">
      <div className="space-y-4">
        <FormInput
          label="Titre de la formation"
          required
          value={formState.title}
          onChange={(value) => setFormState({ ...formState, title: value })}
          error={errors.title}
        />

        <FormInput
          label="Description"
          required
          value={formState.description}
          onChange={(value) => setFormState({ ...formState, description: value })}
          multiline
          error={errors.description}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="Status"
            required
            value={formState.status}
            onChange={(value) => setFormState({ ...formState, status: value })}
            options={statusOptions}
            error={errors.status}
          />

          <FormSelect
            label="Catégorie"
            required
            value={formState.category}
            onChange={(value) => setFormState({ ...formState, category: value })}
            options={categoryOptions}
            error={errors.category}
          />

          <FormSelect
            label="Niveau"
            required
            value={formState.level}
            onChange={(value) => setFormState({ ...formState, level: value })}
            options={levelOptions}
            error={errors.level}
          />
        </div>

        <FileUpload
          label="Image de formation"
          onFileSelect={(file) => setFormState({ ...formState, imageFormation: file })}
          selectedFile={formState.imageFormation}
          error={errors.imageFormation}
        />

        <FormInput
          label="Lien d'inscription"
          value={formState.registrationLink}
          onChange={(value) => setFormState({ ...formState, registrationLink: value })}
        />
      </div>
    </FormSection>
  );
};

const Step2Content: React.FC<Step2ContentProps> = ({ formState, setFormState, errors }) => {
  const [fileList, setFileList] = useState<File[]>(formState.listeParticipants || []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      const updatedFileList = [...fileList, ...newFiles];

      setFileList(updatedFileList);
      setFormState((prevState) => ({
        ...prevState,
        listeParticipants: updatedFileList,
      }));
    }
  };

  const handleDeleteFile = (index: number) => {
    const newList = fileList.filter((_, i) => i !== index);

    setFileList(newList);
    setFormState((prevState) => ({
      ...prevState,
      listeParticipants: newList,
    }));
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg shadow-md w-full max-w-3xl bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Participants & Classes</h2>

      <div className="p-4 border border-gray-300 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <label className="font-semibold text-gray-700">Liste des Participants *</label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect} 
            accept=".csv,.xlsx"
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="flex items-center px-4 py-2 bg-purple-500 text-white text-sm rounded-lg cursor-pointer hover:bg-purple-600 transition">
            <PlusCircle size={18} className="mr-2" /> <span>Ajouter une liste +</span>
          </label>
        </div>

        {fileList.length > 0 ? (
          fileList.map((file, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2 shadow-sm">
              <span className="font-medium text-gray-800">{file.name}</span>
              <span className="text-gray-600 text-sm">{new Date().toLocaleDateString()}</span>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => window.open(URL.createObjectURL(file))} 
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  <Eye size={18} />
                </button>
                <a 
                  href={URL.createObjectURL(file)} 
                  download={file.name} 
                  className="text-gray-700 hover:text-gray-900 transition"
                >
                  <Download size={18} />
                </a>
                <button 
                  type="button"
                  onClick={() => handleDeleteFile(index)} 
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="border border-dashed border-gray-400 rounded-lg p-6 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l3-3m-3 3l-3-3"></path>
              </svg>
              <p className="text-sm">Maximum file size: 100MB. Liste Excel ou un fichier CSV</p>
              <label htmlFor="fileUpload" className="mt-2 inline-block bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition">
                Sélectionner un fichier
              </label>
            </div>
          </div>
        )}
        {errors.listeParticipants && (
          <p className="text-red-500 text-xs mt-1">{errors.listeParticipants}</p>
        )}
      </div>
    </div>
  );
};




const Step3Content: React.FC = () => {
  const [visibility, setVisibility] = useState('public');
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [options, setOptions] = useState({
    autoEnroll: false,
    emailNotification: false,
    autoCertificate: false
  });

  return (
    <FormSection title="Publication">
      <div className="space-y-4">
        <p className="text-gray-700">Paramètres de publication de la formation</p>
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-medium mb-2">Visibilité</h3>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="visibility" 
                value="public" 
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio text-orange-500" 
              />
              <span className="ml-2">Public</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name="visibility" 
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value)}
                className="form-radio text-orange-500" 
              />
              <span className="ml-2">Privé</span>
            </label>
          </div>
        </div>
        
        <div className="border-b border-gray-200 py-4">
          <h3 className="text-lg font-medium mb-2">Date de publication</h3>
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="border border-gray-300 rounded p-2" 
            />
            <input 
              type="time" 
              value={publishTime}
              onChange={(e) => setPublishTime(e.target.value)}
              className="border border-gray-300 rounded p-2" 
            />
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-2">Options avancées</h3>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input 
                type="checkbox"
                checked={options.autoEnroll}
                onChange={(e) => setOptions({...options, autoEnroll: e.target.checked})}
                className="form-checkbox text-orange-500" 
              />
              <span className="ml-2">Activer les inscriptions automatiques</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox"
                checked={options.emailNotification}
                onChange={(e) => setOptions({...options, emailNotification: e.target.checked})}
                className="form-checkbox text-orange-500" 
              />
              <span className="ml-2">Notifier les participants par email</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="checkbox"
                checked={options.autoCertificate}
                onChange={(e) => setOptions({...options, autoCertificate: e.target.checked})}
                className="form-checkbox text-orange-500" 
              />
              <span className="ml-2">Générer des certificats automatiquement</span>
            </label>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

const Step4Content: React.FC<{formState: FormState}> = ({ formState }) => {
  return (
    <FormSection title="Terminé">
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold mt-4">Félicitations !</h3>
        <p className="text-gray-700 mt-2">La création de votre formation est terminée.</p>
        <div className="mt-8">
          <p className="font-medium">Résumé :</p>
          <div className="max-w-md mx-auto mt-4 text-left">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500">Titre :</span>
              <span>{formState.title}</span>
              <span className="text-gray-500">Statut :</span>
              <span>{formState.status}</span>
              <span className="text-gray-500">Catégorie :</span>
              <span>{formState.category}</span>
              <span className="text-gray-500">Niveau :</span>
              <span>{formState.level}</span>
              <span className="text-gray-500">Participants :</span>
              <span>{formState.listeParticipants?.length || 0}</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button 
            type="button"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Voir la formation
          </button>
        </div>
      </div>
    </FormSection>
  );
};

const FormationModal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formState, setFormState] = useState<FormState>({
    title: "AWS : Développement, déploiement et gestion",
    description: "",
    status: "",
    category: "",
    level: "",
    imageFormation: null,
    registrationLink: "",
    listeParticipants: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: Step[] = [
    { number: "1", label: "Informations générales", active: currentStep === 1 },
    { number: "2", label: "Participants & Classes", active: currentStep === 2 },
    { number: "3", label: "Publication", active: currentStep === 3 },
    { number: "4", label: "Terminé", active: currentStep === 4 }
  ];

  const statusOptions = [
    { label: "En cours", value: "En cours" },
    { label: "Terminé", value: "Terminé" },
    { label: "En pause", value: "En pause" }
  ];

  const categoryOptions = [
    { label: "Développement", value: "Développement" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" }
  ];

  const levelOptions = [
    { label: "Débutant", value: "Débutant" },
    { label: "Intermédiaire", value: "Intermédiaire" },
    { label: "Avancé", value: "Avancé" }
  ];

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

      if (!formState.imageFormation) {
        newErrors.imageFormation = "L'image de formation est obligatoire";
      }
    }

    if (currentStep === 2) {
      if (!formState.listeParticipants?.length) {
        newErrors.listeParticipants = "Au moins une liste de participants est requise";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Content
            formState={formState}
            setFormState={setFormState}
            statusOptions={statusOptions}
            categoryOptions={categoryOptions}
            levelOptions={levelOptions}
            errors={errors}
          />
        );
      case 2:
        return (
          <Step2Content 
            formState={formState}
            setFormState={setFormState}
            errors={errors}
          />
        );
      case 3:
        return <Step3Content />;
      case 4:
        return <Step4Content formState={formState} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-6">Créer une formation</h1>

        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                <div 
                  className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                    ${step.active ? 'border-orange-500 text-orange-500' : 'border-gray-300 text-gray-300'}`}
                >
                  {step.number}
                </div>
                <div className="ml-2 text-sm">{step.label}</div>
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-gray-300"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Précédent
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors ml-auto"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors ml-auto"
            >
              Terminer
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default FormationModal;