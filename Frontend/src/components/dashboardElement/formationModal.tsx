import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface FormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  setFormationData: (data: { nom: string; dateDebut: string; dateFin: string; lienInscription: string; tags: string }) => void;
  formationData: {
    nom: string;
    dateDebut: string;
    dateFin: string;
    lienInscription: string;
    tags:string;
  };
}

const FormationModal = ({ isOpen, onClose, onChange, onSave, formationData, setFormationData }: FormationModalProps) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormationData({
      nom: "",
      dateDebut: "",
      dateFin: "",
      lienInscription: "",
      tags:""
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formationData.nom.trim()) {
      newErrors.nom = "Le nom de la formation est requis.";
    }
    if (!formationData.dateDebut) {
      newErrors.dateDebut = "La date de début est requise.";
    }
    if (!formationData.dateFin) {
      newErrors.dateFin = "La date de fin est requise.";
    }
    if (!formationData.lienInscription.trim()) {
      newErrors.lienInscription = "Le lien d'inscription est requis.";
    }
    if (!formationData.tags.trim()) {
        newErrors.nom = "Le Tag est requis.";
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave();
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Créer une Formation :</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom :</label>
          <Input name="nom" type="text" value={formationData.nom} onChange={onChange} className={errors.nom ? 'border-red-500' : ''} />
          {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de début :</label>
          <Input name="dateDebut" type="date" value={formationData.dateDebut} onChange={onChange} className={errors.dateDebut ? 'border-red-500' : ''} />
          {errors.dateDebut && <p className="text-sm text-red-500">{errors.dateDebut}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de fin :</label>
          <Input name="dateFin" type="date" value={formationData.dateFin} onChange={onChange} className={errors.dateFin ? 'border-red-500' : ''} />
          {errors.dateFin && <p className="text-sm text-red-500">{errors.dateFin}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lien d'inscription :</label>
          <Input name="lienInscription" type="text" value={formationData.lienInscription} onChange={onChange} className={errors.lienInscription ? 'border-red-500' : ''} />
          {errors.lienInscription && <p className="text-sm text-red-500">{errors.lienInscription}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags :</label>
          <Input name="tags" type="text" value={formationData.tags} onChange={onChange} className={errors.lienInscription ? 'border-red-500' : ''} />
          {errors.lienInscription && <p className="text-sm text-red-500">{errors.lienInscription}</p>}
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <Button className="bg-gray-500 text-white" onClick={handleCancel}>Annuler</Button>
        <Button className="bg-orange-500 text-white" onClick={handleSave}>Enregistrer</Button>
      </div>
    </Modal>
  );
};

export { FormationModal };
