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
            <span className="font-bold text-gray-600">{doc.title}</span>
            <span className="text-sm text-gray-600 font-semibold">{doc.date}</span>

            <div className="flex items-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <button onClick={() => handleView(doc, index)} className="p-1 rounded hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3139 6.0031C12.2175 6.0031 12.1209 6 12.024 6C11.927 6 11.8304 6.0031 11.734 6.0031C7.23199 6.0031 2.67574 9.17623 1.19995 12C2.67574 14.8237 7.18399 17.9969 11.686 17.9969C11.7824 17.9969 11.879 18 11.976 18C12.0729 18 12.1695 17.9969 12.2659 17.9969C16.7679 17.9969 21.3242 14.8237 22.8 12C21.3242 9.17623 16.8159 6.0031 12.3139 6.0031ZM11.9668 16.32C11.1124 16.32 10.2772 16.0666 9.56677 15.5919C8.85635 15.1173 8.30264 14.4426 7.97567 13.6532C7.6487 12.8638 7.56315 11.9952 7.72984 11.1572C7.89653 10.3192 8.30797 9.54946 8.91213 8.9453C9.51629 8.34114 10.286 7.9297 11.124 7.76301C11.962 7.59632 12.8306 7.68187 13.62 8.00884C14.4094 8.33581 15.0841 8.88952 15.5588 9.59994C16.0335 10.3104 16.2868 11.1456 16.2868 12C16.2868 13.1457 15.8317 14.2445 15.0215 15.0547C14.2114 15.8649 13.1126 16.32 11.9668 16.32ZM2.89003 12.0009C3.6048 11.0026 4.74763 9.98294 6.08002 9.1733C6.51318 8.90995 6.96128 8.67199 7.42205 8.46062C6.63036 9.47605 6.20198 10.7276 6.20537 12.0152C6.20877 13.3027 6.64374 14.552 7.44077 15.5632C6.9659 15.3466 6.50463 15.1014 6.0595 14.8288C4.73921 14.0214 3.60362 13.0016 2.88996 12.0008L2.89003 12.0009ZM17.92 14.8268C17.4545 15.11 16.9716 15.3637 16.4744 15.5865C17.2895 14.5636 17.7319 13.2935 17.7286 11.9855C17.7253 10.6774 17.2765 9.40957 16.4561 8.39078C16.9674 8.61836 17.4632 8.87905 17.9406 9.17119C19.2608 9.9786 20.3964 10.9985 21.11 11.9993C20.3952 12.9975 19.2524 14.0171 17.92 14.8267L17.92 14.8268ZM14.3503 10.8757C14.3046 11.072 14.2084 11.253 14.0713 11.4008C13.9341 11.5485 13.7608 11.6579 13.5683 11.718C13.3759 11.7782 13.1712 11.787 12.9743 11.7437C12.7774 11.7004 12.5952 11.6064 12.4458 11.4711C12.2964 11.3357 12.185 11.1637 12.1225 10.972C12.06 10.7804 12.0487 10.5757 12.0896 10.3783C12.1306 10.1809 12.2223 9.99763 12.3559 9.84661C12.4894 9.69559 12.6601 9.58206 12.851 9.51727C12.2773 9.31313 11.6506 9.31409 11.0775 9.52001C10.5044 9.72593 10.0204 10.1241 9.7079 10.6467C9.39535 11.1693 9.27355 11.784 9.36325 12.3863C9.45294 12.9886 9.74858 13.5412 10.1999 13.9501C10.6511 14.3589 11.2301 14.5988 11.8383 14.6288C12.4465 14.6588 13.0463 14.4771 13.5356 14.1146C14.0249 13.7522 14.3735 13.2313 14.5221 12.6408C14.6706 12.0503 14.6099 11.4265 14.3503 10.8757Z" fill="#595959"/>
                  </svg> 
                </button>
                <button onClick={() => handleDownload(doc, index)} className="p-1 rounded hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2 13.8V19.2H4.80005V13.8H1.80005V19.8C1.80005 21.1255 2.87457 22.2 4.20005 22.2H19.8C21.1255 22.2 22.2 21.1255 22.2 19.8V13.8H19.2ZM15.6 10.8V3.59999C15.6 3.1226 15.4104 2.66476 15.0728 2.3272C14.7353 1.98963 14.2774 1.79999 13.8 1.79999H10.2C9.20594 1.79999 8.40005 2.60588 8.40005 3.59999V10.8H4.80005L8.40005 14.3755L11.0606 17.0179C11.5734 17.5272 12.4267 17.5272 12.9395 17.0179L15.6 14.3755L19.2 10.8H15.6Z" fill="#595959"/>
                </svg>                
              </button>
                <button onClick={() => handleDelete(index)} className="p-1 rounded hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 3.599H15V2.99999C15 2.33725 14.4627 1.79999 13.8 1.79999H10.2C9.53721 1.79999 8.99995 2.33725 8.99995 2.99999V3.599H5.99995C5.00584 3.599 4.19995 4.40489 4.19995 5.399V6.59999H19.8V5.399C19.8 4.40489 18.9941 3.599 18 3.599ZM10.2 2.99999H13.8V3.599H10.2V2.99999ZM5.39995 7.199V22.2H18.6V7.199H5.39995ZM8.99995 9.59999V19.7967C8.99995 19.7978 8.99995 19.7989 8.99995 19.8C8.99995 20.1314 8.73132 20.4 8.39995 20.4C8.06858 20.4 7.79995 20.1314 7.79995 19.8C7.79995 19.7989 7.79995 19.7978 7.79995 19.7967V9.59999C7.79995 9.59965 7.79995 9.59934 7.79995 9.599C7.79995 9.26763 8.06858 8.999 8.39995 8.999C8.73132 8.999 8.99995 9.26763 8.99995 9.599C8.99995 9.59934 8.99995 9.59965 8.99995 9.59999ZM12.6 9.59999V19.7967C12.6 19.7978 12.6 19.7989 12.6 19.8C12.6 20.1314 12.3313 20.4 12 20.4C11.6686 20.4 11.4 20.1314 11.4 19.8C11.4 19.7989 11.4 19.7978 11.4 19.7967V9.59999C11.4 9.59965 11.4 9.59932 11.4 9.599C11.4 9.26763 11.6686 8.999 12 8.999C12.3313 8.999 12.6 9.26763 12.6 9.599C12.6 9.59932 12.6 9.59965 12.6 9.59999ZM16.2 9.59999V19.7967C16.2 19.7978 16.2 19.7989 16.2 19.8C16.2 20.1314 15.9313 20.4 15.6 20.4C15.2686 20.4 15 20.1314 15 19.8C15 19.7989 15 19.7978 15 19.7967V9.59999C15 9.59965 15 9.59934 15 9.599C15 9.26763 15.2686 8.999 15.6 8.999C15.9313 8.999 16.2 9.26763 16.2 9.599C16.2 9.59934 16.2 9.59965 16.2 9.59999Z" fill="#595959"/>
                  </svg>                
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