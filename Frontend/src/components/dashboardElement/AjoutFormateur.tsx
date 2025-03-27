import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface Formateur {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  specialite: string;
  experience: string;
  dateInscription: string;
  description: string;
  cv: File | null;
  imageFormateur: File | null;
}

export const AjoutFormateur: React.FC = () => {
  const [formateur, setFormateur] = useState<Formateur>({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    ville: '',
    specialite: '',
    experience: '',
    dateInscription: '',
    description: '',
    cv: null,
    imageFormateur: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormateur(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'imageFormateur') => {
    const file = e.target.files?.[0] || null;
    setFormateur(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formateur);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white">
      <h2 className="text-2xl font-bold mb-6">Ajouter un formateur</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input 
                id="prenom" 
                name="prenom"
                value={formateur.prenom}
                onChange={handleInputChange}
                placeholder="Mohamed"
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input 
                id="nom" 
                name="nom"
                value={formateur.nom}
                onChange={handleInputChange}
                placeholder="Bitterram"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="email">Adresse Email</Label>
              <Input 
                id="email" 
                name="email"
                type="email"
                value={formateur.email}
                onChange={handleInputChange}
                placeholder="mohamed.bitterram@example.com"
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input 
                id="telephone" 
                name="telephone"
                value={formateur.telephone}
                onChange={handleInputChange}
                placeholder="0600000000"
              />
            </div>
            <div>
              <Label htmlFor="ville">Ville</Label>
              <Select 
                value={formateur.ville}
                onValueChange={(value) => setFormateur(prev => ({...prev, ville: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="DRC Alger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRC Alger">DRC Alger</SelectItem>
                  {/* Add more ville options */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="border p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="specialite">Spécialité</Label>
              <Input 
                id="specialite" 
                name="specialite"
                value={formateur.specialite}
                onChange={handleInputChange}
                placeholder="UX/UI Design"
              />
            </div>
            <div>
              <Label htmlFor="experience">Expérience (années)</Label>
              <Input 
                id="experience" 
                name="experience"
                type="number"
                value={formateur.experience}
                onChange={handleInputChange}
                placeholder="07"
              />
            </div>
            <div>
              <Label htmlFor="dateInscription">Date d'inscription</Label>
              <Input 
                id="dateInscription" 
                name="dateInscription"
                type="date"
                value={formateur.dateInscription}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">À propos</Label>
              <textarea 
                id="description"
                name="description"
                value={formateur.description}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Mohamed Bitterram, un passionné d'UX/UI Design. Avec une expérience sur plus de 20 projets diversifiés. Ma passion est la créativité."
                rows={4}
              />
            </div>
            <div>
              <Label>CV</Label>
              <div className="flex items-center space-x-4">
                <Input 
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'cv')}
                  className="hidden"
                />
                <label htmlFor="cv" className="flex items-center cursor-pointer">
                  <Button type="button" variant="outline" className="mr-2">
                    <Upload className="mr-2 h-4 w-4" /> Télécharger
                  </Button>
                  <span>{formateur.cv?.name || 'Aucun fichier choisi'}</span>
                </label>
              </div>
            </div>
            <div>
              <Label>Image Formateur</Label>
              <div className="flex items-center space-x-4">
                <Input 
                  id="imageFormateur"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'imageFormateur')}
                  className="hidden"
                />
                <label htmlFor="imageFormateur" className="flex items-center cursor-pointer">
                  <Button type="button" variant="outline" className="mr-2">
                    <Upload className="mr-2 h-4 w-4" /> Télécharger
                  </Button>
                  <span>{formateur.imageFormateur?.name || 'Aucun fichier choisi'}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">Annuler</Button>
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">Ajouter un formateur</Button>
        </div>
      </form>
    </div>
  );
};

export default AjoutFormateur;