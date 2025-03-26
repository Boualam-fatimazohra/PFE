// src/components/formation-modal/form-steps/FormStepTwo.tsx
import * as React from 'react';
import { useEffect, useState } from "react";
import FileListDisplay from "../sections/FileListDisplay";
import ParticipantFileUpload from "../sections/ParticipantFileUpload";
import ProcessingResultsDisplay from "../sections/ProcessingResultsDisplay";
import { ProcessingResults, Message, UploadedFile } from "../types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert components if available
import { getFormationFiles, uploadBeneficiaireFile } from '@/services/beneficiaireFileUploadService';
import EnhanceListButton from '@/components/dashboardElement/EnhanceListButton';

interface FormStepTwoProps {
  fileList: File[];
  setFileList: React.Dispatch<React.SetStateAction<File[]>>;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>; 
  hasPendingFiles: boolean;
  setHasPendingFiles: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  processingResults: ProcessingResults | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setProcessingResults: React.Dispatch<React.SetStateAction<ProcessingResults | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleParticipantListButtonClick: () => void;
  handleParticipantListChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  participantListInputRef: React.RefObject<HTMLInputElement>;
  formationId?: string; // Optional formation ID if you're updating an existing formation
}

const FormStepTwo: React.FC<FormStepTwoProps> = ({
  fileList,
  setFileList,
  uploadedFiles,
  setUploadedFiles,
  hasPendingFiles,
  setHasPendingFiles,
  loading,
  processingResults,
  setMessages,
  setProcessingResults,
  setLoading,
  handleParticipantListButtonClick,
  handleParticipantListChange,
  participantListInputRef,
  formationId
}) => {
  // State for displaying validation errors
  const [fileError, setFileError] = useState<string | null>(null);
    // Fetch files when component mounts or formationId changes
    useEffect(() => {
      if (formationId) {
        fetchFormationFiles(formationId);
      }
    }, [formationId]);
  
  // Accepted file formats
  const acceptedFormats = ['.xlsx', '.xls', '.csv'];

    // Function to fetch files for a specific formation
    const fetchFormationFiles = async (id: string) => {
      try {
        setLoading(true);
        const files = await getFormationFiles(id);
        
        // Process fetched files to match your local state format
        if (files && files.length > 0) {
          // Update fileList with downloaded files
          const downloadedFiles: File[] = [];
          
          // Update uploadedFiles with file information
          const downloadedUploadedFiles: UploadedFile[] = files.map(file => ({
            name: file.originalFilename,
            data: file.cloudinaryUrl, // Use URL directly instead of data URI
            type: 'participant-list',
            status: 'uploaded',
            uploadId: file._id,
            url: file.cloudinaryUrl,
            uploadDate: file.createdAt
          }));
          
          setUploadedFiles(prev => [...prev, ...downloadedUploadedFiles]);
        
          console.log("Fetching Files Uploaded Successfuly")
        } else {
          // message when no files found
          console.log("Fetching Files empty cloudinary for this formation");
        }
      } catch (error) {
        console.error('Error fetching formation files:', error);
        setFileError(`Erreur lors de la récupération des fichiers: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
  
  // Enhanced file removal function
  const handleRemoveFile = (index: number) => {
    setFileList(fileList.filter((_, i) => i !== index));
    // Clear any error messages when removing files
    setFileError(null);
  };

  // Custom file validation and handling
  const validateAndProcessFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null); // Reset errors
    
    // Check if formation ID exists - required for uploading files
    if (!formationId) {
      setFileError("Veuillez d'abord créer la formation avant d'ajouter des fichiers de bénéficiaires.");
      return;
    }
    
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      
      // Check if files are valid Excel/CSV files
      const invalidFiles = files.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return !acceptedFormats.includes(extension);
      });
      
      if (invalidFiles.length > 0) {
        setFileError(`Les fichiers suivants ne sont pas au format Excel/CSV: ${invalidFiles.map(f => f.name).join(', ')}`);
        event.target.value = ''; // Clear the input
        return;
      }
      
      // Check file sizes
      const oversizedFiles = files.filter(file => file.size > 100 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setFileError(`Les fichiers suivants dépassent la limite de 100MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
        event.target.value = ''; // Clear the input
        return;
      }
      
      // All checks passed, handle the files
      // Add all valid files to fileList
      const newFiles = [...fileList, ...files];
      setFileList(newFiles);
      
      // Process each file and upload to cloudinary
      for (const file of files) {
        try {
          // First read file for display
          const reader = new FileReader();
          
          // Create a promise to handle the file reading
          const fileDataPromise = new Promise<string>((resolve) => {
            reader.onload = (e) => {
              if (e.target && e.target.result) {
                resolve(e.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          });
          
          const fileData = await fileDataPromise;
          
          // Add to uploadedFiles with pending status
          setUploadedFiles(prev => [...prev, {
            name: file.name,
            data: fileData,
            type: 'participant-list',
            status: 'uploading'
          }]);
          
          // Upload the file to Cloudinary through our backend
          setLoading(true);
          const uploadResult = await uploadBeneficiaireFile(
            formationId,
            file
          );

          setFileList(prevList => prevList.filter(f => f.name !== file.name));
          
          // Update the file status based on upload result
          setUploadedFiles(prev => 
            prev.map(uploadedFile => 
              uploadedFile.name === file.name 
                ? { 
                    ...uploadedFile, 
                    status: 'uploaded',
                    uploadId: uploadResult.id,
                    url: uploadResult.url,
                    uploadDate: uploadResult.uploadDate
                  } 
                : uploadedFile
            )
          );
          
          console.log(`File ${file.name} uploaded successfully with ID: ${uploadResult.id}`);
          
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          setFileError(`Erreur lors du téléchargement de ${file.name}: ${error.message || 'Unknown error'}`);
          
          // Update the file status to error
          setUploadedFiles(prev => 
            prev.map(uploadedFile => 
              uploadedFile.name === file.name 
                ? { ...uploadedFile, status: 'error' } 
                : uploadedFile
            )
          );
        } finally {
          setLoading(false);
          if (files.length > 0) {
            setHasPendingFiles(true);
            // rest of your existing code...
          }
        }
      }
    }
    
    if (event.target) {
      event.target.value = ''; // Clear the input to allow selecting the same file again
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Listes des Participants
            {formationId && <span className="text-sm text-gray-500 ml-2">(Formation ID: {formationId})</span>}
          </h2>
          <EnhanceListButton 
          fileList={uploadedFiles}
          setMessages={setMessages}
          setProcessingResults={setProcessingResults}
          setLoading={setLoading}
        />
        </div>

        {fileError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Erreur de validation</AlertTitle>
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

{(fileList.length > 0 || uploadedFiles.length > 0) && (
  <FileListDisplay 
    fileList={fileList}
    onRemoveFile={handleRemoveFile}
    uploadedFiles={uploadedFiles}
    onRemoveUploadedFile={(id) => {
      // Implement this function to delete files from the backend
      // You'll need to add a deleteFile function from your service
      console.log(`Delete file with ID: ${id}`);
      // Example implementation:
      // deleteFile(id)
      //   .then(() => {
      //     setUploadedFiles(prev => prev.filter(file => file.uploadId !== id));
      //   })
      //   .catch(error => {
      //     console.error(`Error deleting file: ${error}`);
      //     setFileError(`Erreur lors de la suppression du fichier: ${error.message}`);
      //   });
    }}
  />
)}

        {/* Always display the file upload component, regardless of whether files exist */}
        <ParticipantFileUpload
          handleParticipantListButtonClick={handleParticipantListButtonClick}
          // Replace the original handler with our enhanced version
          handleParticipantListChange={validateAndProcessFiles}
          participantListInputRef={participantListInputRef}
          acceptedFormats={acceptedFormats}
        />

        <ProcessingResultsDisplay
          loading={loading}
          processingResults={processingResults}
        />
      </div>
    </div>
  );
};

export default FormStepTwo;