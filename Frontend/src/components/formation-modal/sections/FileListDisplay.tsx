import * as React from "react";
import { Eye, Download, Trash2, FileText, CheckCircle } from "lucide-react";
import { UploadedFile } from "../types";

interface FileListDisplayProps {
  fileList: File[];
  onRemoveFile: (index: number) => void;
  uploadedFiles?: UploadedFile[]; // Add this prop to handle files fetched from backend
  onRemoveUploadedFile?: (id: string) => void; // Optional callback to delete backend files
}

const FileListDisplay: React.FC<FileListDisplayProps> = ({
  fileList,
  onRemoveFile,
  uploadedFiles = [], // Default to empty array
  onRemoveUploadedFile
}) => {
  // Function to handle viewing/downloading a file
  const handleViewFile = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Display files fetched from backend */}
      {uploadedFiles.map((file, index) => (
        <div key={`uploaded-${index}`} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-gray-600">
                <FileText size={24} />
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {file.name}
                  {file.status === 'uploaded' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : 'Téléchargé depuis le serveur'}
                </div>
                {file.uploadId && (
                  <div className="text-xs text-gray-400 mt-1">
                    ID: {file.uploadId}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-gray-600 hover:text-gray-800"
                onClick={() => file.url && handleViewFile(file.url)}
              >
                <Eye size={20} />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-gray-800"
                onClick={() => file.url && handleViewFile(file.url)}
              >
                <Download size={20} />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-red-600"
                onClick={() => onRemoveUploadedFile && file.uploadId && onRemoveUploadedFile(file.uploadId)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Display files from local selection */}
      {fileList.map((file, index) => (
        <div key={`local-${index}`} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
              </div>
              <div>
                <div className="font-medium">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Eye size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                <Download size={20} />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-red-600"
                onClick={() => onRemoveFile(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Show a message if no files are displayed */}
      {fileList.length === 0 && uploadedFiles.length === 0 && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun fichier à afficher</p>
        </div>
      )}
    </div>
  );
};

export default FileListDisplay;