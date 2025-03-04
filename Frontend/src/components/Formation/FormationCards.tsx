import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

import test from '@/assets/images/test.jpg';

interface FormationItem {
    id: string;
    title: string;
    status: "En Cours" | "Terminé" | "Avenir" | "Replanifier";
    image?: string; 
}

interface FormationCardProps {
    formation: FormationItem;
    onEdit: (formation: FormationItem) => void;
    onDelete: (id: string) => void;
    onAccess: (formation: FormationItem) => void;
}
  
const FormationCard = ({ formation, onEdit, onDelete, onAccess }: FormationCardProps) => {
  const getStatusClass = () => {
    switch (formation.status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900]";
      case "Avenir":
        return "bg-[#F2E7FF] text-[#9C00C3]";
      case "Terminé":
        return "bg-[#E6F7EA] text-[#00C31F]";
      case "Replanifier":
        return "bg-[#F5F5F5] text-[#4D4D4D]"; 
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden shadow-md border rounded-none bg-white">
      <div className="relative">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {/* Use formation image if available, otherwise fallback to test image */}
          <img 
            src={formation.image || test} 
            alt={formation.title}
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = test;
            }}
          />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full ${getStatusClass()}`}>
            {formation.status}
          </div>
          <div className="flex space-x-3">
            <Trash2
              className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition"
              onClick={() => onDelete(formation.id)}
            />

            <Edit
              className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition"
              onClick={() => onEdit(formation)}
            />
          </div>
        </div>
        <h3 className="font-semibold text-base mb-2">{formation.title}</h3>
        <p className="text-sm text-gray-500 mb-5">
          Explorez les fondamentaux de la conception d'interfaces...
        </p>
        <div className="flex justify-between items-center">
          <Button
            variant="orange"
            size="sm"
            className="rounded-none"
            onClick={() => onAccess(formation)}
          >
            Accéder →
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FormationCard;