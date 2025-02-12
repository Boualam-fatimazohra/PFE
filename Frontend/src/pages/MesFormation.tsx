import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, MoreHorizontal, MessageSquare, Trash2 } from 'lucide-react';

const MesFormations = () => {
  const formations = Array.from({ length: 9 });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <DashboardHeader />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Mes Formations</h1>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
              Créer une formation
            </button>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 shadow-sm border rounded-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* Icon */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Formations</p>
                  <p className="text-3xl font-bold">40</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm border rounded-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* Icon */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Formations</p>
                  <p className="text-3xl font-bold">64</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm border rounded-md">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* Icon */}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-3xl font-bold">-</p>
                </div>
              </div>
            </Card>
          </div>
          {/* Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 w-full">
              <div className="relative w-3/4">
                <Input
                  type="search"
                  placeholder="Recherche une formation"
                  className="rounded-md shadow-sm border w-full pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
              </div>
              <Select>
                <SelectTrigger className="w-[150px] rounded-md shadow-sm border">
                  <SelectValue placeholder="Trier par date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récent</SelectItem>
                  <SelectItem value="oldest">Plus ancien</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[150px] rounded-md shadow-sm border">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Formations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {formations.map((_, index) => (
              <Card key={index} className="overflow-hidden shadow-sm border rounded-md">
                <div className="relative">
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {index < 2 ? (
                      <img 
                        src={index === 0 ? "/placeholder.svg" : "/placeholder.svg"} 
                        alt="Formation" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-16 h-16 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.158 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l5.159 5.159m-6-6l-1.409 1.409a2.25 2.25 0 01-3.182 0L5.25 5.25m16.5 4.5l-1.409-1.409a2.25 2.25 0 01-3.182 0L8.25 18.75" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {index === 0 && <div className="bg-orange-100 text-orange-500 px-2 py-1 rounded text-xs">En cours</div>}
                    {index === 1 && <div className="bg-purple-100 text-purple-500 px-2 py-1 rounded text-xs">A venir</div>}
                    {index > 1 && <div className="bg-green-100 text-green-500 px-2 py-1 rounded text-xs">Terminer</div>}
                    <div className="flex space-x-2">
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer" />
                      <Edit className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </div>
                  </div>
                  <h3 className="font-medium mb-2 text-sm">
                    {index === 0 ? "Développement C# : fondamentaux et..." :
                     index === 1 ? "AWS : Développement, déploiement e..." :
                     "Conception d'application mobile"}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Explorez les fondamentaux de la conception d'interfaces...
                  </p>
                  <div className="flex items-center justify-between">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-xs">
                      Accéder →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              {[1, 2, 3, 4, 5].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink href="#" isActive={page === 1}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">30</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default MesFormations;
