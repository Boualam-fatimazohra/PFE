import * as React from "react";
import { BeneficiaireInscription } from '../types';
import { getFormationById } from '../../../services/formationService'; // Import your API service

// Interface pour la structure de données de l'API
interface FormationResponse {
  _id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  lienInscription: string;
  status: string;
  tags: string;
  formateur: {
    _id: string;
    utilisateur: {
      _id: string;
      nom: string;
      prenom: string;
      email: string;
      role: string;
    };
  };
  categorie: string;
  niveau: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface FormStepFourProps {
  formationId?: string | null;
  inscriptions?: BeneficiaireInscription[];
  beneficiairePreferences?: Record<string, any>;
}

const FormStepFour: React.FC<FormStepFourProps> = ({
  formationId,
  inscriptions,
  beneficiairePreferences
}) => {
  const [formationData, setFormationData] = React.useState<FormationResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch formation data using the API
  React.useEffect(() => {
    const fetchFormationData = async () => {
      if (!formationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getFormationById(formationId);
        setFormationData(data);
        setError(null);
      } catch (err) {
        setError("Impossible de récupérer les informations de la formation.");
        console.error("Error fetching formation:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormationData();
  }, [formationId]);

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Calcul du nombre de bénéficiaires confirmés (téléphone ET email)
  const confirmedBeneficiaires = React.useMemo(() => {
    if (!beneficiairePreferences) return 0;
    
    // Compte les bénéficiaires qui ont appel=true ET email=true
    return Object.values(beneficiairePreferences).filter(
      pref => pref.appel === true && pref.email === true
    ).length;
  }, [beneficiairePreferences]);

  // Helper pour obtenir la couleur du badge selon le statut
  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case "En Cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Terminé":
        return "bg-green-100 text-green-800 border-green-200";
      case "Avenir":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="font-medium">{error}</p>
          </div>
          <button 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out shadow-sm"
            onClick={() => getFormationById(formationId || "")
              .then(data => {
                setFormationData(data);
                setError(null);
              })
              .catch(err => console.error("Error retrying:", err))
            }
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
          {formationData?.nom || "Chargement..."}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                Bénéficiaires Confirmés
              </span>
              <span className="text-3xl font-bold text-blue-600">
                {confirmedBeneficiaires}
              </span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                Total Inscrits
              </span>
              <span className="text-3xl font-bold text-blue-600">
                {inscriptions?.length || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-xl text-gray-800">Informations de la formation</h3>
              {formationData?.status && (
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(formationData.status)}`}>
                  {formationData.status}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Titre</p>
                  <p className="text-gray-800 font-medium">{formationData?.nom || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ID Formation</p>
                  <p className="text-gray-800 font-mono text-sm bg-gray-50 p-1 rounded">{formationData?._id || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Catégorie</p>
                  <p className="text-gray-800">{formationData?.categorie || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Niveau</p>
                  <p className="text-gray-800">{formationData?.niveau || "-"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date de début</p>
                  <p className="text-gray-800">{formatDate(formationData?.dateDebut || "")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date de fin</p>
                  <p className="text-gray-800">{formatDate(formationData?.dateFin || "")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tags</p>
                  <p className="text-gray-800">{formationData?.tags || "Aucun"}</p>
                </div>
                {formationData?.formateur && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Formateur</p>
                    <p className="text-gray-800 font-medium">
                      {formationData.formateur.utilisateur.prenom} {formationData.formateur.utilisateur.nom}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <p className="text-gray-700 leading-relaxed">{formationData?.description || "Aucune description disponible."}</p>
              </div>
            </div>
            
            {formationData?.lienInscription && (
              <div className="mt-6">
                <a 
                  href={formationData.lienInscription} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm"
                >
                  Lien d'inscription
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            )}
            
            {formationData?.image && !formationData.image.includes('undefined') && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Image</p>
                <div className="rounded-lg overflow-hidden border border-gray-200 max-w-md">
                  <img 
                    src={formationData.image.replace('data:undefined;base64,', '')} 
                    alt={formationData.nom} 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStepFour;