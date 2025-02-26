import { useState } from "react";
import { useFormations } from "../../contexts/FormationContext"; // Import the context hook

const FormateurFormations = () => {
  const { addNewFormation, error: contextError } = useFormations(); // Use the context
  
  const [formation, setFormation] = useState({
    nom: "",
    dateDebut: "",
    dateFin: "",
    description: "", // Add description field based on the API
    lienInscription: "",
    tags: "",
    categorie: "type1", // Add categorie field based on the API
    niveau: "type1", // Add niveau field based on the API
    status: "En Cours" as "En Cours" | "Terminer" | "Replanifier", // Use type assertion here
    image: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormation({ ...formation, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormation({ ...formation, image: e.target.files[0] });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // No need to modify the form data structure here
      // Just pass the formation object with the File object directly
      await addNewFormation(formation);
      setMessage("Formation créée avec succès!");
      
      // Reset form
      setFormation({
        nom: "",
        dateDebut: "",
        dateFin: "",
        description: "",
        lienInscription: "",
        tags: "",
        categorie: "type1",
        niveau: "type1",
        status: "En Cours",
        image: null,
      });
    } catch (error) {
      setMessage("Erreur lors de la création de la formation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options for select inputs
  const statusOptions = [
    { label: "En Cours", value: "En Cours" as const },
    { label: "Terminer", value: "Terminer" as const },
    { label: "Replanifier", value: "Replanifier" as const } // Change "Avenir" to "Replanifier" to match the type
  ];

  const categoryOptions = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  const levelOptions = [
    { label: "type1", value: "type1" },
    { label: "type2", value: "type2" },
    { label: "type3", value: "type3" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Créer une nouvelle formation</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      {contextError && (
        <div className="p-4 mb-4 rounded-md bg-red-100 text-red-700">
          {contextError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}  
        className="space-y-6"
        encType="multipart/form-data" 
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de la formation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom"
            value={formation.nom}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="dateDebut"
              value={formation.dateDebut}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin
            </label>
            <input
              type="datetime-local"
              name="dateFin"
              value={formation.dateFin}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formation.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formation.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              name="categorie"
              value={formation.categorie}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau <span className="text-red-500">*</span>
            </label>
            <select
              name="niveau"
              value={formation.niveau}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {levelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lien d'inscription <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="lienInscription"
            placeholder="https://"
            value={formation.lienInscription}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            name="tags"
            placeholder="web,development,javascript"
            value={formation.tags}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image de formation <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 2 MB. Supported files: jpg, jpeg, png.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer la formation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormateurFormations;