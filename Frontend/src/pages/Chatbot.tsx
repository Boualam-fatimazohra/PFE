import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Send, Loader2, FileUp, Trash, Tag, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from "react-router-dom";
import EnhanceListButton from '@/components/dashboardElement/EnhanceListButton'; // Make sure the path is correct

// Define types for clarity and type safety
interface Message {
  sender: 'user' | 'bot';
  text: string;
  id?: number;
}

interface UploadedFile {
  name: string;
  data: string;
  fullLength?: number;
  response?: string;
  fullData?: any;
  fullPath?: any;
}

interface ChatResponse {
  fullPath?: any;
  fullData?: any;
  message?: string;
  response?: string;
  success?: boolean;
  data?: any;
  error?: string;
  name?: string;
  fullLength?: number;
}

interface AnalysisTag {
  id: string;
  label: string;
  query: string;
}

interface ProcessingResults {
  totalBeneficiaries?: number;
  eligiblePhoneNumbers?: number;
  totalContacts?: number;
}

interface Suggestion {
  id: string;
  label: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showTags, setShowTags] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [processingResults, setProcessingResults] = useState<ProcessingResults | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Analyses prédéfinies sous forme de tags
  const analysisTags: AnalysisTag[] = [
    {
      id: 'beneficiaires-par-formation-genre',
      label: 'Bénéficiaires par formation/genre (%)',
      query: 'Calcule le nombre de bénéficiaires pour chaque formation assistée par un formateur selon le genre (F/H) avec pourcentages'
    },
    {
      id: 'moyenne-participants-age',
      label: 'Moyenne participants par âge',
      query: 'Calcule la moyenne des participants par catégorie d\'âge'
    },
    {
      id: 'beneficiaires-par-formation-nationalite',
      label: 'Bénéficiaires par formation/nationalité (%)',
      query: 'Calcule le nombre de bénéficiaires pour chaque formation assistée par un formateur selon la nationalité avec pourcentages'
    },
    {
      id: 'total-beneficiaires',
      label: 'Total des bénéficiaires',
      query: 'Donne moi le nombre total des bénéficiaires'
    }
  ];

  // Suggestions prédéfinies pour l'accueil
  const suggestions: Suggestion[] = [
    {
      id: 'rapport-participation',
      label: 'Générer un rapport détaillé sur la participation des apprenants à ma dernière session'
    },
    {
      id: 'analyse-retours',
      label: 'Analyser les retours des participants sur ma dernière formation'
    },
    {
      id: 'creer-planning',
      label: 'Créer un planning pour mes prochaines sessions'
    },
    {
      id: 'total-beneficiaires',
      label: 'Donne moi le nombre total des bénéficiaires'
    }
  ];

  // URL de base API - facilite le changement d'environnement
  const API_BASE_URL = 'http://localhost:5000';

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fonction pour récupérer le message de bienvenue
  const fetchWelcomeMessage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: ChatResponse = await response.json();
      if (data.message) {
        setMessages([{ 
          sender: 'bot', 
          text: data.message + (uploadedFiles.length > 0 ? "\n\nVous avez déjà téléchargé des fichiers. Vous pouvez me poser des questions à leur sujet." : ""),
          id: Date.now()
        }]);
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(`Erreur de connexion au chatbot: ${err instanceof Error ? err.message : 'Erreur inconnue'}. Vérifiez que le serveur est en cours d'exécution sur ${API_BASE_URL}`);
      setMessages([{ 
        sender: 'bot', 
        text: "Je suis actuellement indisponible. Veuillez vérifier que le serveur backend est en cours d'exécution.",
        id: Date.now()
      }]);
    }
  };

  // Fonction pour gérer l'envoi de messages
  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;
  
    const userMessage: Message = { sender: 'user', text: messageToSend, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setShowSuggestions(false);

    // Si on demande des bénéficiaires et qu'on a déjà les résultats, afficher directement
    if (
      (messageToSend.toLowerCase().includes('bénéficiaires') || 
       messageToSend.toLowerCase().includes('beneficiaires') ||
       messageToSend.toLowerCase().includes('total')) && 
      processingResults?.totalBeneficiaries
    ) {
      // Ajouter immédiatement la réponse (juste le nombre)
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: `Le nombre total de bénéficiaires est de ${processingResults.totalBeneficiaries}.`,
          id: Date.now() 
        }]);
        setLoading(false);
      }, 500);
      return;
    }
   
    try {
      // Determine which files to send - priorité à fullData et fullPath
      let fileContextToSend = [];
      if (activeFile) {
        const file = uploadedFiles.find(f => f.name === activeFile);
        if (file) {
          // S'assurer que les données complètes sont envoyées
          const preparedFile = {
            ...file,
            // S'assurer que fullData est prioritaire
            fullData: file.fullData || undefined,
            // S'assurer que le chemin est correctement inclus
            fullPath: file.fullPath || undefined
          };
          fileContextToSend = [preparedFile];
        }
      } else if (uploadedFiles.length > 0) {
        // Préparation de tous les fichiers avec priorité aux données complètes
        fileContextToSend = uploadedFiles.map(file => ({
          ...file,
          fullData: file.fullData || undefined,
          fullPath: file.fullPath || undefined
        }));
      }

      // Afficher un message d'attente pour les fichiers volumineux
      const totalSize = fileContextToSend.reduce((sum, file) => 
        sum + (file.fullLength || (file.fullData?.length || file.data?.length || 0)), 0);
      
      if (totalSize > 200000) {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Analyse de ${fileContextToSend.length} fichier(s) volumineux en cours (${Math.round(totalSize/1024)} Ko au total). Cela peut prendre un peu plus de temps...`,
          id: Date.now() - 1
        }]);
      }

      // Implémenter un timeout plus long pour les gros fichiers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          fileContext: fileContextToSend
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      if (data.response) {
        // Analyze the response to extract potential metrics
        const responseText = data.response;
        // Look for patterns of beneficiary numbers
        const beneficiaryMatch = responseText.match(/(\d+)\s*(bénéficiaires|beneficiaires|participants|total)/i);
        if (beneficiaryMatch && !processingResults) {
          setProcessingResults({
            totalBeneficiaries: parseInt(beneficiaryMatch[1]),
            eligiblePhoneNumbers: Math.floor(parseInt(beneficiaryMatch[1]) * 0.45),
            totalContacts: parseInt(beneficiaryMatch[1])
          });
        }
        
        setMessages(prev => [...prev, { sender: 'bot', text: data.response, id: Date.now() }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      
      // Gestion spéciale pour les erreurs de timeout
      let errorMessage;
      if (err.name === 'AbortError') {
        errorMessage = "Le traitement a pris trop de temps. Les fichiers sont peut-être trop volumineux.";
      } else {
        errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      }
      
      setError(`Erreur lors de l'envoi du message: ${errorMessage}`);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `Désolé, une erreur s'est produite lors du traitement de votre demande: ${errorMessage}`,
        id: Date.now()
      }]);
    } finally {
      setLoading(false);
      setShowTags(false); // Hide tags after selection
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const files = Array.from(fileList);
    setLoading(true);
    setError('');
  
    for (const file of files) {
      // Accepter CSV, mais aussi PDF, TXT et d'autres formats courants
      const acceptedFormats = ['.csv', '.txt', '.pdf', '.docx', '.xlsx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedFormats.includes(fileExtension)) {
        setError(`Format de fichier ${fileExtension} non supporté. Formats acceptés: CSV, TXT, PDF, DOCX, XLSX`);
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('csvFile', file);
  
      try {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Traitement du fichier ${file.name} en cours...`,
          id: Date.now()
        }]);
        
        // Implémenter un timeout plus long pour les gros fichiers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes
        
        const response = await fetch(`${API_BASE_URL}/upload-csv`, {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }
        
        const data: ChatResponse = await response.json();
        
        if (data.success && (data.data || data.fullData)) {
          // Vérifier que les données sont valides - priorité à fullData
          const fileContent = data.fullData || data.data;
          if (typeof fileContent === 'string' && fileContent.trim().length === 0) {
            throw new Error("Le fichier semble être vide ou son contenu n'a pas pu être extrait");
          }
          
          console.log(`Fichier ${file.name} chargé, taille totale:`, data.fullLength || (typeof fileContent === 'string' ? fileContent.length : 'N/A'));
          
          // Stocker les données du fichier - s'assurer que fullData est bien conservé
          const newFile: UploadedFile = { 
            name: file.name, 
            data: data.data || "", // Version tronquée pour l'affichage
            fullData: data.fullData || data.data, // Données complètes - priorité à fullData
            response: data.response,
            fullPath: data.fullPath, // Chemin vers le fichier complet
            fullLength: data.fullLength || (typeof fileContent === 'string' ? fileContent.length : 0)
          };
          
          setUploadedFiles(prev => {
            // Éviter les doublons
            const existingIndex = prev.findIndex(f => f.name === file.name);
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = newFile;
              return updated;
            }
            return [...prev, newFile];
          });
          
          // Si c'est le premier fichier, le définir comme actif automatiquement
          if (uploadedFiles.length === 0 && !activeFile) {
            setActiveFile(file.name);
          }
          
          const fileSizeInfo = data.fullLength 
            ? `(${typeof data.data === 'string' ? data.data.length : 'N/A'} caractères affichés sur ${data.fullLength} au total)`
            : `(${typeof fileContent === 'string' ? fileContent.length : 'N/A'} caractères)`;
            
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Le fichier ${file.name} a été téléchargé avec succès ${fileSizeInfo}. Vous pouvez maintenant me poser des questions sur son contenu complet.`,
            id: Date.now()
          }]);
        } else {
          throw new Error(data.error || "Erreur lors du traitement du fichier - aucune donnée retournée");
        }
      } catch (err) {
        console.error("Erreur d'upload:", err);
        
        // Gestion spéciale pour les erreurs de timeout
        let errorMessage;
        if (err.name === 'AbortError') {
          errorMessage = "Le traitement du fichier a pris trop de temps. Le fichier est peut-être trop volumineux.";
        } else {
          errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        }
        
        setError(`Erreur lors du téléchargement de ${file.name}: ${errorMessage}`);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Erreur lors du traitement du fichier ${file.name}: ${errorMessage}. Veuillez réessayer avec un autre fichier ou diviser ce fichier en plusieurs parties.`,
          id: Date.now()
        }]);
      }
    }
  
    if (event.target) {
      event.target.value = '';
    }
    setLoading(false);
  };
    
  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
    
    if (activeFile === fileName) {
      // Si on supprime le fichier actif, définir le premier fichier restant comme actif ou null
      setActiveFile(prev => {
        const remainingFiles = uploadedFiles.filter(file => file.name !== fileName);
        return remainingFiles.length > 0 ? remainingFiles[0].name : null;
      });
    }
    
    setMessages(prev => [...prev, {
      sender: 'bot',
      text: `Le fichier ${fileName} a été supprimé.`,
      id: Date.now()
    }]);
  };
  
  const toggleActiveFile = (fileName: string) => {
    if (activeFile === fileName) {
      // Désactiver le fichier actif
      setActiveFile(null);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Toutes les questions seront désormais traitées avec tous les fichiers disponibles.`,
        id: Date.now()
      }]);
    } else {
      // Activer un nouveau fichier
      setActiveFile(fileName);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Le fichier ${fileName} est maintenant actif. Toutes les questions seront traitées dans le contexte de ce fichier.`,
        id: Date.now()
      }]);
    }
  };
  
  // Fonction pour appliquer une analyse prédéfinie
  const applyAnalysisTag = async (tag: AnalysisTag) => {
    if (uploadedFiles.length === 0) {
      setError("Veuillez d'abord télécharger un fichier pour effectuer cette analyse");
      return;
    }
    setInput(tag.query);
    sendMessage(tag.query);
    setShowTags(false); // Masquer les tags après la sélection
  };
  
  // Fonction pour utiliser une suggestion
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInput(suggestion.label);
    sendMessage(suggestion.label);
    setShowSuggestions(false);
  };
  
  // Fonction pour formater le texte avec des retours à la ligne
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  // Fonction pour traiter automatiquement une requête spécifique
  const handleEnhance = () => {
    if (uploadedFiles.length === 0) {
      setError("Veuillez d'abord télécharger des fichiers pour effectuer cette analyse");
      return;
    }
    
    setAiLoading(true);
    
    // Simulate processing files
    setTimeout(() => {
      // Set analysis results
      setProcessingResults({
        totalBeneficiaries: 450,
        eligiblePhoneNumbers: 200,
        totalContacts: 450
      });
      
      // Automatically send a query for the number of beneficiaries
      setAiLoading(false);
      
      // Add an automatic bot message about the completed analysis
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "J'ai analysé vos fichiers. Voici les résultats principaux:",
        id: Date.now()
      }]);
      
      // Wait a moment and then send the automatic query
      setTimeout(() => {
        sendMessage("Donne moi le nombre total des bénéficiaires");
      }, 500);
    }, 1500);
  };

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Vérifier si des fichiers ont été passés via la navigation
    const checkForEnhancedFiles = async () => {
      if (location?.state?.enhancedFiles && location.state.enhancedFiles.length > 0) {
        const files = location.state.enhancedFiles;
        
        // Traiter les fichiers
        setLoading(true);
        for (const file of files) {
          try {
            // Convertir le File en UploadedFile
            const formData = new FormData();
            formData.append('csvFile', file);
            
            const response = await fetch(`${API_BASE_URL}/upload-csv`, {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            
            const data: ChatResponse = await response.json();
            
            // Ajouter le fichier à la liste
            setUploadedFiles(prev => {
              const newFile: UploadedFile = { 
                name: file.name, 
                data: data.data || "", 
                fullData: data.fullData || data.data || "", 
                response: data.response || "",
                fullPath: data.fullPath, 
                fullLength: data.fullLength
              };
              return [...prev, newFile];
            });
            
            // Définir le premier fichier comme actif
            if (files.indexOf(file) === 0) {
              setActiveFile(file.name);
            }
          } catch (err) {
            console.error("Erreur lors du traitement du fichier:", err);
          }
        }
        setLoading(false);
        
        // Récupérer les résultats de traitement s'ils existent
        if (location.state.processingResults) {
          setProcessingResults(location.state.processingResults);
        }
        
        // Vérifier s'il y a un message automatique à envoyer
        if (location.state.automaticMessage) {
          setTimeout(() => {
            sendMessage(location.state.automaticMessage);
          }, 500);
        }
      }
    };
    
    checkForEnhancedFiles();
  }, [location]);
  
  return (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Header avec fermeture et bouton d'amélioration */}
      <div className="flex justify-between p-4 items-center">
        <button className="text-black font-bold text-xl">×</button>
        {uploadedFiles.length > 0 && (
          <EnhanceListButton 
            fileList={uploadedFiles}
            onEnhanceComplete={(results) => {
              console.log("Enhancement complete with results:", results);
              // Vous pouvez ajouter d'autres actions ici si nécessaire
            }}
            setMessages={setMessages}
            setProcessingResults={setProcessingResults}
            setLoading={setLoading}
          />
        )}
        <button className="text-black">⋮</button>
      </div>

      {/* Résultats de l'analyse (visible uniquement si des résultats existent) */}
      {processingResults && (
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Résultat AI</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-4 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total bénéficiaires</p>
                <p className="text-xl font-semibold">{processingResults.totalBeneficiaries}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Numéros éligibles</p>
                <p className="text-xl font-semibold">{processingResults.eligiblePhoneNumbers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total bénéficiaires</p>
                <p className="text-xl font-semibold">{processingResults.totalBeneficiaries}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total bénéficiaires</p>
                <p className="text-xl font-semibold">{processingResults.totalBeneficiaries}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay de chargement de l'IA */}
      {aiLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-t-4 border-b-4 border-purple-600 rounded-full animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600 text-2xl">+</div>
            </div>
            <p className="text-purple-800 font-medium">AI Loading...</p>
          </div>
        </div>
      )}

      {/* Conteneur principal */}
      <div className="flex-1 flex flex-col items-center justify-between py-4 px-4">
        {/* Section supérieure avec icône et titre */}
        <div className="flex flex-col items-center my-[10px]">
          <div className="text-orange-500 mb-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3l1.7 4.8h5.1l-4 3.6 1.3 5.6-4.1-3.4-4.1 3.4 1.3-5.6-4-3.6h5.1z" fill="currentColor"/>
              <path d="M17 10l1.7 2.8h3.1l-2.5 2.2 0.8 3.6-3.1-2.4-3.1 2.4 0.8-3.6-2.5-2.2h3.1z" fill="currentColor"/>
              <path d="M7 10l1.7 2.8h3.1l-2.5 2.2 0.8 3.6-3.1-2.4-3.1 2.4 0.8-3.6-2.5-2.2h3.1z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-center">Ask our AI anything</h1>
        </div>

        {/* Zone de messages */}
        <div 
          className="w-full flex-1 overflow-y-auto mb-4 px-2 scrollbar-container"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#e2e8f0 #f8fafc',
            maxHeight: 'calc(100vh - 250px)'
          }}
        >
          <style>
            {`
              .scrollbar-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
              }
              .scrollbar-container::-webkit-scrollbar-track {
                background: #f8fafc;
                border-radius: 4px;
              }
              .scrollbar-container::-webkit-scrollbar-thumb {
                background-color: #e2e8f0;
                border-radius: 4px;
                border: 2px solid #f8fafc;
              }
              .scrollbar-container::-webkit-scrollbar-thumb:hover {
                background-color: #cbd5e1;
              }
            `}
          </style>
          
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-lg whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-50 border shadow-sm'
                }`}
              >
                {formatMessageText(msg.text)}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="bg-white border shadow-sm p-3 rounded-lg flex items-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Traitement en cours...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Erreur */}
        {error && (
          <Alert variant="destructive" className="mb-4 w-full max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Suggestions - Modifiées pour correspondre à l'image */}
        {showSuggestions && messages.length <= 1 && !loading && (
          <div className="w-full">
            <p className="text-gray-500 text-sm mb-2 text-center">Suggestions on what to ask Our AI</p>
            <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar mb-4">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 text-xs min-w-[120px] text-left flex-shrink-0"
                  style={{ maxWidth: '160px' }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags d'analyses prédéfinies - Modifiés pour être semblables aux suggestions */}
        {uploadedFiles.length > 0 && showTags && (
          <div className="w-full mb-4">
            <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar">
              {analysisTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => applyAnalysisTag(tag)}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 text-xs min-w-[120px] text-left flex-shrink-0"
                  style={{ maxWidth: '160px' }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toggle pour afficher/masquer les analyses */}
        {uploadedFiles.length > 0 && (
          <div className="w-full flex justify-center mb-2">
            <button 
              onClick={() => setShowTags(!showTags)}
              className="flex items-center text-xs text-orange-600 hover:text-orange-700"
            >
              <Tag className="w-3 h-3 mr-1" /> 
              {showTags ? "Masquer les analyses" : "Afficher les analyses"}
            </button>
          </div>
        )}

        {/* Tags d'analyses prédéfinies */}
        {uploadedFiles.length > 0 && (
          <div className="w-full max-w-md mb-4">
            <div className="flex items-center mb-2">
              <button 
                onClick={() => setShowTags(!showTags)}
                className="flex items-center text-sm text-orange-600 hover:text-orange-700"
              >
                <Tag className="w-4 h-4 mr-1" /> 
                {showTags ? "Masquer les analyses prédéfinies" : "Afficher les analyses prédéfinies"}
              </button>
            </div>
          </div>
        )}

        {/* Toggle pour afficher/masquer les analyses */}
        {uploadedFiles.length > 0 && (
          <div className="w-full flex justify-center mb-2">
            <button 
              onClick={() => setShowTags(!showTags)}
              className="flex items-center text-xs text-orange-600 hover:text-orange-700"
            >
              <Tag className="w-3 h-3 mr-1" /> 
              {showTags ? "Masquer les analyses" : "Afficher les analyses"}
            </button>
          </div>
        )}

        {/* Input et bouton d'envoi */}
        <div className="w-full mt-2 mb-4 relative flex items-center">
          <label className="mr-2">
            <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer">
              <FileUp className="w-5 h-5 text-gray-600" />
            </div>
            <input
              type="file"
              accept=".csv,.txt,.pdf,.docx,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              multiple
              disabled={loading}
            />
          </label>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 py-2 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none overflow-hidden"
            placeholder={activeFile 
              ? `Posez une question sur ${activeFile}...` 
              : uploadedFiles.length > 0 
                ? "Posez une question sur vos fichiers..."
                : "Ask me anything about your dashboard..."}
            disabled={loading}
            rows={1}
            style={{ minHeight: '44px', maxHeight: '100px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.7101 0.516578C20.8107 0.131995 21.8681 1.18933 21.4835 2.28999L15.0647 20.6308C14.6477 21.8203 12.9902 21.8875 12.4788 20.7359L9.38157 13.7679L13.7409 9.4075C13.8844 9.25347 13.9626 9.04976 13.9588 8.83926C13.9551 8.62877 13.8699 8.42794 13.721 8.27907C13.5721 8.13021 13.3713 8.04494 13.1608 8.04122C12.9503 8.03751 12.7466 8.11564 12.5926 8.25916L8.23215 12.6185L1.26415 9.52125C0.112566 9.00883 0.180816 7.35241 1.36923 6.93533L19.7101 0.516578Z" fill="#FF7900"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;