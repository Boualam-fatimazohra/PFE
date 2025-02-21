import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CustomPagination } from "@/components/layout/CustomPagination";

import ModalEditFormation from "@/components/dashboardElement/ModalEditFormation";
import FormationCard from "@/components/Formation/FormationCards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailsFormation from "@/components/dashboardElement/DetailsFormation";
import { FormationAvenir } from "@/pages/FormationAvenir";
import FormationTerminer from "@/pages/FormationTerminer";
import { Button } from "@/components/ui/button";

interface FormationItem {
  id: number;
  title: string;
  status: "En cours" | "A venir" | "Terminer" | "Replanifier";
}

const MesFormations = () => {


const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate("/formationModal");
  };
  const [formations, setFormations] = useState<FormationItem[]>([
    { id: 0, title: "Développement C# : fondamentaux", status: "En cours" },
    { id: 1, title: "AWS : Développement et déploiement", status: "A venir" },
    { id: 2, title: "Conception d'application mobile", status: "Terminer" },
    { id: 3, title: "Developpement JAVA", status: "Replanifier" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);


  const handleEditClick = (formation: FormationItem) => {
    setSelectedFormation(formation);
    setIsModalOpen(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 30;

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFormation(null);
  };

  const handleDeleteClick = (id: number) => {
    setFormationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteFormation = () => {
    setFormations((prevFormations) =>
      prevFormations.filter((formation) => formation.id !== formationToDelete)
    );
    setIsDeleteModalOpen(false);
    setFormationToDelete(null);
  };
  const handleAccessClick = (formation: FormationItem) => {
    setSelectedFormation(formation);
    setShowDetails(true);
  };

  const handleRetourClick = () => {
    setSelectedFormation(null);
    setShowDetails(false);
  };

  const renderDetails = () => {
    if (!selectedFormation) return null;
  
    switch (selectedFormation.status) {
      case "En cours":
        return <DetailsFormation onRetourClick={handleRetourClick} />;
      case "A venir":
        return <FormationAvenir onRetourClick={handleRetourClick} />;
      case "Terminer":
        return <FormationTerminer onRetourClick={handleRetourClick}/>;
      default:
        return <div>Statut inconnu</div>;
    }
  };

      const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
      const filteredFormations = selectedStatus && selectedStatus !== 'null'
      ? formations.filter((formation) => formation.status === selectedStatus)
      : formations;

  return (
    <div className="bg-white min-h-screen p-4">
      <DashboardHeader />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          {showDetails && selectedFormation ? (
            <>
              {renderDetails()}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Mes Formations</h1>
                <Button variant="orange" className="rounded-none"
                onClick={handleOpenModal}>
                  Créer une formation
                </Button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 w-full">
                  <div className="relative w-3/4">
                    <Input
                      type="search"
                      placeholder="Recherche une formation"
                      className="rounded-none shadow-sm border w-full pr-10"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 " width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="26" height="26" rx="13" fill="#FF7900"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2765 18.1101L15.6661 14.4996C16.2718 13.6533 16.5966 12.6382 16.5949 11.5974C16.5949 8.83742 14.3574 6.59998 11.5974 6.59998C8.83738 6.59998 6.59998 8.83738 6.59998 11.5974C6.59998 14.3574 8.83738 16.5949 11.5974 16.5949C12.6382 16.5965 13.6533 16.2717 14.4998 15.6661L18.1101 19.2764C18.2665 19.432 18.5192 19.432 18.6756 19.2764L19.2765 18.6756C19.432 18.5191 19.432 18.2665 19.2765 18.1101ZM11.5974 14.9957C9.72062 14.9957 8.19916 13.4742 8.19916 11.5974C8.19916 9.72062 9.72062 8.19916 11.5974 8.19916C13.4742 8.19916 14.9957 9.72062 14.9957 11.5974C14.9957 13.4742 13.4742 14.9957 11.5974 14.9957Z" fill="white"/>
                    </svg>

                  </div>
                  <Select onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[150px] rounded-none shadow-sm border">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="null">Tous les statuts</SelectItem>
                        <SelectItem value="En cours">En Cours</SelectItem>
                        <SelectItem value="A venir">A Venir</SelectItem>
                        <SelectItem value="Replanifier">Replanifier</SelectItem>
                        <SelectItem value="Terminer">Terminer</SelectItem>
                      </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-[150px] rounded-none shadow-sm border">
                      <SelectValue placeholder="Trier par date" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="oldest">Plus ancien</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard title="Total Formations" value={41} />
                <StatsCard title="Total Formations" value={25} />
                <StatsCard title="Total" value="-" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredFormations.map((formation) => (
                  <FormationCard
                    key={formation.id}
                    formation={formation}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onAccess={handleAccessClick}
                  />
                ))}
              </div>

              <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <ModalEditFormation
          formation={selectedFormation}
          onClose={handleCloseModal}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-none shadow-lg w-[600px] relative">
            {/* Bouton Fermer */}
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-black hover:text-gray-700 h-auto p-0"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              ✖
            </Button>

            <h2 className="text-2xl font-bold mb-2">Supprimer une formation</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette formation ?
            </p>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="rounded-none"
                onClick={confirmDeleteFormation}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesFormations;