import { useState, useEffect } from "react";
import { Eye, Upload, Trash2 } from "lucide-react";
import { useFormations } from "../../contexts/FormationContext";

const ModalEditFormation = ({ formation, onClose }) => {
  // États pour les champs du formulaire
  const [title, setTitle] = useState(formation?.title || "");
  const [description, setDescription] = useState(formation?.description || ""); 
  const [status, setStatus] = useState(formation?.status || "En Cours");
  const [image, setImage] = useState(formation?.image || null);
  const [fileName, setFileName] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [fileObject, setFileObject] = useState(null);

  const { updateFormation, refreshFormations } = useFormations();

  const extractFileName = (imageUrl) => {
    if (!imageUrl) return "";
    return imageUrl.split("/").pop();
  };
  
  useEffect(() => {
    if (formation) {
      console.log("Formation reçue :", formation);
      setTitle(formation.title);
      setDescription(formation.description || ""); 
      setStatus(formation.status || "En Cours");
      setImage(formation.image || null);
      setFileName(extractFileName(formation.image));
    }
  }, [formation]);

  const handleSubmit = async () => {
    try {
      const updatedFormation = {
        ...formation,
        title: title,
        description: description, 
        status: status,
        image: image,
      };

      await updateFormation(formation.id, updatedFormation);
      await refreshFormations();
      onClose();
    } catch (error) {
      console.error("Error updating formation:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Stocker le fichier original pour le téléchargement
      setFileObject(file);
      const objectUrl = URL.createObjectURL(file);
      setImage(objectUrl);
      setFileName(file.name);
    }
  };

  // Fonction pour afficher l'image en plein écran
  const handleViewImage = () => {
    setShowImagePreview(true);
  };

  // Fonction pour télécharger l'image
  const handleDownloadImage = () => {
    // Si nous avons le fichier d'origine, l'utiliser directement
    if (fileObject) {
      // Créer un URL blob à partir du fichier
      const blobUrl = URL.createObjectURL(fileObject);
      
      // Créer un élément <a> invisible
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = fileName || 'image';
      
      // Ajouter au DOM, cliquer puis supprimer
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } 
    // Si nous n'avons pas le fichier d'origine (cas d'une image existante)
    else if (image) {
      // Récupérer l'image via fetch pour la télécharger
      fetch(image)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = blobUrl;
          link.download = fileName || 'image';
          
          document.body.appendChild(link);
          link.click();
          
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        })
        .catch(error => {
          console.error("Erreur lors du téléchargement de l'image:", error);
          alert("Impossible de télécharger l'image. Veuillez réessayer.");
        });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-[4px] shadow-lg w-[700px] relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 "
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-inter font-bold mb-4">Modifier une formation</h2>
        <p className="text-gray-500 text-sm mb-6">All required fields are marked with <span className="text-[#F16E00]">*</span></p>

        {/* Titre */}
        <label className="block text-sm font-inter font-bold mb-1">Titre <span className="text-[#F16E00]">*</span></label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] mb-4 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="AWS : Développement, déploiement et gestion"
        />

        {/* Description */}
        <label className="block text-sm font-inter font-bold mb-1">Description <span className="text-[#F16E00]">*</span></label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-[4px] mb-4 h-28 text-sm text-[#666666]"
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Cette formation a pour objectif de fournir aux participants les connaissances et compétences nécessaires..."
        />

        {/* Statut */}
        <label className="block text-sm font-inter font-bold mb-1">Status <span className="text-[#F16E00]">*</span></label>
        <select
          className="w-[200px] px-3 py-2 border border-gray-300 rounded-[4px] mb-4 text-sm text-[#666666]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="En Cours">En Cours</option>
          <option value="Avenir">A Venir</option>
          <option value="Terminé">Terminé</option>
          <option value="Replanifier">Replanifier</option>
        </select>

        {/* Upload d'image */}
        <label className="block text-sm font-inter font-bold mb-1">Add example images</label>
        <p className="text-gray-500 text-xs mb-2">Maximum file size: 2 MB. Supported files: jpg, jpeg, png. Several files possible.</p>
        <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} accept="image/jpeg, image/jpg, image/png" />
        <label
          htmlFor="file-upload"
          className="w-[150px] cursor-pointer border-2  border-[#000000] text-black px-4 py-3 rounded-[4px] flex items-center justify-center text-sm mb-3 hover:bg-gray-50 font-bold"
        >
          Select a file
        </label>

        {/* Affichage de l'image */}
        {image && (
            <div className="mt-3 flex items-center space-x-2 border border-gray-300 p-2 rounded-[4px]">
              <img src={image} alt="Preview" className="w-10 h-10 object-cover rounded-[4px]" />
              <span className="text-m text-black flex-grow">{fileName}</span> 
              {/* Eye button - Afficher l'image */}
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={handleViewImage}
                title="Voir l'image"
                type="button"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.3139 14.0031C20.2175 14.0031 20.1209 14 20.024 14C19.927 14 19.8304 14.0031 19.734 14.0031C15.232 14.0031 10.6757 17.1762 9.19995 20C10.6757 22.8237 15.184 25.9969 19.686 25.9969C19.7824 25.9969 19.879 26 19.976 26C20.0729 26 20.1695 25.9969 20.2659 25.9969C24.7679 25.9969 29.3242 22.8237 30.8 20C29.3242 17.1762 24.8159 14.0031 20.3139 14.0031ZM19.9668 24.32C19.1124 24.32 18.2772 24.0666 17.5668 23.5919C16.8563 23.1173 16.3026 22.4426 15.9757 21.6532C15.6487 20.8638 15.5632 19.9952 15.7298 19.1572C15.8965 18.3192 16.308 17.5495 16.9121 16.9453C17.5163 16.3411 18.286 15.9297 19.124 15.763C19.962 15.5963 20.8306 15.6819 21.62 16.0088C22.4094 16.3358 23.0841 16.8895 23.5588 17.5999C24.0335 18.3104 24.2868 19.1456 24.2868 20C24.2868 21.1457 23.8317 22.2445 23.0215 23.0547C22.2114 23.8649 21.1126 24.32 19.9668 24.32ZM10.89 20.0009C11.6048 19.0026 12.7476 17.9829 14.08 17.1733C14.5132 16.91 14.9613 16.672 15.422 16.4606C14.6304 17.4761 14.202 18.7276 14.2054 20.0152C14.2088 21.3027 14.6437 22.552 15.4408 23.5632C14.9659 23.3466 14.5046 23.1014 14.0595 22.8288C12.7392 22.0214 11.6036 21.0016 10.89 20.0008L10.89 20.0009ZM25.92 22.8268C25.4545 23.11 24.9716 23.3637 24.4744 23.5865C25.2895 22.5636 25.7319 21.2935 25.7286 19.9855C25.7253 18.6774 25.2765 17.4096 24.4561 16.3908C24.9674 16.6184 25.4632 16.879 25.9406 17.1712C27.2608 17.9786 28.3964 18.9985 29.11 19.9993C28.3952 20.9975 27.2524 22.0171 25.92 22.8267L25.92 22.8268ZM22.3503 18.8757C22.3046 19.072 22.2084 19.253 22.0713 19.4008C21.9341 19.5485 21.7608 19.6579 21.5683 19.718C21.3759 19.7782 21.1712 19.787 20.9743 19.7437C20.7774 19.7004 20.5952 19.6064 20.4458 19.4711C20.2964 19.3357 20.185 19.1637 20.1225 18.972C20.06 18.7804 20.0487 18.5757 20.0896 18.3783C20.1306 18.1809 20.2223 17.9976 20.3559 17.8466C20.4894 17.6956 20.6601 17.5821 20.851 17.5173C20.2773 17.3131 19.6506 17.3141 19.0775 17.52C18.5044 17.7259 18.0204 18.1241 17.7079 18.6467C17.3953 19.1693 17.2736 19.784 17.3632 20.3863C17.4529 20.9886 17.7486 21.5412 18.1999 21.9501C18.6511 22.3589 19.2301 22.5988 19.8383 22.6288C20.4465 22.6588 21.0463 22.4771 21.5356 22.1146C22.0249 21.7522 22.3735 21.2313 22.5221 20.6408C22.6706 20.0503 22.6099 19.4265 22.3503 18.8757Z" fill="black"/>
                </svg>
              </button>
              {/* Download button - Télécharger l'image */}
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={handleDownloadImage}
                title="Télécharger l'image"
                type="button"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M27.2 21.8V27.2H12.8V21.8H9.79999V27.8C9.79999 29.1255 10.8745 30.2 12.2 30.2H27.8C29.1255 30.2 30.2 29.1255 30.2 27.8V21.8H27.2ZM23.6 18.8V11.6C23.6 11.1227 23.4103 10.6648 23.0728 10.3273C22.7352 9.98969 22.2774 9.80005 21.8 9.80005H18.2C17.2059 9.80005 16.4 10.6059 16.4 11.6V18.8H12.8L16.4 22.3756L19.0606 25.018C19.5733 25.5273 20.4266 25.5273 20.9394 25.018L23.6 22.3756L27.2 18.8H23.6Z" fill="black"/>
                </svg>
              </button>
              {/* Trash button */}
              <button 
                onClick={() => { setImage(null); setFileName(""); setFileObject(null); }} 
                className="text-gray-500 hover:text-gray-700"
                title="Supprimer l'image"
                type="button"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M26 11.5991H23V11C23 10.3373 22.4628 9.80005 21.8 9.80005H18.2C17.5373 9.80005 17 10.3373 17 11V11.5991H14C13.0059 11.5991 12.2 12.405 12.2 13.3991V14.6H27.8V13.3991C27.8 12.405 26.9941 11.5991 26 11.5991ZM18.2 11H21.8V11.5991H18.2V11ZM13.4 15.1991V30.2H26.6V15.1991H13.4ZM17 17.6V27.7968C17 27.7979 17 27.799 17 27.8C17 28.1314 16.7314 28.4 16.4 28.4C16.0686 28.4 15.8 28.1314 15.8 27.8C15.8 27.799 15.8 27.7979 15.8 27.7968V17.6C15.8 17.5997 15.8 17.5994 15.8 17.5991C15.8 17.2677 16.0686 16.9991 16.4 16.9991C16.7314 16.9991 17 17.2677 17 17.5991C17 17.5994 17 17.5997 17 17.6ZM20.6 17.6V27.7968C20.6 27.7979 20.6 27.7989 20.6 27.8C20.6 28.1314 20.3314 28.4 20 28.4C19.6686 28.4 19.4 28.1314 19.4 27.8C19.4 27.7989 19.4 27.7979 19.4 27.7968V17.6C19.4 17.5997 19.4 17.5994 19.4 17.5991C19.4 17.2677 19.6686 16.9991 20 16.9991C20.3314 16.9991 20.6 17.2677 20.6 17.5991C20.6 17.5994 20.6 17.5997 20.6 17.6ZM24.2 17.6V27.7968C24.2 27.7979 24.2 27.799 24.2 27.8C24.2 28.1314 23.9314 28.4 23.6 28.4C23.2686 28.4 23 28.1314 23 27.8C23 27.799 23 27.7979 23 27.7968V17.6C23 17.5997 23 17.5994 23 17.5991C23 17.2677 23.2686 16.9991 23.6 16.9991C23.9314 16.9991 24.2 17.2677 24.2 17.5991C24.2 17.5994 24.2 17.5997 24.2 17.6Z" fill="black"/>
                </svg>
              </button>
            </div>
        )}

        {/* Modal pour l'aperçu d'image en plein écran */}
        {showImagePreview && image && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative max-w-3xl max-h-3xl p-4">
              <button 
                className="absolute top-2 right-2 bg-white rounded-full p-1 text-black hover:bg-gray-200"
                onClick={() => setShowImagePreview(false)}
                type="button"
              >
                ✖
              </button>
              <img 
                src={image} 
                alt={fileName} 
                className="max-h-screen max-w-full object-contain" 
              />
            </div>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="border font-bold text-gray-500 px-6 py-2 rounded-[4px] text-sm hover:bg-gray-100"
            type="button"
          >
            Annuler
          </button>
          <button 
            className="bg-[#F16E00] font-bold text-white px-6 py-2 rounded-[4px] text-sm hover:bg-orange-600"
            onClick={handleSubmit}
            type="button"
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditFormation;