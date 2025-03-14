// src/components/formation-modal/StepIndicator.tsx
import * as React from "react";
import { Step } from "./types";

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-between w-full mb-8 max-w-10xl mx-auto relative gap-x-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative flex-1">
          {/* Trait de connexion entre les cercles */}
          {index > 0 && (
            <div className={`font-bold font-inter absolute h-px -left-1/2 right-1/2 top-5 -z-10 ${
              steps[index - 1].completed ? "bg-black" : "bg-gray-200"
            }`}></div>
          )}
          {/* Cercle du step */}
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full 
              ${step.active ? "bg-white border-4 border-orange-400" : 
                step.completed ? "bg-white border-2 border-black text-black" : 
                "bg-white border-2 border-gray-300 text-gray-500"} 
              text-lg font-medium mb-2 z-10`}
          >
            {step.number}
          </div>
          {/* Label */}
          <span className={`text-sm font-medium ${step.active ? "text-gray-900" : "text-gray-500"}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;