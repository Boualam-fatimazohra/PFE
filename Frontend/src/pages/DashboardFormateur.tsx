import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { FormationsTable } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import GenerateLink from "@/components/dashboardElement/GenerationLien";
const DashboardFormateur  = () => {
  const formationsData = [
    { title: "Conception d'application mobile", date: "25/02/2025", status: "En Cours"  as const },
    { title: "Conception d'application mobile", date: "25/02/2025", status: "En Cours"  as const},
    { title: "Conception d'application mobile", date: "25/02/2025", status: "En Cours" as const },
    { title: "Conception d'application mobile", date: "25/02/2025", status: "En Cours" as const }

  ];
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader/>
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
            <SearchBar 
              onSearch={(value) => console.log(value)} 
              onCreate={() => alert("Create")}
            />
          </div>
          {/* Cartes statistiques   en haut de dashboard*/}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Bénéficiares" value={250}/>
            <StatsCard title="Total Formations" value={64}/>
            <StatsCard title="Prochain événement" value="07"/>
            <StatsCard title="Satisfaction moyenne" value="95%"/>
          </div>
          {/* Mes Formations et Évaluations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Mes Formations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mes Formations</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
               {/* formations */}
                <FormationsTable data={formationsData} />
              </CardContent>
            </Card>
            {/* Évaluations */}
            <Card  className="mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Évaluations</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span>Conception d'application mobile</span>
                    <span className="text-orange-500">En Cours</span>
                    {/* <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                      Générer Lien
                    </button> */}
                    <GenerateLink />

                  </div>
                </div>
                 {/* Rapport & Statistiques */}
                <div className="mt-6">
                <RapportCard/>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Kit Formateur */}
          <KitFormateur/>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardFormateur;