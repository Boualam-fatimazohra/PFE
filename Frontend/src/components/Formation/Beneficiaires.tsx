import * as React from "react";
import {  Clock, ArrowRight } from 'lucide-react';
import { Printer, Search, FileDown } from 'lucide-react';
import CourseHeader from "../Formation/CoursHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Ajout de l'import manquant pour Card
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Suppression de l'import motion qui n'est pas utilisé
 import {useFormations} from '../../contexts/FormationContext';
import FormationCard from "@/components/Formation/FormationCards";
import { useState, useEffect } from "react";
import BeneficiairesListe from "./ListeBeneficiaire";
// Types

interface FormationItem {
  id: string;
  title: string;
  status: "En Cours" | "Terminé" | "Avenir" | "Replanifier";
  image: string|File;
  dateDebut: string;
  dateFin?: string;
  dateCreated?: string;
}
const BeneficiairesList = () => {
  const [showBeneficiaires, setShowBeneficiaires] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<FormationItem | null>(null);
  const { formations: contextFormations, loading, error } = useFormations();
  const [formations, setFormations] = useState<FormationItem[]>([]);

  // Mappage des formations du contexte vers l'interface locale
  useEffect(() => {
    if (contextFormations?.length) {
      const mapped = contextFormations.map(f => ({
        id: f._id,
        title: f.nom,
        status: f.status,
        image: f.image,
        dateDebut: f.dateDebut,
        dateFin: f.dateFin,
        dateCreated: f.createdAt
      }));
      setFormations(mapped);
    }
  }, [contextFormations]);

  const handleAccessBeneficiaires = (formation: FormationItem) => {
    setSelectedFormation(formation);
    setShowBeneficiaires(true);
  };

  const handleBackToFormations = () => {
    setShowBeneficiaires(false);
    setSelectedFormation(null);
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="container mx-auto p-6">
      {!showBeneficiaires ? (
        <FormationsList 
          formations={formations} 
          onAccessBeneficiaires={handleAccessBeneficiaires}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"
              onClick={handleBackToFormations}
            >
              {/* Icône SVG */}
              <span className="text-lg font-bold text-[#000000]">Retour</span> 
            </Button>
          </div>
          
          {selectedFormation && (
            <CourseHeader 
              title={selectedFormation.title}
              subtitle="Détails de la formation"
              status={selectedFormation.status}
            />
          )}
          
          <BeneficiairesListe formationId={selectedFormation.id} />        
          </div>
      )}
    </div>
  );
};

// Composant FormationsList avec typage amélioré
const FormationsList = ({ formations, onAccessBeneficiaires }: FormationsListProps) => {
  const filterAndGroupFormations = () => {
    const groupes = {
      enCours: [] as FormationItem[],
      aVenir: [] as FormationItem[],
      autres: [] as FormationItem[]
    };

    formations.forEach(formation => {
      if (formation.status === "En Cours") {
        groupes.enCours.push(formation);
      } else if (formation.status === "Avenir") {
        groupes.aVenir.push(formation);
      } else {
        groupes.autres.push(formation);
      }
    });

    return groupes;
  };

  const { enCours, aVenir, autres } = filterAndGroupFormations();

  const renderSection = (title: string, formations: FormationItem[]) => (
    <>
      <div className="flex items-center mb-4">
        <hr className="flex-grow border-t-2 border-gray-300" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {formations.map(formation => (
          <FormationCard
            key={formation.id}
            formation={formation}
            onAccess={() => onAccessBeneficiaires(formation)}
            onEdit={() => console.log("edit", formation)}
            onDelete={() => console.log("delete", formation.id)}
          />
        ))}
      </div>
    </>
  );
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liste des formations</h2>
      {enCours.length > 0 && renderSection("Formations en cours", enCours)}
      {aVenir.length > 0 && renderSection("Formations à venir", aVenir)}
      {autres.length > 0 && renderSection("Autres formations", autres)}
    </div>
  );
};
interface FormationsListProps {
  formations: FormationItem[];
  onAccessBeneficiaires: (formation: FormationItem) => void;
}

// Beneficiaires List Component


export default BeneficiairesList;