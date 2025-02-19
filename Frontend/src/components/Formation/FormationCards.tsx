import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface FormationItem {
    id: number;
    title: string;
    status: "En cours" | "À venir" | "Terminé" | "Replanifié";
  }

interface FormationCardProps {
    formation: FormationItem;
    onEdit: (formation: FormationItem) => void;
    onDelete: (id: number) => void;
    onAccess: (formation: FormationItem) => void;
  }
  
  const FormationCard = ({ formation, onEdit, onDelete, onAccess }: FormationCardProps) => {
    const getStatusClass = () => {
      switch (formation.status) {
        case "En cours":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "À venir":
          return "bg-[#F2E7FF] text-[#7F36F6]";
        case "Terminé":
          return "bg-[#FFF4EB] text-[#FF7900]";
        case "Replanifié":
          return "bg-[#F5F5F5] text-[#B0B0B0]"; 
        default:
          return "";
      }
    };
  
    return (
      <Card className="overflow-hidden shadow-md border rounded-none bg-white">
        <div className="relative">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <img src="/placeholder.svg" alt="Formation" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`px-1 py-0.5 rounded-full ${getStatusClass()}`}>
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
  