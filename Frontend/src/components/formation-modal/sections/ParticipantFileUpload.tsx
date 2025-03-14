// src/components/formation-modal/sections/ParticipantFileUpload.tsx
import * as React from "react";

interface ParticipantFileUploadProps {
  handleParticipantListButtonClick: () => void;
  participantListInputRef: React.RefObject<HTMLInputElement>;
  handleParticipantListChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParticipantFileUpload: React.FC<ParticipantFileUploadProps> = ({
  handleParticipantListButtonClick,
  participantListInputRef,
  handleParticipantListChange
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
          </svg>
        </div>
        <p className="text-sm text-gray-500 mb-1">Maximum file size: 100 MB, liste Excel ou fichier CSV</p>
        <button
          onClick={handleParticipantListButtonClick}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Select a file
        </button>
        <input
          type="file"
          ref={participantListInputRef}
          className="hidden"
          onChange={handleParticipantListChange}
          accept=".xlsx,.xls,.csv,.pdf"
        />
      </div>
    </div>
  );
};

export default ParticipantFileUpload;