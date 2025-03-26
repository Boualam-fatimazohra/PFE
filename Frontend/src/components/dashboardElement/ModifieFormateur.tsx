import { useState } from 'react';
import { Calendar, Download, Eye, Users } from 'lucide-react';

interface FormateurFormProps {
  initialData?: {
    prenom?: string;
    nom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
    specialite?: string;
    experience?: string;
    dateIntegration?: string;
    aPropos?: string;
  };
}

const ModifieFormateur : React.FC<FormateurFormProps> = ({ initialData = {} }) => {
  const [formData, setFormData] = useState({
    prenom: initialData.prenom || 'Mohamed',
    nom: initialData.nom || 'Bikarrane',
    email: initialData.email || 'mohamed.bikarrane@orange.com',
    telephone: initialData.telephone || '0600112/0033',
    adresse: initialData.adresse || 'Agadir',
    specialite: initialData.specialite || 'UX/UI Design',
    experience: initialData.experience || '',
    dateIntegration: initialData.dateIntegration || '25 Janvier 2025 - 08:30',
    aPropos: initialData.aPropos || 'Mohamed Bikarrane, un passionné d\'UX/UI Design. Avec une expérience sur plus de 30 projets diversifiés, ma passion se concentre.'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white ">
      <div className="bg-white rounded-lg shadow-md max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-100 p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Mohamed Bikarrane</h2>
          <div className="flex items-center space-x-2">
            <select className="border rounded px-2 py-1 bg-white">
              <option>Actif</option>
              <option>Inactif</option>
            </select>
            <button className="bg-black text-white px-4 py-2 rounded">
              Modifier formateur
            </button>
          </div>
        </div>

        {/* Profile Image Placeholder */}
        <div className="p-6 border-b">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Form Sections */}
        <div className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Prenom</label>
                <input 
                  type="text" 
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Mohamed"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nom</label>
                <input 
                  type="text" 
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Bikarrane"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Adresse Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Téléphone</label>
                <input 
                  type="text" 
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Adresse</label>
                <input 
                  type="text" 
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="Agadir"
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Spécialité</label>
                <input 
                  type="text" 
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  placeholder="UX/UI Design"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Experience (années)</label>
                <input 
                  type="text" 
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date d'intégration</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="dateIntegration"
                    value={formData.dateIntegration}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 pr-10 bg-white"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-500" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* À propos */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-sm text-gray-600 mb-1">À propos</label>
            <textarea 
              name="aPropos"
              value={formData.aPropos}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 h-24 bg-white"
            />
          </div>

          {/* CV Section */}
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Users className="text-gray-600" />
              <span>Formulaire d'inscription Mars 01</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="text-gray-600 cursor-pointer" />
              <Download className="text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-100 p-4 flex justify-end space-x-4 border-t">
          <button className="text-gray-600 px-4 py-2 rounded border">Supprimer</button>
          <button className="bg-black text-white px-4 py-2 rounded">Modifier formateur</button>
        </div>
      </div>
    </div>
  );
};

export default ModifieFormateur;