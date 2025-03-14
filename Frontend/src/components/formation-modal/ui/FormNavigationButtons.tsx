// src/components/formation-modal/ui/FormNavigationButtons.tsx
import * as React from "react";

interface FormNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  handleSubmitDraft: () => void;
  isSubmitting: boolean;
}

const FormNavigationButtons: React.FC<FormNavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  handleNext,
  handleSubmit,
  handleSubmitDraft,
  isSubmitting
}) => {
  return (
    <div className="flex justify-end mt-6 gap-4">
      {currentStep > 1 && (
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
        <button
          type="button"
          onClick={handleNext}
          className="rounded-none px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          disabled={isSubmitting}
        >
          Suivant
        </button>
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