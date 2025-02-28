import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { FormationsTable, FormationTableItem } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import { FormationProvider } from "@/contexts/FormationContext";
import { Plus } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { EvaluationsTable } from "@/components/dashboardElement/EvaluationTable";
import { SearchBar } from "@/components/dashboardElement/SearchBar";

interface GenerateEvaluationLinkResponse {
  evaluationLink: string;
}



const DashboardFormateur: React.FC = () => {
  const navigate = useNavigate();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Listen for chatbot state changes from the header component
  useEffect(() => {
    const handleChatbotToggle = (event: CustomEvent) => {
      if (event.detail) {
        setIsChatbotOpen(event.detail.isOpen);
      }
    };

    window.addEventListener('chatbotToggled', handleChatbotToggle as EventListener);
    
    return () => {
      window.removeEventListener('chatbotToggled', handleChatbotToggle as EventListener);
    };
  }, []);

  const generateEvaluationLink = async (courseId: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/GenerateEvaluationLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to generate evaluation link");
      }

      const { evaluationLink }: GenerateEvaluationLinkResponse = await response.json();
      await navigator.clipboard.writeText(evaluationLink);
      toast.success('Lien d\'évaluation généré et copié dans le presse-papiers');
      toast.info(`Lien d'évaluation : ${evaluationLink}`);
    } catch (error) {
      console.error("Error generating evaluation link:", error);
      toast.error('Échec de la génération du lien d\'évaluation. Veuillez réessayer.');
    }
  };

  const handleOpenModal = (): void => {
    navigate("/formationModal");
  };

  const handleSearch = (searchValue: string): void => {
    console.log(searchValue);
    // Implement search functionality here
  };

  return (
    <FormationProvider>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <ToastContainer />
        
        <main className={`flex-grow bg-gray-50 transition-all duration-300 ${isChatbotOpen ? 'translate-x-[-0rem]' : ''}`}>
          <div className={`transition-all duration-300 px-4 py-8 ${isChatbotOpen ? 'w-[calc(100%-30rem)]' : 'container mx-auto'}`}>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
              <div className="flex gap-4">
                <SearchBar onSearch={handleSearch} />
                <button 
                  onClick={handleOpenModal}
                  className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} />
                  <span>Créer une formation</span>
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard title="Total Bénéficiaires" value={250} />
              <StatsCard title="Total Formations" value={64} />
              <StatsCard title="Prochain événement" value="07" />
              <StatsCard title="Satisfaction moyenne" value="95%" />
            </div>

            {/* Formations and Evaluations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 ">
              {/* Formations Card */}
              <Card className="border-[#999999] rounded-none">
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
                  <FormationsTable />
                </CardContent>
              </Card>

              {/* Evaluations Card */}
              <Card className="border-[#999999] rounded-none">
                <CardContent className="p-6 ">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold font-inter">Évaluations</h2>
                    <button 
                      className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() => navigate("/FormulaireEvaluation")}
                    >
                      Découvrir
                    </button>
                  </div>
                  <EvaluationsTable onGenerateLink={generateEvaluationLink} />
                  <div className="mt-6">
                    <RapportCard />
                  </div>
                </CardContent>
              </Card>
              
            </div>

            {/* Kit Formateur Section */}
            <KitFormateur />
          </div>
        </main>
        
        <Footer />
      </div>
    </FormationProvider>
  );
};

export default DashboardFormateur;