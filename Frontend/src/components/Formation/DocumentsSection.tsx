import * as React from "react";
import { Eye, Download, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Document {
  title: string;
  date: string;
  file?: File;
}

interface DocumentsSectionProps {
  initialDocuments?: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ initialDocuments = [] }) => {
  const [documents, setDocuments] = React.useState<Document[]>(initialDocuments);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Créer un nouveau document pour chaque fichier importé
    const newDocuments = Array.from(files).map(file => ({
      title: file.name,
      date: new Date().toLocaleDateString('fr-FR'),
      file: file
    }));
    
    setDocuments([...documents, ...newDocuments]);
    
    // Réinitialiser l'input file pour permettre d'importer le même fichier à nouveau
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleView = (doc: Document, index: number) => {
    if (doc.file) {
      // Créer un URL pour le fichier et l'ouvrir dans un nouvel onglet
      const fileURL = URL.createObjectURL(doc.file);
      window.open(fileURL, '_blank');
    }
  };

  const handleDownload = (doc: Document, index: number) => {
    if (doc.file) {
      // Créer un élément <a> pour télécharger le fichier
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(doc.file);
      downloadLink.download = doc.title;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleDelete = (index: number) => {
    const newDocuments = [...documents];
    newDocuments.splice(index, 1);
    setDocuments(newDocuments);
  };

  return (
    <div className="bg-white p-6 border border-gray-400">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Kit Formations</h3>
        <Button onClick={handleImportClick} className="bg-black text-white hover:bg-gray-800">
          Importer
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
        />
      </div>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-y border-gray-300">
            <span className="font-semibold text-gray-700">{doc.title}</span>
            <div className="flex items-center gap-4 md:gap-8">
              <span className="text-sm text-gray-600 font-semibold">{doc.date}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleView(doc, index)} className="p-1 rounded hover:bg-gray-100">
                  <Eye className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={() => handleDownload(doc, index)} className="p-1 rounded hover:bg-gray-100">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(index)} className="p-1 rounded hover:bg-gray-100">
                  <Trash2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Aucun document. Cliquez sur "Importer" pour ajouter des documents.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsSection;