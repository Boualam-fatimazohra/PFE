import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { FormationsTable } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import { FormationProvider } from "@/contexts/FormationContext";
import { Plus } from "lucide-react";
import { Share2 } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { EvaluationsTable } from "@/components/dashboardElement/EvaluationTable";
import { SearchBar } from "@/components/dashboardElement/SearchBar";


// 📌 Exemple de données
const formationsData = [
  { nom: "Conception d'application mobile", dateDebut: "25/02/2025", status: "En Cours" as const },
  { nom: "Développement Web", dateDebut: "10/03/2025", status: "Terminé" as const },
  { nom: "Cybersécurité", dateDebut: "05/04/2025", status: "Replanifier" as const },
];
const DashboardFormateur = () => {
  const navigate = useNavigate();
  const generateEvaluationLink = async (courseId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/evaluation/GenerateEvaluationLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
        credentials: 'include',
      })
      if (!response.ok) throw new Error("Failed to generate evaluation link")
      const { evaluationLink } = await response.json()
      navigator.clipboard.writeText(evaluationLink)
      toast.success('Evaluation link generated and copied to clipboard')
      toast.info(`Evaluation link: ${evaluationLink}`)
    } catch (error) {
      console.error("Error generating evaluation link:", error)
      toast.error('Failed to generate evaluation link. Please try again.')
    }
  }


  const handleOpenModal = () => {
    navigate("/formationModal");
  };
  return (
    <FormationProvider>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <main className="flex-grow bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
              <div className="flex justify-between">
                <SearchBar onSearch={(value) => console.log(value)} />
                <button 
                  onClick={handleOpenModal}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} />
                  <span>Créer une formation</span>
                </button>
              </div>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard title="Total Bénéficiaires" value={250} />
              <StatsCard title="Total Formations" value={64} />
              <StatsCard title="Prochain événement" value="07" />
              <StatsCard title="Satisfaction moyenne" value="95%" />
            </div>

            {/* Mes Formations et Évaluations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Mes Formations</h2>
                        <button 
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors" 
                        onClick={() => navigate("/formateur/mesformation")}
                      >
                        Découvrir
                      </button>
                          </div>
                  <FormationsTable />
                </CardContent>
              </Card>
              {/* Évaluations */}
              <Card>
  <CardContent className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Évaluations</h2>
      <button 
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
        onClick={() => navigate("/FormulaireEvaluation")}
      >
        Découvrir
      </button>
    </div>

    <EvaluationsTable />
  </CardContent>
</Card>


{/* 
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Évaluations</h2>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors" >
                  Découvrir
                </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span>Conception d'application mobile</span>
                      <span className="text-orange-500">En Cours</span>
                      <button
                          onClick={() => generateEvaluationLink(course._id)}
                          className="w-full flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>Generate Evaluation Link</span>
                      </button>

                    </div>
                  </div>
                  <div className="mt-6">
                    <RapportCard />
                  </div>
                </CardContent>
              </Card> */}
            </div>

            {/* Kit Formateur */}
            <KitFormateur />
          </div>
        </main>
        <Footer />
      </div>
    </FormationProvider>
  );
};

export default DashboardFormateur;
