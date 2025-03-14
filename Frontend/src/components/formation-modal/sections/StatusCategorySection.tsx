// src/components/formation-modal/sections/StatusCategorySection.tsx
import * as React from "react";
import { FormState, FormOption } from "../types";

interface StatusCategorySectionProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
  statusOptions: FormOption[];
  categoryOptions: FormOption[];
  levelOptions: FormOption[];
}

const StatusCategorySection: React.FC<StatusCategorySectionProps> = ({
  formState,
  setFormState,
  errors,
  statusOptions,
  categoryOptions,
  levelOptions
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.status}
          onChange={(e) => setFormState({ ...formState, status: e.target.value as "En Cours" | "Terminé" | "Avenir" | "Replanifier" })}
          className={`rounded-none w-full p-2.5 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        >
          <option value="">Sélectionnez un status</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Catégorie <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.category}
          onChange={(e) => setFormState({ ...formState, category: e.target.value })}
          className={`rounded-none w-full p-2.5 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        >
          <option value="">Sélectionnez une catégorie</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          Niveau <span className="text-red-500">*</span>
        </label>
        <select
          value={formState.level}
          onChange={(e) => setFormState({ ...formState, level: e.target.value })}
          className={`rounded-none w-full p-2.5 border ${errors.level ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        >
          <option value="">Sélectionnez un niveau</option>
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
      </div>
    </div>
  );
};

export default StatusCategorySection;