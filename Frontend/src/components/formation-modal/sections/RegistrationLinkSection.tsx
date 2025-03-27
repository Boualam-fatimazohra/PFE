// src/components/formation-modal/sections/RegistrationLinkSection.tsx
import * as React from "react";
import { FormState } from "../types";

interface RegistrationLinkSectionProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}

const RegistrationLinkSection: React.FC<RegistrationLinkSectionProps> = ({
  formState,
  setFormState,
  errors
}) => {
  const handleCreateLink = () => {
    // Ouvre Google Forms dans un nouvel onglet
    window.open('https://docs.google.com/forms', '_blank');
  };

  return (
    <div className="rounded-none bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Lien d'inscription</h2>
        <button 
          type="button"
          onClick={handleCreateLink}
          className="bg-black text-white px-6 py-2 text-sm w-32 hover:bg-gray-800 transition-colors"
        >
          Créer un lien
        </button>
      </div>
      <label className="block text-sm font-bold text-black mb-1">
        Insérer Lien <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-2">
        <input
          type="url"
          value={formState.registrationLink}
          onChange={(e) => setFormState({ ...formState, registrationLink: e.target.value })}
          className="rounded-none flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="https://"
          pattern="https://.*"
          required
        />
      </div>
      {errors.registrationLink && (
        <p className="mt-1 text-sm text-red-500">{errors.registrationLink}</p>
      )}
    </div>
  );
};

export default RegistrationLinkSection;