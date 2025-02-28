import * as React from "react";

type StatusType = "En Cours" | "Terminer" | "A venir";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  status: StatusType;
} 

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, subtitle, status }) => {
  // Définir les styles en fonction du statut
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900] px-2 py-0.5 rounded-full"; // Orange pour en cours
      case "Terminer":
        return "bg-[#E5F7ED] text-[#00C31F] px-2 py-0.5 rounded-full"; // Vert pour terminé
      case "A venir":
        return "bg-[#F2E7FF] text-[#7F36F6] px-2 py-0.5 rounded-full "; // Mauve pour à venir
      default:
        return "bg-[#FFF4EB] text-[#FF7900] px-2 py-0.5 rounded-full"; // Par défaut orange
    }
  };

  // Formatter le texte d'affichage du statut
  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case "En Cours":
        return "En cours";
      case "Terminer":
        return "Terminer";
      case "A venir":
        return "À venir";
      default:
        return "En cours";
    }
  };

  const statusClassName = getStatusStyles(status);
  const statusLabel = getStatusLabel(status);

  return (
    <div className="bg-[#F4F4F4] py-3 px-4 mb-4 relative font-inter">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500" />
        <div className="ml-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">Formation</h1>
            <span className={`px-3 py-1 ${statusClassName}  text-sm `}>
          {statusLabel}
        </span>
          </div>
          <h2 className="text-xl text-[#666666] font-inter">
        {subtitle}
      </h2>
        </div>
      </div>




  );
};

export default CourseHeader;