
import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
Pagination,
PaginationContent,
PaginationItem,
PaginationLink,
PaginationNext,
PaginationPrevious,
} from "@/components/ui/pagination";
import ModalEditFormation from "@/components/dashboardElement/ModalEditFormation";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import DetailsFormation from "@/components/dashboardElement/DetailsFormation";
import {FormationAvenir } from "@/pages/FormationAvenir";
import FormationTerminer from "@/pages/FormationTerminer";

interface FormationItem {
id: number;
title: string;
status: "En cours" | "À venir" | "Terminé";
}

const MesFormations = () => {
const [formations, setFormations] = useState<FormationItem[]>([
{ id: 0, title: "Développement C# : fondamentaux", status: "En cours" },
{ id: 1, title: "AWS : Développement et déploiement", status: "À venir" },
{ id: 2, title: "Conception d'application mobile", status: "Terminé" },
]);
const navigate = useNavigate();

  const handleOpenModal = () => {
    navigate("/formationModal");
  };
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedFormation, setSelectedFormation] = useState<FormationItem | null>(null);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [formationToDelete, setFormationToDelete] = useState<number | null>(null);
const [showDetails, setShowDetails] = useState(false);

const handleEditClick = (formation: FormationItem) => {
setSelectedFormation(formation);
setIsModalOpen(true);
};

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
return <DetailsFormation />;
case "À venir":
return <FormationAvenir />;
case "Terminé":
return <FormationTerminer />;
default:
return <div>Statut inconnu</div>;
}
};

return (
<div className="min-h-screen flex flex-col bg-gray-100">
<DashboardHeader />

<main className="flex-grow py-8">
<div className="container mx-auto px-4">
{showDetails && selectedFormation ? (
<>
<button
className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
onClick={handleRetourClick}
>
<span className="mr-2">←</span> Retour à la liste des formations
</button>
{renderDetails()}

</>

          



) : (
<>
<div className="flex justify-between items-center mb-8">
<h1 className="text-2xl font-bold">Mes Formations</h1>
<button 
                  onClick={handleOpenModal}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-600 transition-colors"
                >
                  <Plus size={20} />
                  <span>Créer une formation</span>
                </button>
</div>

<div className="flex items-center justify-between mb-6">
<div className="flex items-center space-x-4 w-full">
<div className="relative w-3/4">
<Input
type="search"
placeholder="Recherche une formation"
className="rounded-md shadow-sm border w-full pr-10"
/>
<Search
className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500"
size={20}
/>
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

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
{formations.map((formation) => (
<Card
key={formation.id}
className="overflow-hidden shadow-md border rounded-lg bg-white"
>
<div className="relative">
<div className="h-48 bg-gray-100 flex items-center justify-center">
<img
src="/placeholder.svg"
alt="Formation"
className="w-full h-full object-cover rounded-t-lg"
/>
</div>
</div>
<div className="p-6">
<div className="flex items-center justify-between mb-3">
<div
className={`px-3 py-1 rounded-full text-xs font-semibold ${
formation.status === "En cours"
? "bg-orange-100 text-orange-600"
: formation.status === "À venir"
? "bg-purple-100 text-purple-600"
: "bg-green-100 text-green-600"
}`}
>
{formation.status}
</div>
<div className="flex space-x-3">
<Trash2
className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition"
onClick={() => handleDeleteClick(formation.id)}
/>
<Edit
className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition"
onClick={() => handleEditClick(formation)}
/>
</div>
</div>
<h3 className="font-semibold text-base mb-2">{formation.title}</h3>
<p className="text-sm text-gray-500 mb-5">
Explorez les fondamentaux de la conception d'interfaces...
</p>
<div className="flex justify-between items-center">
<button
className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium"
onClick={() => handleAccessClick(formation)}
>
Accéder →
</button>
</div>
</div>
</Card>
))}
</div>

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
<PaginationNext href="#" />
</PaginationItem>
</PaginationContent>
</Pagination>
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
<div className="bg-white p-8 rounded-lg shadow-lg w-[600px] relative">
{/* Bouton Fermer */}
<button
className="absolute top-4 right-4 text-black hover:text-gray-700"
onClick={() => setIsDeleteModalOpen(false)}
>
✖
</button>

<h2 className="text-2xl font-bold mb-2">Supprimer une formation</h2>
<p className="text-gray-600 mb-6">
Êtes-vous sûr de vouloir supprimer cette formation ?
</p>

<div className="flex justify-end space-x-4">
<button
className="px-5 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
onClick={() => setIsDeleteModalOpen(false)}
>
Annuler
</button>
<button
className="px-5 py-2 bg-red-100 text-red-600 border border-red-400 rounded-md hover:bg-red-200"
onClick={confirmDeleteFormation}
>
Supprimer
</button>
</div>
</div>
</div>
)}
</div>
);
};

export default MesFormations;