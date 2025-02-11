import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => void;
  setUserData: (data: { name: string; role: string; email: string; password: string }) => void;
  userData: {
    name: string;
    role: string;
    email: string;
    password: string;
  };
}

const UserModal = ({ isOpen, onClose, onChange, onSave, userData, setUserData }: UserModalProps) => {
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setUserData({
      name: "",
      role: "",
      email: "",
      password: ""
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userData.name.trim()) {
      newErrors.name = "Le nom est requis.";
    }
    if (!userData.role) {
      newErrors.role = "Le rôle est requis.";
    }
    if (!userData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "L'email n'est pas valide.";
    }
    if (!userData.password.trim()) {
      newErrors.password = "Le mot de passe est requis.";
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
      <h2 className="text-xl font-semibold mb-4 text-orange-500">Ajouter un Utilisateur :</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom :</label>
          <Input
            name="name"
            type="text"
            placeholder="Nom complet"
            value={userData.name}
            onChange={onChange}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle :</label>
          <select
            name="role"
            value={userData.role}
            onChange={onChange}
            className={`w-full px-3 py-2 border rounded ${errors.role ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner un rôle</option>
            <option value="admin">Administrateur</option>
            <option value="formateur">Formateur</option>
            <option value="technicien">Technicien</option>
          </select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email :</label>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={onChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe :</label>
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={userData.password}
            onChange={onChange}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <Button className="bg-gray-500 text-white hover:bg-gray-600" onClick={handleCancel}>
          Annuler
        </Button>
        <Button className="bg-orange-500 text-white hover:bg-orange-600" onClick={handleSave}>
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
};

export { UserModal };
