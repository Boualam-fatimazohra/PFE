import * as React from "react";
import { RefreshCw } from "lucide-react";
import CourseHeader from "../components/Formation/CoursHeader";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import DocumentsSection from "../components/Formation/DocumentsSection";
import StatsSection from "../components/Formation/StatsSection";
import ParticipantsSection from "../components/Formation/ParticipantsSection";
import { CustomPagination } from "../components/layout/CustomPagination";
import { FormationItem, Participant, Document, StatMetric } from "./types"; // Import standardized types

interface FormationTerminerProps {
  formation: FormationItem;
  onRetourClick: () => void;
}

const FormationTerminer: React.FC<FormationTerminerProps> = ({ formation, onRetourClick }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 11;

  const documents: Document[] = [
    { title: "Programme du formation", date: "25/02/2025" },
    { title: "Présentation Jour 01", date: "25/02/2025" },
    { title: "Exercices Pratiques", date: "25/02/2025" },
  ];

  const participants: Participant[] = [
    {
      date: "26/05/2024",
      time: "14h00-16h00",
      lastName: "Bikarrane",
      firstName: "Mohamed",
      email: "mohamed.bika@gmail.com",
      gender: "Homme",
      phone: "06445454512",
      status: "present",
    },
  ];

  const statsMetrics: StatMetric[] = [
    { label: "Taux de completion", value: "85%" },
    { label: "Taux Satisfaction", value: "85%" },
    { label: "Heures", value: "75%" },
  ];

  const totalPages = Math.ceil(participants.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <main>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"
            onClick={onRetourClick}
          >
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6665 4.65625L5.21143 10L10.6665 15.3437L12.2251 13.8177L8.32784 10L12.2251 6.1838L10.6665 4.65625Z" fill="#F16E00"/>
            </svg>
            <span className="text-lg font-bold text-[#000000]"> Retour</span>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#595959]">
              Données actualisées le 20/10/2025 à 8H02
            </span>
            <button className="flex items-center gap-1 text-black font-medium text-sm ml-1">
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
          </div>
        </div>
        <CourseHeader 
          title="Formation" 
          subtitle={formation.title} 
          status="Terminé"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Bénéficiaires" value={250} />
          <StatsCard title="Total Formations" value={64} />
          <StatsCard title="Prochain événement" value="07" />
          <StatsCard title="Satisfaction moyenne" value="95%" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DocumentsSection documents={documents} />
          <StatsSection metrics={statsMetrics} />
        </div>

        <ParticipantsSection 
          participants={participants}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default FormationTerminer;