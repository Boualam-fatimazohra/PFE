import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/layout/CustomPagination";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEdc } from "@/contexts/EdcContext"; // Import the EdcContext hook

// Default image as a base64 encoded placeholder
const DEFAULT_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGM0YzRjM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0U2RTZFNjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9InVybCgjZ3JhZCkiIC8+CiAgICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzk5OSI+Tk8gSU1HPC90ZXh0Pgo8L3N2Zz4=";

// Types
interface Formation {
  _id: string;
  title: string;
  nom: string;
  image?: string;
  formateur: {
    utilisateur: {
      prenom: string;
      nom: string;
    }
  };
  dateDebut: string;
  dateFin: string;
  entity?: {
    ville: string;
  };
  status: "À venir" | "En Cours" | "Terminée" | "Replanifier";
}

const FormationManager = () => {
  // Use the EdcContext to fetch formations
  const {
    edcFormations,
    loading,
    error,
    fetchEdcFormations
  } = useEdc();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Fetch formations when component mounts
  useEffect(() => {
    fetchEdcFormations();
  }, [fetchEdcFormations]);

  // Transform formations from backend to match our interface
  const transformedFormations: Formation[] = edcFormations ? edcFormations.map(formation => ({
    _id: formation._id,
    title: formation.nom,
    nom: formation.nom,
    image: formation.image || DEFAULT_IMAGE, // Use default image if no image available
    formateur: {
      utilisateur: {
        prenom: formation.formateur?.utilisateur?.prenom || 'Non assigné',
        nom: formation.formateur?.utilisateur?.nom || ''
      }
    },
    dateDebut: formation.dateDebut,
    dateFin: formation.dateFin,
    entity: {
      ville: formation.entity?.ville || 'Non spécifié'
    },
    status: formation.status as "À venir" | "En Cours" | "Terminée" | "Replanifier"
  })) : [];

  // Constants for pagination
  const itemsPerPage = 11;
  const totalPages = Math.ceil(transformedFormations.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top with smooth animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered and paginated formations
  const filteredFormations = transformedFormations.filter(formation => 
    formation.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === null || formation.status === activeFilter)
  );

  const currentFormations = filteredFormations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/\./g, ''); // Supprime les points dans les mois abrégés
  };
  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    setCurrentPage(1);
  };

  // Loading and error states
  if (loading) {
    return <div className="text-center py-10">Chargement des formations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erreur de chargement : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Formations</h1>
        <div className="flex space-x-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Calendrier Formations
          </button>
          <button className="bg-black text-white px-4 py-2 rounded flex items-center">
            <span className="mr-2">+</span>
            Créer un événement
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Recherche formation ..."
            className="w-full pl-3 pr-10 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search size={20} className="text-orange-500" />
          </button>
        </div>

        <div className="flex space-x-2">
          {["Avenir", "En Cours", "Terminée"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded ${
                activeFilter === status 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleFilterClick(status)}
            >
              {status}
            </button>
          ))}
          <div className="mr-auto">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
                </svg>
                Filtres
            </Button>
            </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#EBEBEB] text-black">
              <th className="text-left p-3 text-sm ">Titre Formation</th>
              <th className="text-left p-3 text-sm ">Formateur</th>
              <th className="text-left p-3 text-sm ">Date début</th>
              <th className="text-left p-3 text-sm ">Date fin</th>
              <th className="text-left p-3 text-sm ">Ville</th>
              <th className="text-left p-3 text-sm ">Status</th>
              <th className="text-left p-3 text-sm ">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentFormations.map((formation) => (
              <tr key={formation._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                    <div className="flex items-center gap-3">
                        <img 
                        src={formation.image} 
                        alt="" 
                        className="w-12 h-12 rounded-md object-cover"
                        />
                        <span>{formation.title}</span>
                    </div>
                </td>
                <td className="p-3">
                  {formation.formateur.utilisateur.prenom} {formation.formateur.utilisateur.nom}
                </td>
                <td className="p-3">{formatDate(formation.dateDebut)}</td>
                <td className="p-3">{formatDate(formation.dateFin)}</td>
                <td className="p-3">ODC {formation.entity?.ville}</td>
                <td className="p-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    formation.status === "En Cours" ? "bg-orange-100 text-orange-600" : 
                    formation.status === "À venir" ? "bg-blue-100 text-blue-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {formation.status}
                  </span>
                </td>
                <td className="p-3">
                  <Button 
                    variant="outline"
                    className="bg-black  text-white text-xs px-3 py-1 h-auto"
                  >
                    Accéder
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
    </div>
  );
};

export default FormationManager;