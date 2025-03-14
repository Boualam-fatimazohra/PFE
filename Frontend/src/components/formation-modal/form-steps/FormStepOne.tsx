// src/components/formation-modal/form-steps/FormStepOne.tsx
import * as React from "react";
import { FormState, FormOption } from "../types";
import TitleDescriptionSection from "../sections/TitleDescriptionSection";
import DateSelectionSection from "../sections/DateSelectionSection";
import StatusCategorySection from "../sections/StatusCategorySection";
import ImageUploadSection from "../sections/ImageUploadSection";
import RegistrationLinkSection from "../sections/RegistrationLinkSection";

interface FormStepOneProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
  dateDebut: Date | null;
  setDateDebut: React.Dispatch<React.SetStateAction<Date | null>>;
  dateFin: Date | null;
  setDateFin: React.Dispatch<React.SetStateAction<Date | null>>;
  imagePreviewUrl: string | null;
  handleImageButtonClick: () => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  GlobalStyle: any;
  statusOptions: FormOption[];
  categoryOptions: FormOption[];
  levelOptions: FormOption[];
}

const FormStepOne: React.FC<FormStepOneProps> = ({
  formState,
  setFormState,
  errors,
  dateDebut,
  setDateDebut,
  dateFin,
  setDateFin,
  imagePreviewUrl,
  handleImageButtonClick,
  handleImageChange,
  handleRemoveImage,
  imageInputRef,
  GlobalStyle,
  statusOptions,
  categoryOptions,
  levelOptions
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Informations générales</h1>

        <TitleDescriptionSection
          formState={formState}
          setFormState={setFormState}
          errors={errors}
        />

        <DateSelectionSection
          dateDebut={dateDebut}
          setDateDebut={setDateDebut}
          dateFin={dateFin}
          setDateFin={setDateFin}
          errors={errors}
          GlobalStyle={GlobalStyle}
        />

        <StatusCategorySection
          formState={formState}
          setFormState={setFormState}
          errors={errors}
          statusOptions={statusOptions}
          categoryOptions={categoryOptions}
          levelOptions={levelOptions}
        />

        <ImageUploadSection
          imagePreviewUrl={imagePreviewUrl}
          formState={formState}
          handleImageButtonClick={handleImageButtonClick}
          handleImageChange={handleImageChange}
          handleRemoveImage={handleRemoveImage}
          imageInputRef={imageInputRef}
          errors={errors}
        />

        <RegistrationLinkSection
          formState={formState}
          setFormState={setFormState}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default FormStepOne;