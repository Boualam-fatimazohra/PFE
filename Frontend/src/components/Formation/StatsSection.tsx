import * as React from "react";
import { Button } from "@/components/ui/button";

interface StatMetric {
  label: string;
  value: string | number | null;
}

interface StatsSectionProps {
  metrics?: StatMetric[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ 
  metrics = [
    { label: "Taux de completion", value: null },
    { label: "Taux Satisfaction", value: null },
    { label: "Heures", value: null }
  ]
}) => {
  // Fonction pour formater l'affichage des valeurs
  const formatValue = (value: string | number | null): string => {
    if (value === null) return "-";
    return value.toString();
  };

  return (
    <div className="bg-white p-6 border border-[#999]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Rapport & Statistiques</h3>
        <Button variant="orange">
          Générer Lien
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-[#F2F2F2] p-6 rounded-xl">
            <p className="text-base text-[#141414] font-medium">{metric.label}</p>
            <p className="text-[34px] font-bold mt-8">{formatValue(metric.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;