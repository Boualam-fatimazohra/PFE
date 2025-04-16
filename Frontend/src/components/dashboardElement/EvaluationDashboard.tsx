import { useEffect, useState } from 'react';
import { Search, ChevronRight, ChevronLeft, Filter, Star, ChevronUp } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getEvaluationFormateur } from '@/services/evaluationService';
import { useAuth } from '@/contexts/AuthContext';

const EvaluationDashboard = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!isAuthenticated()) {
        setError("Vous devez être connecté pour voir vos évaluations.");
        setLoading(false);
        return;
      }
  
      try {
        // La fonction getEvaluationsByFormateur n'utilise pas de paramètre selon le service
        const data = await getEvaluationFormateur();
        setEvaluations(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || 'Erreur lors de la récupération des évaluations.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvaluations();
  }, [isAuthenticated]);
  
  // Rest of your component remains the same...

  // Fonction pour calculer les métriques
  const calculateMetrics = () => {
    if (!evaluations.length) return { averageScore: 0, totalEvaluations: 0, responseRate: 0, evaluatedTrainings: 0 };

    const totalEvaluations = evaluations.length;
    
    // Calcul du nombre de formations uniques évaluées
    const uniqueFormations = new Set(evaluations.map(evaluation => evaluation.formation));
    const evaluatedTrainings = uniqueFormations.size;

    // Exemple de calculs (à adapter selon votre structure de données réelle)
    let totalScore = 0;
    let scoreCount = 0;

    evaluations.forEach(evaluation => {
      if (evaluation.contentEvaluation) {
        if (evaluation.contentEvaluation.qualiteContenuFormation) {
          totalScore += parseFloat(evaluation.contentEvaluation.qualiteContenuFormation);
          scoreCount++;
        }
      }
    });

    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : "N/A";
    
    // Pour le taux de réponse, nous aurions besoin de plus d'informations
    // comme le nombre total de participants invités vs ceux qui ont répondu
    const responseRate = "87%"; // Valeur de placeholder pour l'instant

    return { averageScore, totalEvaluations, responseRate, evaluatedTrainings };
  };

  const { averageScore, totalEvaluations, responseRate, evaluatedTrainings } = calculateMetrics();

  // Filtrer les évaluations en fonction du terme de recherche
  const filteredEvaluations = evaluations.filter(evaluation => 
    evaluation.formationTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvaluations = filteredEvaluations.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formater la date - Mise à jour pour gérer différents formats de date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // Si la date est déjà au format français
    if (dateString.includes('/')) {
      return dateString; // On la retourne directement
    }
    
    // Pour les dates ISO ou autres formats
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Date invalide:", dateString);
        return "N/A";
      }
      
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return "N/A";
    }
  };

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 w-full md:w-11/12 p-4">
      {/* Top section with button */}
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-2xl font-bold">Évaluations</h2>
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
          onClick={() => navigate("/formateur/creatEvaluation")}
        >
          Créer une Évaluation
        </button>
      </div>

      {/* Key metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-yellow-100 p-2 rounded">
                <Star color="orange" size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note Moyenne Globale</p>
              <p className="text-2xl font-bold">{averageScore}/5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-orange-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 12h10" />
                  <path d="M12 7v10" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Évaluations</p>
              <p className="text-2xl font-bold">{totalEvaluations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-red-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux de Réponse</p>
              <p className="text-2xl font-bold">{responseRate}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-start">
            <div className="mr-4">
              <div className="bg-orange-100 p-2 rounded">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21v-2a7 7 0 0 0-14 0v2" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Formations Évaluées</p>
              <p className="text-2xl font-bold">{evaluatedTrainings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Distribution des Notes</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Graphique de progression
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-4">Évolution Mensuelle</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            Graphique de progression
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-medium mb-4">Listes des évaluations</h2>
        
        {/* Search and filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Recherche formations..."
              className="w-full pl-10 pr-4 py-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          
          <button className="border p-2 rounded">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="text-center py-6">
            <p>Chargement des évaluations...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="text-center py-6 text-red-500">
            <p>{error}</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && filteredEvaluations.length === 0 && (
          <div className="text-center py-6">
            <p>Aucune évaluation trouvée.</p>
          </div>
        )}
        
        {/* Table */}
        {!loading && !error && filteredEvaluations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-3 text-left">Titre Formation</th>
                  <th className="py-2 px-3 text-left">Date Fin Formation</th>
                  <th className="py-2 px-3 text-left">Participants</th>
                  <th className="py-2 px-3 text-left">Notes</th>
                  <th className="py-2 px-3 text-left">Satisfaction</th>
                  <th className="py-2 px-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEvaluations.map((evaluation) => {
                  // Calculer la note moyenne pour cette évaluation
                  let avgRating = "N/A";
                  if (evaluation.contentEvaluation) {
                    const ratings = [
                      evaluation.contentEvaluation.qualiteContenuFormation,
                      evaluation.contentEvaluation.utiliteCompetencesAcquises,
                      evaluation.contentEvaluation.alignementBesoinsProf
                    ].filter(Boolean).map(Number);
                    
                    if (ratings.length > 0) {
                      avgRating = (ratings.reduce((sum, val) => sum + val, 0) / ratings.length).toFixed(1) + "/5";
                    }
                  }
                  
                  // Calculer la satisfaction
                  let satisfaction = "N/A";
                  if (evaluation.recommandation) {
                    satisfaction = `${evaluation.recommandation}%`;
                  }
                  
                  // Récupérer le nombre de participants
                  const nombreParticipants = evaluation.beneficiaryIds?.length || evaluation.nombreParticipants || "N/A";
                  
                  return (
                    <tr key={evaluation._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-3 flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-xs">
                            {evaluation.formationTitle?.substring(0, 2).toUpperCase() || "??"}
                          </span>
                        </div>
                        <span className="text-sm">{evaluation.formationTitle || "Sans titre"}</span>
                      </td>
                      <td className="py-3 px-3 text-sm">{formatDate(evaluation.endDate || evaluation.dateFin)}</td>
                      <td className="py-3 px-3 text-sm">{nombreParticipants}</td>
                      <td className="py-3 px-3 text-sm">{avgRating}</td>
                      <td className="py-3 px-3 text-sm">{satisfaction}</td>
                      <td className="py-3 px-3">
                        <button 
                          className="bg-black text-white px-4 py-1 rounded text-xs"
                          onClick={() => navigate(`/formateur/evaluation/${evaluation._id}`)}
                        >
                          Analyser
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && filteredEvaluations.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <button 
              className="w-8 h-8 border rounded flex items-center justify-center mr-2"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(Math.min(totalPages, 3)).keys()].map((_, idx) => {
              // Afficher les 3 pages autour de la page courante
              let pageNum;
              if (totalPages <= 3) {
                pageNum = idx + 1;
              } else if (currentPage <= 2) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + idx;
              } else {
                pageNum = currentPage - 1 + idx;
              }
              
              return (
                <button 
                  key={pageNum}
                  className={`w-8 h-8 border rounded flex items-center justify-center mr-2 ${
                    currentPage === pageNum ? 'bg-black text-white' : ''
                  }`}
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="w-8 h-8 border rounded flex items-center justify-center"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Scroll to top button */}
      <div className="flex justify-center mt-4">
        <button 
          className="w-8 h-8 border rounded flex items-center justify-center"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
};

export default EvaluationDashboard;