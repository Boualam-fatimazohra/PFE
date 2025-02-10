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
    interface StatistiqueItem {
        formateur: string;
        date: string;
        type: string;
        lieu: string;
        status: "En Cours" | "Terminer" | "Replanifier";
      }
  const formationsData = [
    { title: "Conception d'application mobile", date: "25/02/2025", status: "En Cours" as const },
    { title: "Développement Web", date: "10/03/2025", status: "Terminer" as const },
    { title: "Data Science", date: "15/04/2025", status: "En Cours" as const}
  ];

  const evenementData = [
    { title: "Atelier IA", date: "12/03/2025", lieu: "ODC", status: "En Cours" as const },
    { title: "Hackathon", date: "22/04/2025", lieu: "Fablab", status: "Terminer" as const },
    { title: "Séminaire DevOps", date: "30/05/2025", lieu: "Salle de conférence", status: "Replanifier" as const }
  ];
  const statistiquesData: StatistiqueItem[] = [
    { formateur: "Mohamed ", date: "15/03/2025", type: "Développement Web", lieu: "ODC", status: "En Cours" as const },
    { formateur: "Mehdi", date: "22/03/2025", type: "Data Science", lieu: "Fablab", status: "Terminer" as const },
    { formateur: "Hemza", date: "30/03/2025", type: "IA & Machine Learning", lieu: "Salle de conférence", status: "En Cours" as const }
  ];
  const StatusBadge = ({ status }: { status: StatistiqueItem["status"] })  => {
    const statusStyles = {
      "En Cours": "bg-orange-100 text-orange-700",
      "Terminer": "bg-green-100 text-green-700",
      "Replanifier": "bg-gray-100 text-gray-700"
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };
  
  
  const achatData = [
    { title: "Ordinateur Mac", type: "Composants matériels informatiques"as const },
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

          {/* Formations, Événements et Achats */}
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

            {/* Évaluations */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Suivi d'achat</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
                <div className="space-y-4">
                <AchatTable data={achatData} />
                </div>
              </CardContent>
            </Card>
          </div>
          <CalendarView />
           {/* Formations, Événements et Achats */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Formations</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
          <FormationsTable data={formationsData} />
                
              </CardContent>
            </Card>

            {/* Évaluations */}
            <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Statistique</h2>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
            Découvrir
          </button>
        </div>
        <div className="space-y-4">
          {statistiquesData.map((stat, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-semibold">{stat.formateur}</span>
              <span>{stat.date}</span>
              <span>{stat.type}</span>
              <span>{stat.lieu}</span>
              <StatusBadge status={stat.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
          </div>

          {/* Rapport & Kit Formateur */}
          <KitFormateur />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardManager;
