import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const DashboardFormateur  = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* En-tête avec titre, recherche et bouton */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-10 w-[250px]"
                />
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors">
                <Plus size={20} />
                <span>Créer une formation</span>
              </button>
            </div>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500">Total Bénéficiares</p>
                  <p className="text-3xl font-bold">250</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500">Total Formations</p>
                  <p className="text-3xl font-bold">64</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500">Prochain événement</p>
                  <p className="text-3xl font-bold">07</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500">Satisfaction moyenne</p>
                  <p className="text-3xl font-bold">95%</p>
                </div>
              </CardContent>
            </Card>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: "25/02/2025", status: "En Cours" },
                      { date: "25/02/2025", status: "Terminer" },
                      { date: "25/02/2025", status: "Replanifier" },
                      { date: "25/02/2025", status: "En Cours" },
                      { date: "25/02/2025", status: "En Cours" },
                    ].map((formation, index) => (
                      <TableRow key={index}>
                        <TableCell>Conception d'application mobile</TableCell>
                        <TableCell>{formation.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            formation.status === "En Cours" ? "bg-orange-100 text-orange-700" :
                            formation.status === "Terminer" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {formation.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                            Accéder
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Évaluations */}
            <Card>
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
                    <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                      Générer Lien
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rapport & Statistiques */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Rapport & Statistiques</h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                  Générer Rapport
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Taux de completion</p>
                  <p className="text-4xl font-bold">85%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Taux Satisfaction</p>
                  <p className="text-4xl font-bold">87%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Heures</p>
                  <p className="text-4xl font-bold">451 H</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kit Formateur */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Kit Formateur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Formation support",
                  "Droit d'image",
                  "Certifications",
                  "Règlement Intérieur"
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item}</h3>
                      <Search size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Get help with a specific reservation</p>
                    <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                      Accéder
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardFormateur;