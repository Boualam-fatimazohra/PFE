// src/components/formation-modal/form-steps/FormStepTwo.tsx
import * as React from "react";
import FileListDisplay from "../sections/FileListDisplay";
import ParticipantFileUpload from "../sections/ParticipantFileUpload";
import ProcessingResultsDisplay from "../sections/ProcessingResultsDisplay";
import { ProcessingResults, Message, UploadedFile } from "../types";

interface FormStepTwoProps {
  fileList: File[];
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
  uploadedFiles: UploadedFile[];
  loading: boolean;
  processingResults: ProcessingResults | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setProcessingResults: React.Dispatch<React.SetStateAction<ProcessingResults | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleParticipantListButtonClick: () => void;
  handleParticipantListChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  participantListInputRef: React.RefObject<HTMLInputElement>;
}

const FormStepTwo: React.FC<FormStepTwoProps> = ({
  fileList,
  setFileList,
  uploadedFiles,
  loading,
  processingResults,
  setMessages,
  setProcessingResults,
  setLoading,
  handleParticipantListButtonClick,
  handleParticipantListChange,
  participantListInputRef
}) => {
  const handleRemoveFile = (index: number) => {
    setFileList(fileList.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Listes des Participants</h2>
          <button 
            className={`${
              fileList.length > 0 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
            disabled={fileList.length === 0}
          >
            Enhance List
          </button>
        </div>

        <FileListDisplay 
          fileList={fileList}
          onRemoveFile={handleRemoveFile}
        />

        {fileList.length === 0 && (
          <ParticipantFileUpload
            handleParticipantListButtonClick={handleParticipantListButtonClick}
            handleParticipantListChange={handleParticipantListChange}
            participantListInputRef={participantListInputRef}
          />
        )}

        <ProcessingResultsDisplay
          loading={loading}
          processingResults={processingResults}
        />
      </div>
    </div>
  );
};

export default FormStepTwo;