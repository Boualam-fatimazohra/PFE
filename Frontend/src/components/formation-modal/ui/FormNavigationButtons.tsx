// src/components/formation-modal/ui/FormNavigationButtons.tsx
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  handleSubmitDraft: () => void;
  isSubmitting: boolean;
  hasPendingFiles?: boolean;
  hasRegisterConfirmation?:boolean;
}

const FormNavigationButtons: React.FC<FormNavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  handleSubmit,
  handleSubmitDraft,
  isSubmitting,
  hasPendingFiles,
  hasRegisterConfirmation

}) => {
  return (
    <div className="flex justify-end mt-6 gap-4">
      {currentStep > 2 && (
        <button
          type="button"
          onClick={handleBack}
          className="rounded-none px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold"
        >
          Retour
        </button>
      )}
      
      {currentStep < totalSteps && currentStep > 1 && (
        <button
          type="button"
          onClick={handleSubmitDraft}
          className="rounded-none px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-100 font-bold"
        >
          Enregistrer en brouillon
        </button>
      )}
      
      {currentStep < totalSteps ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleNext}
                className={`px-6 py-2 ${
                  (currentStep === 2 && hasPendingFiles) || 
                  (currentStep === 3 && hasRegisterConfirmation===false)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white rounded-lg`}
                disabled={isSubmitting || (currentStep === 2 && hasPendingFiles)||
                   (currentStep === 3 && hasRegisterConfirmation===false)}
              >
                {isSubmitting ? "En cours..." : "Suivant"}
              </button>
            </TooltipTrigger>
            {currentStep === 2 && hasPendingFiles && (
              <TooltipContent>
                <p>Veuillez enregistrer vos fichiers en brouillon avant de continuer</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
      ) : (
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'En cours...' : 'Valider'}
        </button>
      )}
    </div>
  );
};

export default FormNavigationButtons;