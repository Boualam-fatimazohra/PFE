import * as React from "react";

// Update the StatusType to include all possible statuses
type StatusType = "En Cours" | "Terminé" | "Avenir" | "Replanifier";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  status: StatusType;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, subtitle, status }) => {

  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case "En Cours":
        return "bg-[#FFF4EB] text-[#FF7900]"; // Orange pour en cours
      case "Terminé":
        return "bg-[#E5F7ED] text-[#00C31F]"; // Vert pour terminé
      case "Avenir":
        return "bg-[#F2E7FF] text-[#7F36F6]"; // Mauve pour à venir
      case "Replanifier":
        return "bg-[#FFF0F0] text-[#E02020]"; // Rouge pour replanifier
      default:
        return "bg-[#FFF4EB] text-[#FF7900]"; // Par défaut orange
    }
  };


  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case "En Cours":
        return "En cours";
      case "Terminé":
        return "Terminer";
      case "Avenir":
        return "À venir";
      case "Replanifier":
        return "À replanifier";
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
          <h1 className="text-xl font-bold">{title}</h1>
          <span className={`px-3 py-1 ${statusClassName} rounded-full text-sm`}>
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