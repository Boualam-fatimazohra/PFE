import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { FormationsTable } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import { AchatTable } from "@/components/dashboardElement/AchatTable";
import { EvenementTable } from "@/components/dashboardElement/EvenementTable";
import CalendarView from "@/components/dashboardElement/CalendarView";

const DashboardManager = () => {
  const evenementData = [
    { title: "Atelier IA", date: "12/03/2025", lieu: "ODC", status: "En Cours" as const },
    { title: "Hackathon", date: "22/04/2025", lieu: "Fablab", status: "Terminer" as const },
    { title: "Séminaire DevOps", date: "30/05/2025", lieu: "Salle de conférence", status: "Replanifier" as const }
  ];

  const achatData = [
    { title: "Ordinateur Mac", type: "Composants matériels informatiques" as const },
    { title: "Carte Arduino", type: "Microcontrôleur" as const },
    { title: "Souris", type: "Composants matériels informatiques" as const }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
            <SearchBar 
              onSearch={(value) => console.log(value)} 
              onCreate={() => alert("Create")}
            />
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Bénéficiaires" value={250} />
            <StatsCard title="Total Formations" value={64} />
            <StatsCard title="Prochain événement" value="07" />
            <StatsCard title="Satisfaction moyenne" value="95%" />
          </div>

          {/* Événements et Achats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Événements à venir</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
                <EvenementTable data={evenementData} />
              </CardContent>
            </Card>

            <Card> 
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Suivi d'achat</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
                <AchatTable data={achatData} />
              </CardContent>
            </Card>
          </div>

          <CalendarView />

          {/* Formations */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Formations</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                  Découvrir
                </button>
              </div>
              <FormationsTable />
            </CardContent>
          </Card>

          {/* Rapport & Kit Formateur */}
          <KitFormateur />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardManager;
