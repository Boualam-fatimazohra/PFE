import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Send, Loader2, FileUp, Trash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

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

const Chatbot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    
    // URL de base API - facilite le changement d'environnement
    const API_BASE_URL = 'http://localhost:5000';
  
    useEffect(() => {
      fetchWelcomeMessage();
    }, []);
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
  
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
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };
  
    const sendMessage = async () => {
      if (!input.trim()) return;
    
      const userMessage: Message = { sender: 'user', text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setLoading(true);
      setError('');
    
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
            message: input,
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
    
    // Fonction pour formater le texte avec des retours à la ligne
    const formatMessageText = (text: string) => {
      return text.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      ));
    };
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-orange-600">
            Assistant virtuel avec analyse de fichiers
          </CardTitle>
        </CardHeader>
  
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
  
          <div className="h-[500px] overflow-y-auto border rounded-lg p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  {formatMessageText(msg.text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border shadow-sm p-3 rounded-lg flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Traitement en cours...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
  
          <div className="space-y-2">
            {uploadedFiles.length > 0 && (
              <div className="border rounded-lg p-2 bg-gray-50">
                <p className="font-medium mb-2">Fichiers téléchargés ({uploadedFiles.length}):</p>
                <div className="max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className={`flex items-center justify-between p-2 hover:bg-gray-100 rounded ${activeFile === file.name ? 'bg-orange-100' : ''}`}>
                      <button 
                        onClick={() => toggleActiveFile(file.name)}
                        className={`text-left truncate flex-1 ${activeFile === file.name ? 'font-bold text-orange-600' : ''}`}
                        title={activeFile === file.name ? "Désactiver ce fichier" : "Activer ce fichier comme contexte principal"}
                      >
                        {file.name} {activeFile === file.name ? '(actif)' : ''}
                        {file.fullLength && file.fullLength > file.data.length && 
                          <span className="text-xs text-gray-500 ml-2">
                            (tronqué: {Math.round(file.data.length/1000)}k/{Math.round(file.fullLength/1000)}k)
                          </span>
                        }
                      </button>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Supprimer ce fichier"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            <div className="flex gap-2">
              <label className="flex-none">
                <div className="bg-gray-100 hover:bg-gray-200 rounded-lg p-2 cursor-pointer">
                  <FileUp className="w-6 h-6 text-gray-600" />
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
  
              <div className="flex-1 flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[40px] max-h-[120px] p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder={activeFile 
                    ? `Posez une question sur ${activeFile}...` 
                    : uploadedFiles.length > 0 
                      ? "Posez une question sur vos fichiers..."
                      : "Écrivez votre message..."}
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="flex-none bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
};

export default Chatbot;