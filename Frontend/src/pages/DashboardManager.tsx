import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { FormationsTable } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import { AchatTable } from "@/components/dashboardElement/AchatTable";
import { EvenementTable } from "@/components/dashboardElement/EvenementTable";
import CalendarView from "@/components/dashboardElement/CalendarView";
import { FormationProvider } from "@/contexts/FormationContext";

const DashboardManager = () => {
  const evenementData = [
    { title: "Atelier IA", date: "12/03/2025", lieu: "ODC", status: "En Cours" }, 
    { title: "Hackathon", date: "22/04/2025", lieu: "Fablab", status: "Terminé" },
    { title: "Séminaire DevOps", date: "30/05/2025", lieu: "Salle de conférence", status: "Replanifié" }
  ];
  
  const statistiquesData = [
    { formateur: "Mohamed", date: "15/03/2025", type: "Développement Web", lieu: "ODC", status: "En Cours" },
    { formateur: "Mehdi", date: "22/03/2025", type: "Data Science", lieu: "Fablab", status: "Terminé" },
    { formateur: "Hemza", date: "30/03/2025", type: "IA & Machine Learning", lieu: "Salle de conférence", status: "En Cours" }
  ];
  
  const achatData = [
    { title: "Ordinateur Mac", type: "Composants matériels informatiques" },
    { title: "Carte Arduino", type: "Microcontrôleur" },
    { title: "Souris", type: "Composants matériels informatiques" }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
            <SearchBar onSearch={(value) => console.log(value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Total Bénéficiaires" value={250} />
            <StatsCard title="Total Formations" value={64} />
            <StatsCard title="Prochain événement" value="07" />
            <StatsCard title="Satisfaction moyenne" value="95%" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
                {/* <EvenementTable data={evenementData} /> */}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Suivi d'achat</h2>
                <AchatTable data={achatData} />
              </CardContent>
            </Card>
          </div>
          
          <CalendarView />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Formations</h2>
                <FormationProvider>
                  <FormationsTable />
                </FormationProvider>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
                <div className="space-y-4">
                  {statistiquesData.map((stat, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold">{stat.formateur}</span>
                      <span>{stat.date}</span>
                      <span>{stat.type}</span>
                      <span>{stat.lieu}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${stat.status === "En Cours" ? "bg-orange-100 text-orange-700" : stat.status === "Terminé" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{stat.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Kit Formateur</h2>
              <KitFormateur />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardManager;
