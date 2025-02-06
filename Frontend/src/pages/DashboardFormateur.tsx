import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
const DashboardFormateur = () => {
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
                  <p className="text-3xl font-bold">40</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center space-x-4 p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div>
                  <p className="text-sm text-gray-500">Prochain événement</p>
                  <p className="text-3xl font-bold">2</p>
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

          {/* Liste des Formations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Liste des Formations</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audit name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created on
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compliance rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Table rows will be added later with actual data */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardFormateur;