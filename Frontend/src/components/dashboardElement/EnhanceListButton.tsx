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
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<ProcessingResults | null>(null);

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

  const handleEnhance = async () => {
    // Double-check before clicking
    if (!Array.isArray(fileList) || fileList.length === 0) {
      console.error("No files available for enhancement");
      alert("Veuillez d'abord importer des fichiers");
      return;
    }
    
    console.log("Processing files:", fileList);
    setIsLoading(true);
    setShowResults(false);
    
    try {
      // Here you would normally process the files
      // For now, we'll simulate processing with the same results
      const newResults: ProcessingResults = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            totalBeneficiaries: 450,
            eligiblePhoneNumbers: 200,
            totalContacts: 450
          });
        }, 1500); // Simulate processing for 1.5 seconds
      });
      
      // Store results locally and show them
      setResults(newResults);
      setShowResults(true);
      
      // Update the processing results state in the parent component
      setProcessingResults(newResults);
      
      // Add a message to the chat indicating analysis is complete
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "J'ai analysé vos fichiers. Voici les résultats principaux:",
        id: Date.now()
      }]);
      
      // Automatically send the query for beneficiaries count
      setTimeout(() => {
        const query = "Donne moi le nombre total des bénéficiaires";
        
        // Add user message
        setMessages(prev => [...prev, {
          sender: 'user',
          text: query,
          id: Date.now()
        }]);
        
        // Simulate bot response
        setLoading(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Le nombre total de bénéficiaires est de ${newResults.totalBeneficiaries}.`,
            id: Date.now()
          }]);
          setLoading(false);
        }, 800);
      }, 500);
      
      // Notify parent component that enhancement is complete
      if (onEnhanceComplete) {
        onEnhanceComplete(newResults);
      }
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      alert("Une erreur s'est produite lors du traitement des fichiers");
    } finally {
      setIsLoading(false);
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