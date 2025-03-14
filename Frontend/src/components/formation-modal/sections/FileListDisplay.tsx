// src/components/formation-modal/sections/FileListDisplay.tsx
import * as React from "react";
import { Eye, Download, Trash2 } from "lucide-react";

interface FileListDisplayProps {
  fileList: File[];
  onRemoveFile: (index: number) => void;
}

const FileListDisplay: React.FC<FileListDisplayProps> = ({
  fileList,
  onRemoveFile
}) => {
  return (
    <div className="space-y-4">
      {fileList.map((file, index) => (
        <div key={index} className="border rounded-lg p-4">
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
                className="p-2 text-gray-600 hover:text-gray-800"
                onClick={() => onRemoveFile(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileListDisplay;