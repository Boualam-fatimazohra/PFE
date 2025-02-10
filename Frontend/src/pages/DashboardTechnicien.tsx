import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import EquipmentList from "@/components/dashboardElement/EquipmentList";

const projectsData = [
  { title: "Robot autonome", student: "Fatima boualam", status: "En Cours" },
  { title: "Application IoT", student: "Saloua ouissa", status: "Terminé" },
  { title: "Impression 3D Pièce", student: "Ikram Assaad", status: "En Attente" },
];

const constraintsProjects = [
  { title: "Drone de surveillance", reason: "Manque de budget" },
  { title: "Système solaire autonome", reason: "Matériel indisponible" },
];

const equipmentData = [
  { name: "Imprimante 3D", quantity: 2, status: "Disponible" as const },
  { name: "Découpe Laser", quantity: 1, status: "Indisponible" as const},
  { name: "Fraiseuse CNC", quantity: 3, status: "Disponible"as const },
];

const statusStyles = {
  "En Cours": "bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold",
  "Terminé": "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold",
  "En Attente": "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={statusStyles[status]}>{status}</span>
);

const ProjectTable = ({ data }: { data: typeof projectsData }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border rounded-lg shadow-md">
      <thead>
        <tr className="bg-gray-100 text-left text-sm font-semibold">
          <th className="px-6 py-3">Titre</th>
          <th className="px-6 py-3">Étudiant</th>
          <th className="px-6 py-3">Status</th>
          <th className="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((project, index) => (
          <tr key={index} className="border-t text-sm">
            <td className="px-6 py-3">{project.title}</td>
            <td className="px-6 py-3">{project.student}</td>
            <td className="px-6 py-3">
              <StatusBadge status={project.status} />
            </td>
            <td className="px-6 py-3">
              <button className="bg-black text-white px-4 py-1 rounded-md">Accéder</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DashboardTechnicien = () => (
  <div className="min-h-screen flex flex-col">
    <DashboardHeader />
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestion de Stock & Projets</h1>
          <SearchBar onSearch={(value) => console.log(value)} onCreate={() => alert("Ajouter Projet")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Composants" value={1500} />
          <StatsCard title="Équipements Disponibles" value={12} />
          <StatsCard title="Projets en Cours" value={7} />
          <StatsCard title="Demandes en Attente" value={5} />
        </div>
        <Card className="mb-8 border-red-500 border-2">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Projets avec Contraintes</h2>
            <ul>
              {constraintsProjects.map((project, index) => (
                <li key={index} className="bg-red-100 p-4 rounded mb-2">
                  <span className="font-bold">{project.title}</span>: {project.reason}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Liste des Matériels</h2>
              <EquipmentList data={equipmentData} />
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Liste des Étudiants et Projets</h2>
              <ProjectTable data={projectsData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default DashboardTechnicien;
