import { useState } from 'react';
import { ArrowUpRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnhanceListButton = ({ fileList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();
  
  const handleEnhance = () => {
    if (!fileList || fileList.length === 0) {
      alert("Veuillez d'abord importer des fichiers");
      return;
    }
    
    setIsLoading(true);
    
    // Rediriger vers la page du chatbot avec les fichiers existants
    navigate('/chatbot', {
      state: {
        enhancedFiles: fileList,
      }
    });
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setShowPanel(!showPanel)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
      >
        <PlusCircle size={20} />
        Enhance List
      </button>
      
      {showPanel && (
        <div className="absolute right-0 z-10 mt-2 w-72 space-y-4 p-4 border rounded-lg bg-white shadow-lg">
          <h3 className="font-medium text-lg">Améliorer la liste</h3>
          
          {fileList && fileList.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {fileList.length} fichier(s) prêt(s) à améliorer:
              </p>
              <ul className="text-sm text-gray-700 mb-4 max-h-32 overflow-y-auto">
                {fileList.map((file, index) => (
                  <li key={index} className="truncate py-1">• {file.name}</li>
                ))}
              </ul>
              
              <button
                onClick={handleEnhance}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ArrowUpRight className="w-5 h-5 mr-2" />
                {isLoading ? "Traitement..." : "Améliorer la liste"}
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-600">
                Aucun fichier n'a été importé. Veuillez d'abord importer des fichiers.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhanceListButton;