import { useState } from "react";
import { Eye, Upload, Trash2 } from "lucide-react";

const ModalEditFormation = ({ formation, onClose }) => {
  if (!formation) return null;

  const [title, setTitle] = useState(formation.name);
  const [description, setDescription] = useState(formation.description || "");
  const [status, setStatus] = useState(formation.status || "En cours");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] relative">
        {/* Bouton Fermer */}
        <button
          className="absolute top-4 right-4 text-black hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">Modifier une formation</h2>
        <p className="text-gray-500 text-sm mb-6">All required fields are marked with <span className="text-red-500">*</span></p>

        {/* Titre */}
        <label className="block font-medium mb-1">Titre <span className="text-red-500">*</span></label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md mb-4 text-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label className="block font-medium mb-1">Description <span className="text-red-500">*</span></label>
        <textarea
          className="w-full px-4 py-2 border rounded-md mb-4 h-28 text-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Statut */}
        <label className="block font-medium mb-1">Statut <span className="text-red-500">*</span></label>
        <select
          className="w-full px-4 py-2 border rounded-md mb-6 text-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
          <option value="Annulé">Annulé</option>
        </select>

        {/* Upload d'image */}
        <label className="block font-medium mb-1">Add example images</label>
        <p className="text-gray-500 text-sm mb-2">Maximum file size: 2 MB. Supported files: jpg, jpeg, png. Several files possible.</p>
        <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-3 rounded-md flex items-center justify-center text-lg"
        >
          <Upload className="w-6 h-6 mr-2" /> Select a file
        </label>

        {/* Affichage de l'image */}
        {fileName && (
          <div className="mt-3 flex items-center space-x-4 border p-3 rounded-md">
            <img src={image} alt="Preview" className="w-14 h-14 object-cover rounded-md" />
            <span className="text-gray-700">{fileName}</span>
            <button className="text-gray-600 hover:text-gray-900">
              <Eye className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Upload className="w-6 h-6" />
            </button>
            <button onClick={() => { setImage(null); setFileName(""); }} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-600"
          >
            Annuler
          </button>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-md text-lg hover:bg-orange-600">
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditFormation;
