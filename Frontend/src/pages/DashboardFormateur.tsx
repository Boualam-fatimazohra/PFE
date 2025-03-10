import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { FormationsTable, FormationTableItem } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import { Plus, Search, X } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { EvaluationsTable } from "@/components/dashboardElement/EvaluationTable";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { useFormations } from "@/contexts/FormationContext";
import DetailsFormation from "@/components/dashboardElement/DetailsFormation";
import { FormationAvenir } from "@/pages/FormationAvenir";
import FormationTerminer from "@/pages/FormationTerminer";
import { useEvenementsAssocies } from '../contexts/FormateurContext';
import { FormationItem, FormationStatus } from "@/pages/types"; 

const DashboardFormateur: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFormation, setSelectedFormation] = useState<FormationItem | null>(null);
  const { formations, searchFormations, filteredFormations, nombreBeneficiaires } = useFormations();
  const [formationCount, setFormationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { stats, isLoadingEvenements, error } = useEvenementsAssocies();

  useEffect(() => {
    if (formations) {
      setFormationCount(formations.length);
      setIsLoading(false);
    }
  }, [formations]);

  // Écoutez l'événement personnalisé depuis DashboardHeader
  useEffect(() => {
    const handleChatbotToggle = (event: CustomEvent) => {
      setIsChatbotOpen(event.detail.isOpen);
    };

    window.addEventListener('chatbotToggled', handleChatbotToggle as EventListener);

    return () => {
      window.removeEventListener('chatbotToggled', handleChatbotToggle as EventListener);
    };
  }, []);

  const handleShowDetails = (formation: FormationItem) => {
    setSelectedFormation(formation);
  };

  const handleRetourClick = () => {
    setSelectedFormation(null);
  };

  const renderDetails = () => {
    if (!selectedFormation) return null;

    switch (selectedFormation.status) {
      case "En Cours":
        return <DetailsFormation formation={selectedFormation} onRetourClick={handleRetourClick} />;
      case "Avenir":
        return <FormationAvenir formation={selectedFormation} onRetourClick={handleRetourClick} />;
      case "Terminé":
        return <FormationTerminer formation={selectedFormation} onRetourClick={handleRetourClick} />;
      default:
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Statut inconnu</h2>
            <button 
              className="bg-black text-white px-4 py-2 rounded-none"
              onClick={handleRetourClick}
            >
              Retour
            </button>
          </div>
        );
    }
  };

  const mappedFormations: FormationTableItem[] = filteredFormations.map((formation) => ({
    _id: formation._id, 
    nom: formation.nom, 
    title: formation.nom, 
    dateDebut: formation.dateDebut,
    dateFin: formation.dateFin,
    status:  formation.status,
    image: formation.image,
  }));

  // Définir la classe de transition pour le contenu principal
  const mainContentClass = isChatbotOpen ? 'transform -translate-x-1/4 w-[3300px]' : 'w-full';

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <ToastContainer />
      
      <main className={`flex-grow ${selectedFormation ? 'bg-white' : 'bg-gray-50'}`}>
        <div className={`transition-all duration-300 ease-in-out ${mainContentClass}`}>
          <div className="container mx-auto px-4 py-8">
            {selectedFormation ? (
              renderDetails()
            ) : (
              <>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
                  <div className="flex gap-4">
                    <div className="relative">
                      <SearchBar 
                        onSearch={(value) => {
                          setSearchTerm(value);
                          searchFormations(value);
                          setIsSearching(value.trim().length > 0);
                        }} 
                        placeholder="Rechercher des formations..."
                      />
                      {isSearching && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            searchFormations("");
                            setIsSearching(false);
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <button 
                      onClick={() => navigate("/formateur/formationModal")}
                      className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Créer une formation</span>
                    </button>
                  </div>
                </div>
    
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatsCard title="Total Bénéficiaires" value={isLoading ? '...' : nombreBeneficiaires} />
                  <StatsCard title="Total Formations" 
                      value={isLoading ? '...' : formationCount} 
                  />
                  <StatsCard title="Prochain événement" value={isLoadingEvenements ?'...':stats?.total ?? 0} />
                  <StatsCard title="Satisfaction moyenne" value="95%" />
                </div>
    
                {/* Formations and Evaluations Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Formations Card */}
                  <Card className="border-[#999999] rounded-[4px]">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold font-inter">Mes Formations</h2>
                        <button 
                          className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                          onClick={() => navigate("/formateur/mesformation")}
                        >
                          Découvrir
                        </button>
                      </div>
                      {isSearching && filteredFormations?.length === 0 ? (
                        <div className="py-10 text-center text-gray-500">
                          Aucune formation ne correspond à votre recherche
                        </div>
                      ) : (
                        <FormationsTable 
                          formations={isSearching ? mappedFormations : undefined}
                          onShowDetails={handleShowDetails}
                        />              
                      )}
                    </CardContent>
                  </Card>

                  {/* Évaluations et Rapport section */}
                  <div className="flex flex-col space-y-6">
                    {/* Evaluations Card */}
                    <Card className="border-[#999999] rounded-[4px]">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold font-inter">Évaluations</h2>
                          <button 
                            className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                            onClick={() => navigate("/FormulaireEvaluation")}
                          >
                            Découvrir
                          </button>
                        </div>
                        <EvaluationsTable />
                      </CardContent>
                    </Card>
                    
                    {/* Rapport Card comme composant séparé */}
                    <RapportCard />
                  </div>
                </div>
    
                {/* Kit Formateur Section */}
                <KitFormateur />
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
export default DashboardFormateur;