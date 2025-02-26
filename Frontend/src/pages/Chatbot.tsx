import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Send, Loader2, FileUp, Trash, Tag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useLocation } from "react-router-dom";

// Define types for clarity and type safety
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface UploadedFile {
  name: string;
  data: string;
  fullLength?: number;
}

interface ChatResponse {
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

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [showTags, setShowTags] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation(); // Si vous utilisez React Router

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
    }
  ];

  // Suggestions prédéfinies pour l'accueil
  const suggestions = [
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
          text: data.message + (uploadedFiles.length > 0 ? "\n\nVous avez déjà téléchargé des fichiers. Vous pouvez me poser des questions à leur sujet." : "")
        }]);
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(`Erreur de connexion au chatbot: ${err instanceof Error ? err.message : 'Erreur inconnue'}. Vérifiez que le serveur est en cours d'exécution sur ${API_BASE_URL}`);
      setMessages([{ 
        sender: 'bot', 
        text: "Je suis actuellement indisponible. Veuillez vérifier que le serveur backend est en cours d'exécution."
      }]);
    }
  };

  // Fonction pour gérer l'envoi de messages
  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;
  
    const userMessage: Message = { sender: 'user', text: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setShowSuggestions(false);
  
    try {
      // Déterminer quels fichiers envoyer
      let fileContextToSend = [];
      if (activeFile) {
        const file = uploadedFiles.find(f => f.name === activeFile);
        if (file) {
          fileContextToSend = [file];
          console.log(`Envoi du fichier actif: ${file.name} avec ${file.data.length} caractères`);
        }
      } else if (uploadedFiles.length > 0) {
        fileContextToSend = uploadedFiles;
        console.log(`Envoi de ${uploadedFiles.length} fichiers`);
      }
  
      // Vérifier si les fichiers sont de taille raisonnable
      const totalSize = fileContextToSend.reduce((total, file) => total + file.data.length, 0);
      if (totalSize > 500000) {
        console.warn(`Attention: Envoi de ${totalSize} caractères. Possibles problèmes de performance.`);
      }
  
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          fileContext: fileContextToSend
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }
  
      const data: ChatResponse = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Réponse inattendue du serveur");
      }
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de l'envoi du message: ${errorMessage}`);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `Désolé, une erreur s'est produite lors du traitement de votre demande: ${errorMessage}`
      }]);
    } finally {
      setLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
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
          text: `Traitement du fichier ${file.name} en cours...`
        }]);
        
        const response = await fetch(`${API_BASE_URL}/upload-csv`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
        }
        
        const data: ChatResponse = await response.json();
        
        if (data.success && data.data) {
          // Vérifier que data.data contient des données valides
          if (data.data.trim().length === 0) {
            throw new Error("Le fichier semble être vide ou son contenu n'a pas pu être extrait");
          }
          
          console.log(`Fichier ${file.name} chargé, taille des données:`, data.data.length);
          
          // Stocker les données du fichier
          const newFile: UploadedFile = { 
            name: file.name, 
            data: data.data,
            fullLength: data.fullLength
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
            ? `(${data.data.length} caractères affichés sur ${data.fullLength} au total)`
            : `(${data.data.length} caractères)`;
            
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Le fichier ${file.name} a été téléchargé avec succès ${fileSizeInfo}. Vous pouvez maintenant me poser des questions sur son contenu.`
          }]);
        } else {
          throw new Error(data.error || "Erreur lors du traitement du fichier - aucune donnée retournée");
        }
      } catch (err) {
        console.error("Erreur d'upload:", err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(`Erreur lors du téléchargement de ${file.name}: ${errorMessage}`);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Erreur lors du traitement du fichier ${file.name}: ${errorMessage}. Veuillez réessayer avec un autre fichier.`
        }]);
      }
    }
  
    event.target.value = '';
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
      text: `Le fichier ${fileName} a été supprimé.`
    }]);
  };
  
  const toggleActiveFile = (fileName: string) => {
    if (activeFile === fileName) {
      // Désactiver le fichier actif
      setActiveFile(null);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Toutes les questions seront désormais traitées avec tous les fichiers disponibles.`
      }]);
    } else {
      // Activer un nouveau fichier
      setActiveFile(fileName);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Le fichier ${fileName} est maintenant actif. Toutes les questions seront traitées dans le contexte de ce fichier.`
      }]);
    }
  };
  
  // Fonction pour appliquer une analyse prédéfinie
  const applyAnalysisTag = (tag: AnalysisTag) => {
    if (uploadedFiles.length === 0) {
      setError("Veuillez d'abord télécharger un fichier pour effectuer cette analyse");
      return;
    }
    
    setInput(tag.query);
    sendMessage(tag.query);
    setShowTags(false); // Masquer les tags après la sélection
  };

  // Fonction pour utiliser une suggestion
  const handleSuggestionClick = (suggestion: any) => {
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
            const reader = new FileReader();
            
            reader.onload = async (e) => {
              const fileData = e.target?.result as string;
              
              // Ajouter le fichier à la liste
              setUploadedFiles(prev => {
                const newFile: UploadedFile = { 
                  name: file.name, 
                  data: fileData,
                  fullLength: fileData.length
                };
                return [...prev, newFile];
              });
              
              // Définir le premier fichier comme actif
              if (files.indexOf(file) === 0) {
                setActiveFile(file.name);
              }
            };
            
            reader.readAsText(file);
          } catch (err) {
            console.error("Erreur lors du traitement du fichier:", err);
          }
        }
        setLoading(false);
        
        // Envoyer une question automatique pour analyser les fichiers
        setTimeout(() => {
          setInput("Pouvez-vous calculer le total des personnes inscrites, bénéficiaires éligibles, et faire une répartition par genre à partir de ces fichiers?");
          // Utiliser setTimeout à nouveau pour s'assurer que l'état est mis à jour
          setTimeout(() => {
            sendMessage();
          }, 100);
        }, 500);
      }
    };
    
    checkForEnhancedFiles();
  }, [location]); // Dépendance à location pour détecter les changements
  
  return (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Header avec fermeture */}
      <div className="flex justify-between p-4">
        <button className="text-black font-bold text-xl">×</button>
        <button className="text-black">⋮</button>
      </div>

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

        {/* Zone de messages - CORRIGÉE avec un seul conteneur de défilement */}
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
              key={index}
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

        {/* Suggestions uniquement s'il n'y a pas de messages et pas de chargement */}
        {showSuggestions && messages.length === 0 && !loading && (
          <div className="w-full max-w-md flex-1 flex flex-col justify-center">
            <p className="text-gray-500 text-sm mb-2 text-center">Suggestions on what to ask Our AI</p>
            <div className="flex flex-col space-y-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="orange-50 rounded-lg p-3 text-sm text-left shadow-sm border border-gray-200"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
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
            
            {showTags && (
              <div className="flex flex-wrap gap-2 mb-2">
                {analysisTags.map(tag => (
                  <Badge 
                    key={tag.id}
                    variant="outline" 
                    className="cursor-pointer hover:bg-orange-100 border-orange-300"
                    onClick={() => applyAnalysisTag(tag)}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input et bouton d'envoi */}
        <div className="w-full max-w-md mt-2 mb-4 relative flex items-center">
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
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-full disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;