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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations générales</h2>
      
      <div className="space-y-6">
        {/* Titre de la formation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la formation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Entrez le titre de la formation"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            className="w-full p-2.5 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Décrivez votre formation"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date début formation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin formation
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Status, Category, Level */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.category}
              onChange={(e) => setFormState({ ...formState, category: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.level}
              onChange={(e) => setFormState({ ...formState, level: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {levelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image de formation <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm text-gray-500">Maximum file size: 2MB. Supported files: jpg, jpeg.</p>
              <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Select a file
              </button>
            </div>
          </div>
        </div>

        {/* Lien d'inscription */}
        <div className="flex items-end gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien d'inscription
            </label>
            <input
              type="text"
              value={formState.registrationLink}
              onChange={(e) => setFormState({ ...formState, registrationLink: e.target.value })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="http://"
            />
          </div>
          <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

const Step2Content: React.FC<Step2ContentProps> = ({ formState, setFormState }) => {
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
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Participants & Classes</h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Listes des Participants</h3>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center hover:bg-purple-700 transition-colors">
              <PlusCircle className="w-4 h-4 mr-2" />
              Enhance List
            </button>
          </div>

          {/* Liste des fichiers */}
          {fileList.length > 0 && (
            <div className="space-y-2 mb-6">
              {fileList.map((file, index) => (
                <div key={index} className="flex justify-between items-center py-3 px-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(URL.createObjectURL(file))}
                        className="p-1 hover:text-gray-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a 
                        href={URL.createObjectURL(file)} 
                        download={file.name}
                        className="p-1 hover:text-gray-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDeleteFile(index)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone de dépôt de fichiers */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-6-6m6 6l6-6" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">
              Maximum file size: 100MB. Liste Excel ou un fichier CSV
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".csv,.xlsx"
              multiple
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Select a file
            </label>
          </div>
        </div>
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
    <FormSection title="Liste de confirmation">
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search and Filter Header */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Recherche participants..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <button className="ml-4 px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center hover:bg-gray-700">
            <span>Générer liste présence</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-4 py-3">
                  <input type="checkbox" className="rounded border-gray-300"/>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date & Heure</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Prénom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Genre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Conf Tél</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Conf Email</th>
                <th className="w-8 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded border-gray-300"/>
                  </td>
                  <td className="px-4 py-3 text-sm">26/04/2024</td>
                  <td className="px-4 py-3 text-sm">Bikarrane</td>
                  <td className="px-4 py-3 text-sm">Mohamed</td>
                  <td className="px-4 py-3 text-sm">mohamed.bikarrane@gmail.com</td>
                  <td className="px-4 py-3 text-sm">Homme</td>
                  <td className="px-4 py-3 text-sm">0644544512</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Confirmé
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      En cours
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded border border-gray-300 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
            <button className="px-3 py-1 text-sm font-medium bg-gray-900 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">2</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded">3</button>
            <button className="p-1 rounded border border-gray-300 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Retour
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

const Step4Content: React.FC<{formState: FormState}> = ({ formState }) => {
  return (
    <div className="w-full max-w-[1300px] px-6 py-8 bg-white">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Créer une formation</h2>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-12">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500">1</span>
            </div>
            <div className="ml-2 text-sm text-gray-500">Informations générales</div>
          </div>
          <div className="w-32 h-[2px] bg-gray-300 mx-4"></div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500">2</span>
            </div>
            <div className="ml-2 text-sm text-gray-500">Participants & Classes</div>
          </div>
          <div className="w-32 h-[2px] bg-gray-300 mx-4"></div>
        </div>

        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500">3</span>
            </div>
            <div className="ml-2 text-sm text-gray-500">Confirmations</div>
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center ml-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="ml-2 text-sm text-orange-500">Terminé !</span>
        </div>
      </div>

      {/* Formation Title */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900">AWS : Développement, déploiement et gestion</h3>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Formations</p>
              <p className="text-2xl font-semibold">41</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Formations</p>
              <p className="text-2xl font-semibold">25</p>
            </div>
          </div>
        </div>

        <div className="p-6 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-semibold">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
          Retour
        </button>
        <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          Valider
        </button>
      </div>
    </div>
  );
};
const FormationModal = () => {
  // State to track the current step
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