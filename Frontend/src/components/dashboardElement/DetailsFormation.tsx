import * as React from "react";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseHeader from "../Formation/CoursHeader";
import StatisticsCards from "../Formation/StatisticsCards";
import DocumentsSection from "../Formation/DocumentsSection";
import StatsSection from "../Formation/StatsSection";
import ParticipantsSection from "../Formation/ParticipantsSection";
import { CustomPagination } from "../layout/CustomPagination";

interface DetailsFormationProps {
  onRetourClick: () => void;
}

const DetailsFormation: React.FC<DetailsFormationProps> = ({ onRetourClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const statsCards = [
    { label: "Total Bénéficiaires", value: "250" },
    { label: "Total Formations", value: "64" },
    { label: "Prochain event", value: "07" },
    { label: "Satisfaction moyenne", value: "95%" },
  ];

  const documents = [
    { title: "Programme du formation", date: "25/02/2025" },
    { title: "Présentation Jour 01", date: "25/02/2025" },
    { title: "Exercices Pratiques", date: "25/02/2025" },
  ];

  const participants = [
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
    {
      date: "26/05/2024",
      time: "14h00-16h00",
      lastName: "Bikarrane",
      firstName: "Mohamed",
      email: "mohamed.bika@gmail.com",
      gender: "Homme",
      phone: "06445454512",
      status: "absent",
    },
  ];

  const statsMetrics = [
    { label: "Taux de completion", value: null },
    { label: "Taux Satisfaction", value: null },
    { label: "Heures", value: null },
  ];

  return (
    <div className="bg-white min-h-screen p-1 font-inter ">
      <main>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          {/* Bouton Retour */}
          <button 
            className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-800 transition"
            onClick={onRetourClick}
          >
            <span className="text-lg">‹</span> Retour
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#595959]">
              Données actualisées le 20/10/2025 à 8H02
            </span>
            <button className="flex items-center gap-1 text-black font-medium text-sm ml-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
            Actualiser
          </button>
          </div>
        </div>

        {/* Course Header Component */}
        <CourseHeader 
          title="Formation" 
          subtitle="AWS : Développement, déploiement et gestion" 
          status="En Cours" 
        />

        {/* Statistics Cards Component */}
        <StatisticsCards cards={statsCards} />

        {/* Documents and Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DocumentsSection documents={documents} />
          <StatsSection metrics={statsMetrics} />
        </div>

        {/* Participants Section Component */}
        <ParticipantsSection participants={participants} />

        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </div>
  );
};

export default DetailsFormation;
