// src/components/formation-modal/sections/TitleDescriptionSection.tsx
import * as React from "react";
import { FormState } from "../types";

interface TitleDescriptionSectionProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
}

const TitleDescriptionSection: React.FC<TitleDescriptionSectionProps> = ({
  formState,
  setFormState,
  errors
}) => {
  return (
    <>
      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Titre de la formation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => setFormState({ ...formState, title: e.target.value })}
          className={`rounded-none w-full p-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formState.description}
          onChange={(e) => setFormState({ ...formState, description: e.target.value })}
          className={`rounded-none w-full p-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg h-32`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
    </>
  );
};

export default TitleDescriptionSection;