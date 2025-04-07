import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface MaterialPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  setFormData: (data: MaterialPurchaseFormData) => void;
  formData: MaterialPurchaseFormData;
}

interface MaterialPurchaseFormData {
  itemName: string;
  category: string;
  quantity: string;
  unit: string;
  estimatedPrice: string;
  supplier: string;
  urgency: string;
  justification: string;
  requestedBy: string;
  department: string;
}

const  AchatMateriel = ({ 
  isOpen, 
  onClose, 
  onChange, 
  onSave, 
  formData, 
  setFormData 
}: MaterialPurchaseModalProps) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormData({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      estimatedPrice: "",
      supplier: "",
      urgency: "normal",
      justification: "",
      requestedBy: "",
      department: ""
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Le nom de l'article est requis.";
    }
    if (!formData.category) {
      newErrors.category = "La catégorie est requise.";
    }
    if (!formData.quantity.trim() || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "La quantité doit être un nombre valide.";
    }
    if (!formData.estimatedPrice.trim() || isNaN(Number(formData.estimatedPrice))) {
      newErrors.estimatedPrice = "Le prix estimé doit être un nombre valide.";
    }
    if (!formData.justification.trim()) {
      newErrors.justification = "La justification est requise.";
    }
    if (!formData.requestedBy.trim()) {
      newErrors.requestedBy = "Le demandeur est requis.";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Le département est requis.";
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
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Demande d'Achat de Matériel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne de gauche */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Article* :</label>
            <Input
              name="itemName"
              type="text"
              placeholder="Nom de l'article"
              value={formData.itemName}
              onChange={onChange}
              className={errors.itemName ? 'border-red-500' : ''}
            />
            {errors.itemName && <p className="text-sm text-red-500">{errors.itemName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie* :</label>
            <select
              name="category"
              value={formData.category}
              onChange={onChange}
              className={`w-full px-3 py-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="informatique">Matériel informatique</option>
              <option value="bureau">Fournitures de bureau</option>
              <option value="technique">Équipement technique</option>
              <option value="formation">Matériel pédagogique</option>
              <option value="autre">Autre</option>
            </select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantité* :</label>
              <Input
                name="quantity"
                type="number"
                min="1"
                placeholder="Quantité"
                value={formData.quantity}
                onChange={onChange}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Unité :</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={onChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="unité">Unité</option>
                <option value="lot">Lot</option>
                <option value="kg">Kg</option>
                <option value="l">Litre</option>
                <option value="m">Mètre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prix estimé (DH)* :</label>
            <Input
              name="estimatedPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix estimé"
              value={formData.estimatedPrice}
              onChange={onChange}
              className={errors.estimatedPrice ? 'border-red-500' : ''}
            />
            {errors.estimatedPrice && <p className="text-sm text-red-500">{errors.estimatedPrice}</p>}
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fournisseur :</label>
            <Input
              name="supplier"
              type="text"
              placeholder="Nom du fournisseur"
              value={formData.supplier}
              onChange={onChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Urgence :</label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={onChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="normal">Normale</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Justification* :</label>
            <textarea
              name="justification"
              placeholder="Justifiez la nécessité de cet achat"
              value={formData.justification}
              onChange={onChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded ${errors.justification ? 'border-red-500' : ''}`}
            />
            {errors.justification && <p className="text-sm text-red-500">{errors.justification}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Demandeur* :</label>
              <Input
                name="requestedBy"
                type="text"
                placeholder="Nom du demandeur"
                value={formData.requestedBy}
                onChange={onChange}
                className={errors.requestedBy ? 'border-red-500' : ''}
              />
              {errors.requestedBy && <p className="text-sm text-red-500">{errors.requestedBy}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Département* :</label>
              <Input
                name="department"
                type="text"
                placeholder="Département"
                value={formData.department}
                onChange={onChange}
                className={errors.department ? 'border-red-500' : ''}
              />
              {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-4">
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100" 
          onClick={handleCancel}
        >
          Annuler
        </Button>
        <Button 
          className="bg-orange-500 text-white hover:bg-orange-600" 
          onClick={handleSave}
        >
          Soumettre la demande
        </Button>
      </div>
    </Modal>
  );
};

export { AchatMateriel };