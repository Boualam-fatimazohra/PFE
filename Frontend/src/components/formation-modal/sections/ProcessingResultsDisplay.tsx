// src/components/formation-modal/sections/ProcessingResultsDisplay.tsx
import * as React from "react";
import { Loader2 } from "lucide-react";
import { ProcessingResults } from "../types";

interface ProcessingResultsDisplayProps {
  loading: boolean;
  processingResults: ProcessingResults | null;
}

const ProcessingResultsDisplay: React.FC<ProcessingResultsDisplayProps> = ({
  loading,
  processingResults
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 size={24} className="text-purple-600 animate-spin mb-2" />
        <div className="text-purple-600 font-medium">AI Loading...</div>
      </div>
    );
  }

  if (!processingResults) {
    return null;
  }

  return (
    <div className="w-full border border-purple-300 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Résultat AI</h3>
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Numéros éligibles", value: processingResults.eligiblePhoneNumbers },
          { label: "Total des inscrits", value: processingResults.totalContacts },
          { label: "Total bénéficiaires", value: processingResults.totalBeneficiaries },
          { label: "Total inscription", value: processingResults.totalBeneficiaries },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow-md border rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingResultsDisplay;