import * as React from "react";
import { BeneficiaireInscription } from '../types';
import { getFormationById } from '../../../services/formationService';

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const confirmedBeneficiaires = React.useMemo(() => {
    if (!beneficiairePreferences) return 0;
    
    return Object.values(beneficiairePreferences).filter(
      pref => pref.appel === true && pref.email === true
    ).length;
  }, [beneficiairePreferences]);

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case "En Cours":
        return "bg-blue-100 text-blue-700";
      case "Terminé":
        return "bg-green-100 text-green-700";
      case "Avenir":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p>{error}</p>
          </div>
          <button 
            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-150 ease-in-out"
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
    <div className="w-full bg-gray-50 px-4 py-3">
      <h2 className="text-xl font-bold mb-3 text-gray-800">
        {formationData?.nom || "Détails de la formation"}
      </h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-orange-100 mr-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Bénéficiaires Confirmés</div>
              <div className="text-xl font-semibold text-orange-500">{confirmedBeneficiaires}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center">
            <div className="rounded-full p-2 bg-orange-100 mr-3">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Inscrits</div>
              <div className="text-xl font-semibold text-orange-500">{inscriptions?.length || 0}</div>
            </div>
          </div>
        </div>
        
        {formationData?.status && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <div className="rounded-full p-2 bg-orange-100 mr-3">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Statut</div>
                <div className={`text-sm font-medium mt-1 px-2 py-1 rounded-full inline-block ${getStatusBadgeStyle(formationData.status)}`}>
                  {formationData.status}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Formation Information */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Informations de la formation</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Titre</h4>
              <p className="text-gray-800">{formationData?.nom || "-"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Formateur</h4>
              <p className="text-gray-800">
                {formationData?.formateur ? 
                  `${formationData.formateur.utilisateur.prenom} ${formationData.formateur.utilisateur.nom}` : 
                  "-"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Catégorie</h4>
              <p className="text-gray-800">{formationData?.categorie || "-"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Niveau</h4>
              <p className="text-gray-800">{formationData?.niveau || "-"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Date de début</h4>
              <p className="text-gray-800">{formatDate(formationData?.dateDebut || "")}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Date de fin</h4>
              <p className="text-gray-800">{formatDate(formationData?.dateFin || "")}</p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {formationData?.tags? 
                  formationData.tags.split(',').map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm">
                      {tag.trim()}
                    </span>
                  )) : 
                  <span className="text-gray-500">Aucun tag</span>
                }
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-2">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">
                {formationData?.description || "Aucune description disponible."}
              </p>
            </div>
          </div>
          
          {formationData?.lienInscription && (
            <div className="mt-4">
              <a 
                href={formationData.lienInscription} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-150 ease-in-out"
              >
                Lien d'inscription
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Formation Image */}
      {formationData?.image && !formationData.image.includes('undefined') && (
        <div className="mt-4 bg-white rounded-md shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Image de la formation</h3>
          </div>
          <div className="p-4">
            <div className="rounded-md overflow-hidden border border-gray-200">
              <img 
                src={formationData.image.replace('data:undefined;base64,', '')} 
                alt={formationData.nom} 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormStepFour;