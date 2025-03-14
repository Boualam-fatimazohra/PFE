// src/components/formation-modal/sections/ImageUploadSection.tsx
import * as React from "react";
import { Trash2 } from "lucide-react";
import { FormState } from "../types";

interface ImageUploadSectionProps {
  imagePreviewUrl: string | null;
  formState: FormState;
  handleImageButtonClick: () => void;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  imageInputRef: React.RefObject<HTMLInputElement>;
  errors: Record<string, string>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  imagePreviewUrl,
  formState,
  handleImageButtonClick,
  handleImageChange,
  handleRemoveImage,
  imageInputRef,
  errors
}) => {
  return (
    <div>
      <label className="block text-sm font-bold text-black mb-1">
        Image de formation <span className="text-red-500">*</span>
      </label>
      <div className="border-4 border-dashed border-gray-300 p-6 relative" style={{ borderSpacing: '10px' }}>
        {imagePreviewUrl ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 w-full max-w-sm mx-auto">
              <img 
                src={imagePreviewUrl} 
                alt="Prévisualisation" 
                className="w-full h-auto rounded object-cover max-h-60"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-700 truncate flex-1">
                  {formState.imageFormation?.name}
                </span>
                <button 
                  onClick={handleRemoveImage}
                  className="p-1 text-gray-600 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <input
              type="file"
              onChange={handleImageChange}
              accept=".jpg,.jpeg,.png"
              className="rounded-none hidden"
              ref={imageInputRef}
            />
            <button
              onClick={handleImageButtonClick}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-12 h-12 mb-4 text-black">
                <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29.75 38.25H38.25V21.25H51L34 4.25L17 21.25H29.75V38.25ZM42.5 28.6875V35.241L61.9608 42.5L34 52.9253L6.03925 42.5L25.5 35.241V28.6875L0 38.25V55.25L34 68L68 55.25V38.25L42.5 28.6875Z" fill="black"/>
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum file size: <strong>2 MB</strong>. Supported files: jpg, jpeg, png.
              </p>
              <span className="mt-3 border-2 border-black px-4 py-2 text-black font-bold text-sm">
                Select a file
              </span>
            </button>
          </div>
        )}
        {errors.imageFormation && <p className="mt-1 text-sm text-red-500">{errors.imageFormation}</p>}
      </div>
    </div>
  );
};

export default ImageUploadSection;