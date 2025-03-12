import * as React from "react";
import { useState, useEffect } from "react";

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
  
  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedDate = localStorage.getItem(`formation_${formation.id}_lastUpdate_termine`);
    return savedDate || formatDateTime(new Date());
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [statsMetrics, setStatsMetrics] = useState<StatMetric[]>([]);
  const [statsCards, setStatsCards] = useState({
    totalBeneficiaires: 0,
    totalFormations: 0,
    prochainEvenement: "0",
    satisfactionMoyenne: "0%"
  });
  // Format date and time for display
  function formatDateTime(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} à ${hours}H${minutes}`;
  }

  // Initial data load
  useEffect(() => {
    loadFormationData();
  }, [formation.id]);

  const loadFormationData = async () => {
    // Simulate API call or data fetch delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data that would come from your API
    setDocuments([
      { title: "Programme du formation", date: "25/02/2025" },
      { title: "Présentation Jour 01", date: "25/02/2025" },
      { title: "Exercices Pratiques", date: "25/02/2025" },
    ]);
    
    setParticipants([
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
      // In real implementation, you'd get all participants from API
    ]);
    
    setStatsMetrics([
      { label: "Taux de completion", value: "85%" },
      { label: "Taux Satisfaction", value: "85%" },
      { label: "Heures", value: "75%" },
    ]);
    
    setStatsCards({
      totalBeneficiaires: 250,
      totalFormations: 64,
      prochainEvenement: "07",
      satisfactionMoyenne: "95%"
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Reload all data
      await loadFormationData();
      
      // Update timestamp
      const now = new Date();
      const formattedDate = formatDateTime(now);
      setLastUpdated(formattedDate);
      
      // Store in localStorage for persistence
      localStorage.setItem(`formation_${formation.id}_lastUpdate_termine`, formattedDate);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des données:", error);
      // Add error handling/notification here if needed
    } finally {
      setIsRefreshing(false);
    }
  };
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
              Données actualisées le {lastUpdated}
            </span>
            <button 
              className="flex items-center gap-1 text-black font-medium text-sm ml-1"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw 
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} 
              />
              {isRefreshing ? "Actualisation..." : "Actualiser"}
            </button>
          </div>
        </div>
        <CourseHeader
          title="Formation"
          subtitle={formation.title}
          status="Terminé"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Bénéficiaires" value={isRefreshing ? "..." : statsCards.totalBeneficiaires} />
          <StatsCard title="Total Formations" value={isRefreshing ? "..." : statsCards.totalFormations} />
          <StatsCard title="Prochain événement" value={isRefreshing ? "..." : statsCards.prochainEvenement} />
          <StatsCard title="Satisfaction moyenne" value={isRefreshing ? "..." : statsCards.satisfactionMoyenne} />
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
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
};

export default FormationTerminer;