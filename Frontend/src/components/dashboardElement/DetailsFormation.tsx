import * as React from "react";
import { useState, useEffect } from "react";
import { RefreshCw, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseHeader from "../Formation/CoursHeader";
import DocumentsSection from "../Formation/DocumentsSection";
import StatsSection from "../Formation/StatsSection";
import ParticipantsSection from "../Formation/ParticipantsSection";
import { CustomPagination } from "../layout/CustomPagination";
import { FormationItem, Document, StatMetric } from "@/pages/types"; 
import { getBeneficiairesWithPresence, updateReglementStatus } from "../../services/beneficiaireService";
import { BeneficiaireWithPresenceResponse } from "../formation-modal/types";
import ReglementInterieurModal from "../Formation/ReglementInterieurModal";
import { toast } from "react-toastify";

interface DetailsFormationProps {
  formation: FormationItem;
  onRetourClick: () => void; 
}

const DetailsFormation: React.FC<DetailsFormationProps> = ({ formation, onRetourClick }) => {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [participantsPage, setParticipantsPage] = useState(1);
  const PARTICIPANTS_PER_PAGE = 11;
  const [lastUpdated, setLastUpdated] = useState(() => {
    const savedDate = localStorage.getItem(`formation_${formation.id}_lastUpdate`);
    return savedDate || formatDateTime(new Date());
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [participants, setParticipants] = useState<BeneficiaireWithPresenceResponse[]>([]);
  const [statsMetrics, setStatsMetrics] = useState<StatMetric[]>([
    { label: "Taux de completion", value: null },
    { label: "Taux Satisfaction", value: null },
    { label: "Heures", value: null },
  ]);
  
  // Règlement intérieur modal state
  const [isReglementModalOpen, setIsReglementModalOpen] = useState(false);
 
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
    setIsLoading(true);
    
    try {
      // Load documents (replace with your actual document loading)
      setDocuments([
        { title: "Programme du formation", date: "25/02/2025" },
        { title: "Présentation Jour 01", date: "25/02/2025" },
        { title: "Exercices Pratiques", date: "25/02/2025" },
      ]);
      
      // Fetch participants from the API
      const beneficiairesData = await getBeneficiairesWithPresence(formation.id);      
      setParticipants(beneficiairesData);
      console.log("detail formation page : ", beneficiairesData);
      
      // Keep original stats structure
      setStatsMetrics([
        { label: "Taux de completion", value: null },
        { label: "Taux Satisfaction", value: null },
        { label: "Heures", value: null },
      ]);
      
    } catch (error) {
      console.error("Error loading formation data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Reload data
      await loadFormationData();
      
      // Update timestamp
      const now = new Date();
      const formattedDate = formatDateTime(now);
      setLastUpdated(formattedDate);
      
      // Store in localStorage for persistence
      localStorage.setItem(`formation_${formation.id}_lastUpdate`, formattedDate);
    } catch (error) {
      console.error("Erreur lors de l'actualisation des données:", error);
      toast.error("Erreur lors de l'actualisation des données");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open the règlement intérieur modal
  const openReglementModal = () => {
    setIsReglementModalOpen(true);
  };

  // Handle règlement confirmation - updated to match the backend API
  const handleConfirmReglement = async (participantIds: string[], action: "confirm" | "decline") => {
    try {
      // Prepare the data for the API call in the format expected by the backend
      const beneficiairesList = participantIds.map(id => ({
        id,
        confirmationReglementInterieur: action === "confirm"
      }));
      
      // Call the API to update the règlement status
      await updateReglementStatus(beneficiairesList);
      
      // Update the local state to reflect the changes
      setParticipants(prev => 
        prev.map(participant => {
          if (participantIds.includes(participant.beneficiaireFormationId)) {
            return {
              ...participant,
              confirmationReglementInterieur: action === "confirm"
            };
          }
          return participant;
        })
      );
      
      // Show success message
      toast.success(`Statut de règlement intérieur mis à jour avec succès`);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating règlement status:", error);
      toast.error("Erreur lors de la mise à jour du statut de règlement");
      return Promise.reject(error);
    }
  };

  const totalParticipantsPages = Math.ceil(participants.length / PARTICIPANTS_PER_PAGE);

  // Helper function to convert boolean to status string
  const getReglementStatus = (status: boolean | undefined | null): "confirmed" | "declined" | "pending" => {
    if (status === true) return "confirmed";
    if (status === false) return "declined";
    return "pending";
  };

  // Make sure you're correctly mapping the boolean value to the status string
  const participantsWithStatusString = participants.map(participant => ({
    ...participant,
    reglementStatus: participant.confirmationReglementInterieur === true ? "confirmed" : 
                    participant.confirmationReglementInterieur === false ? "declined" : 
                    "pending"
  }));

  return (
    <div className="bg-white min-h-screen p-1 font-inter">
      <main>
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          {/* Bouton Retour */}
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
              className="flex items-center gap-1 text-black font-medium text-bold text-sm ml-1"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw 
                size={16} 
                className={isRefreshing ? "animate-spin" : ""} 
              />
              {isRefreshing ? "Actualisation..." : "Actualiser"}
            </button>
          </div>
        </div>

        {/* Course Header Component */}
        <CourseHeader
          title="Formation"
          subtitle={formation.title}
          status={formation.status}
        />

        {/* Statistics Cards - Add Règlement Intérieur button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Vue d'ensemble</h2>
          <Button 
            variant="outline" 
            onClick={openReglementModal}
            className="border-[#FF7900] text-[#FF7900] hover:bg-orange-50"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Règlement Intérieur
          </Button>
        </div>

        {/* Documents and Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DocumentsSection documents={documents} />
          <StatsSection metrics={statsMetrics} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw size={24} className="animate-spin" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        ) : (
          <>
            <ParticipantsSection
              participants={participants}
              currentPage={1}
              formation={formation} 
            />
          </>
        )}
        
        {/* Utilisation de CustomPagination pour naviguer entre les pages de participants */}
        {totalParticipantsPages > 1 && (
          <CustomPagination
            currentPage={participantsPage}
            totalPages={totalParticipantsPages}
            onPageChange={setParticipantsPage}
          />
        )}
        
        {/* Règlement Intérieur Modal */}
        <ReglementInterieurModal
          isOpen={isReglementModalOpen}
          onClose={() => setIsReglementModalOpen(false)}
          participants={participantsWithStatusString}
          formation={formation}
          onConfirmReglement={handleConfirmReglement}
        />
      </main>
    </div>
  );
};

export default DetailsFormation;