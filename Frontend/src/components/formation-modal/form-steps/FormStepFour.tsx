// src/components/formation-modal/form-steps/FormStepFour.tsx
import * as React from "react";

const FormStepFour: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">AWS : Développement, déploiement et gestion</h2>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total Formations</div>
                <div className="text-2xl font-bold">41</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total Formations</div>
                <div className="text-2xl font-bold">25</div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-full w-12 h-12"></div>
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStepFour;