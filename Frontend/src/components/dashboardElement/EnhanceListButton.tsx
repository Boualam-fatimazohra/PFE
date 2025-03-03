import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';

// Import or define the types from the parent component
interface UploadedFile {
  name: string;
  data: string;
  fullLength?: number;
  type?: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  id?: number;
}

interface ProcessingResults {
  totalBeneficiaries?: number;
  eligiblePhoneNumbers?: number;
  totalContacts?: number;
  processedFilesCount?: number;
}

// Define props interface for the component
interface EnhanceListButtonProps {
  fileList: File[] | UploadedFile[]; // Accept both types of file objects
  onEnhanceComplete?: (results: ProcessingResults) => void;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setProcessingResults: Dispatch<SetStateAction<ProcessingResults | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

const EnhanceListButton = ({ 
  fileList, 
  onEnhanceComplete, 
  setMessages, 
  setProcessingResults, 
  setLoading 
}: EnhanceListButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [results, setResults] = useState<ProcessingResults | null>(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Debug logging to help troubleshoot the issue
  useEffect(() => {
    console.log("EnhanceListButton received fileList:", fileList);
    
    // Check explicitly if the array has any items
    const filesAvailable = Array.isArray(fileList) && fileList.length > 0;
    setHasFiles(filesAvailable);
    console.log("Files available:", filesAvailable);
    
    // Additional logging to check file structure
    if (filesAvailable) {
      console.log("First file structure:", JSON.stringify(fileList[0]));
    }
  }, [fileList]);

  // Fonction pour obtenir uniquement un nombre à partir de l'API
  const fetchNumericValue = async (query: string): Promise<number> => {
    try {
      // Ajouter un indicateur spécifique pour dire au serveur de ne pas afficher la réponse dans le chat
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query + " presente moi uniquement le chiffre",
          fileContext: fileList,
          hideFromChat: true // Flag pour indiquer au serveur que cette requête est en arrière-plan
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Extraire le nombre de la réponse
      const numericValue = parseInt(data.response.replace(/[^\d]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre:", error);
      return 0;
    }
  };

  const handleEnhance = async () => {
    // Double-check before clicking
    if (!Array.isArray(fileList) || fileList.length === 0) {
      console.error("No files available for enhancement");
      alert("Veuillez d'abord importer des fichiers");
      return;
    }
    
    console.log("Processing files:", fileList);
    setIsLoading(true);
    
    try {
      // Montrer un indicateur de chargement général
      setLoading(true);
      
      // Demander directement les valeurs numériques sans afficher les messages dans le chat
      const totalBeneficiaries = await fetchNumericValue("Donne moi le nombre total des bénéficiaires");
      const eligiblePhoneNumbers = await fetchNumericValue("Donne moi le nombre de numéros éligibles");
      const totalContacts = await fetchNumericValue("Donne moi le total des contacts");
      
      // Créer l'objet de résultats
      const newResults: ProcessingResults = {
        totalBeneficiaries,
        eligiblePhoneNumbers,
        totalContacts,
        processedFilesCount: fileList.length
      };
      
      // Stocker localement les résultats
      setResults(newResults);
      
      // Mettre à jour l'état des résultats dans le composant parent
      setProcessingResults(newResults);
      
      // Ajouter un message discret pour indiquer que l'analyse est terminée
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Analyse complète. Les résultats sont affichés ci-dessus.",
        id: Date.now()
      }]);
      
      // Notifier le composant parent que l'amélioration est terminée
      if (onEnhanceComplete) {
        onEnhanceComplete(newResults);
      }
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      alert("Une erreur s'est produite lors du traitement des fichiers");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Here we return the button only, not the results or loading state
  return (
    <button 
      onClick={handleEnhance}
      className={`${hasFiles ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-400'} text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
      disabled={isLoading || !hasFiles}
      aria-disabled={!hasFiles}
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <PlusCircle size={20} />
      )}
      Améliorer {hasFiles ? '' : '(importez des fichiers)'}
    </button>
  );
};

export default EnhanceListButton;