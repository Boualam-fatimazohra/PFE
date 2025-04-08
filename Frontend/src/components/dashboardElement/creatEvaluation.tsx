import { useState, useEffect } from 'react';
import { Calendar, Eye, Lock, Plus, Check, X, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormations } from '@/contexts/FormationContext';
import { getAllFormations } from '@/services/formationService';
import { getBeneficiaireFormation } from '@/services/formationService'; // Importez la fonction

const CreateEvaluationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Pour récupérer l'ID de la formation depuis l'URL
  const [user, setUser] = useState(null);
  
  // State pour gérer les étapes
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "", 
    trainer: "",
    participants: "", // Nombre de participants sera stocké ici
    anonymousResponses: true,
    responseDeadline: false,
  });

  const [participants, setParticipants] = useState([]);
  
  // Récupérer l'utilisateur depuis localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUser({
          nom: userData.nom || "",
          prenom: userData.prenom || "",
          role: userData.role || "Formateur"
        });
      } catch (error) {
        console.error("Erreur lors du parsing de user depuis localStorage", error);
        setUser(null);
      }
    } else {
      console.warn("Aucun utilisateur trouvé dans localStorage");
      setUser(null);
    }
  }, []);
  
  // Utiliser le contexte des formations
  const { formations: contextFormations, loading: formationsLoading, getBeneficiaireFormation } = useFormations();

  // Vérifier si nous avons des formations à afficher
  const hasFormations = contextFormations && contextFormations.length > 0;

  // Formater une date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Fonction pour récupérer les bénéficiaires et mettre à jour le nombre de participants
  const fetchBeneficiaires = async (formationId) => {
    try {
      setLoading(true);
      console.log("Récupération des bénéficiaires pour la formation ID:", formationId);
      
      // Utiliser la fonction du contexte pour récupérer les bénéficiaires
      const beneficiaires = await getBeneficiaireFormation(formationId);
      
      console.log("Bénéficiaires récupérés:", beneficiaires);
      
      // Vérifier que les bénéficiaires sont sous forme de tableau
      if (beneficiaires && Array.isArray(beneficiaires)) {
        // Mettre à jour le nombre de participants
        setFormData(prevData => ({
          ...prevData,
          participants: beneficiaires.length.toString()
        }));
        
        // Formatter les participants pour l'affichage
        if (beneficiaires.length > 0) {
          const formattedParticipants = beneficiaires.map(b => ({
            id: b._id,
            date: new Date().toLocaleDateString('fr-FR'),
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            nom: b.beneficiaire?.nom || '',
            prenom: b.beneficiaire?.prenom || '',
            email: b.beneficiaire?.email || '',
            genre: b.beneficiaire?.genre || '',
            telephone: b.beneficiaire?.telephone || '',
            confTel: b.confirmationAppel || false,
            confEmail: b.confirmationEmail || false
          }));
          
          setParticipants(formattedParticipants);
          console.log("Participants formatés:", formattedParticipants);
        } else {
          setParticipants([]);
          console.log("Aucun bénéficiaire trouvé pour cette formation");
        }
      } else {
        console.error("Les bénéficiaires récupérés ne sont pas un tableau:", beneficiaires);
        setParticipants([]);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des bénéficiaires:", err);
      setParticipants([]);
      // Set participants to 0 in case of error
      setFormData(prevData => ({
        ...prevData,
        participants: "0"
      }));
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les données de la formation
  useEffect(() => {
    const fetchFormationData = async () => {
      try {
        setLoading(true);
        // Vérifier si un ID est présent dans l'URL
        const formationId = id;
        
        if (formationId) {
          // Récupérer les détails de la formation
          const formationDetails = await getAllFormations();
          
          // Mettre à jour le state avec les données récupérées
          setFormData({
            title: formationDetails.nom || "Formation sans titre",
            startDate: formatDate(formationDetails.dateDebut) || "",
            endDate: formatDate(formationDetails.dateFin) || "",
            trainer: formationDetails.formateur?.nom || "",
            participants: "0", // Initialisé à 0, sera mis à jour après récupération des bénéficiaires
            anonymousResponses: true, // valeur par défaut
            responseDeadline: false, // valeur par défaut
          });
          console.log("Formation details received:", formationDetails);

          // Récupérer la liste des participants et mettre à jour le nombre
          await fetchBeneficiaires(formationId);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de la formation:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchFormationData();
  }, [id]);

  // Gérer le changement de formation sélectionnée
  const handleFormationChange = async (formationTitle) => {
    try {
      // Trouver la formation correspondante dans le contexte
      const selectedFormation = contextFormations.find(f => f.nom === formationTitle);
      
      if (selectedFormation) {
        // Mettre à jour les champs du formulaire avec les données de la formation sélectionnée
        setFormData({
          ...formData,
          title: formationTitle,
          startDate: formatDate(selectedFormation.dateDebut) || "",
          endDate: formatDate(selectedFormation.dateFin) || "",
          participants: "0" // Sera mis à jour après récupération des bénéficiaires
        });
        
        // Si la formation a un ID, récupérer également les participants
        if (selectedFormation._id) {
          await fetchBeneficiaires(selectedFormation._id);
        }
      }
    } catch (err) {
      console.error("Erreur lors du changement de formation:", err);
    }
  };

  // Gérer le changement d'étape
  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis', formData);
    // Ici vous pourriez ajouter la logique pour envoyer les données au serveur
    navigate('/formateur/EvaluationDashboard');
  };
  
  const handleBack = () => {
    // Redirection vers la page /formateur/dahbordevaluation
    navigate('/formateur/EvaluationDashboard');
  };
  
  // Afficher un état de chargement si les données sont en cours de chargement
  if (loading || formationsLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  // Afficher une erreur si le chargement a échoué
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Afficher un message si aucune formation n'est trouvée et qu'il n'y a pas d'ID dans l'URL
  if (!hasFormations && !id) {
    return <div className="text-center py-4 text-gray-500">Aucune formation disponible pour créer une évaluation</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white">
      {/* En-tête avec bouton Retour et titre */}
      <div className="flex flex-col pb-2 mb-4">
        <button  
          type="button" 
          className="text-black text-lg font-bold flex items-center mb-2"
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M10.6664 3.65625L5.21137 9L10.6664 14.3437L12.225 12.8177L8.32777 9L12.225 5.1838L10.6664 3.65625Z" fill="#F16E00"/>
          </svg>
          Retour
        </button>

        <h5 className="text-2xl font-extrabold text-gray-800">Créer une Nouvelle Évaluation</h5>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Étape 1 : Informations de la formation */}
        {step === 1 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4">Informations de la Formation</h2>
              
              <div className="p-4">
                {/* Titre de la formation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Titre de la formation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-8"
                      value={formData.title}
                      onChange={(e) => {
                        const selectedTitle = e.target.value;
                        setFormData({...formData, title: selectedTitle});
                        handleFormationChange(selectedTitle);
                      }}
                    >
                      <option value="">Sélectionnez une formation</option>
                      
                      {/* Afficher toutes les formations du contexte */}
                      {contextFormations && contextFormations.map((formation) => (
                        <option key={formation._id || formation._id} value={formation.nom || formation.nom}>
                          {formation.nom || formation.nom}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Dates de formation */}
                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Date début formation
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded pl-10" 
                        value={formData.startDate}
                        readOnly
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Date fin formation
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded pl-10" 
                        value={formData.endDate}
                        readOnly
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formateur */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Formateur
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded" 
                    placeholder="Nom du formateur"
                    value={user ? `${user.nom} ${user.prenom}` : ""}
                    readOnly
                  />
                </div>

                {/* Nombre de participants */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Nombre de participants
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded" 
                    placeholder="0"
                    value={formData.participants}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Paramètres de l'évaluation */}
            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4">Paramètres de l'Évaluation</h2>
              
              <div className="p-4">
                {/* Anonymat des réponses */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 mr-3">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Anonymat des réponses</p>
                      <p className="text-sm text-gray-500">Les participants ne seront pas identifiés</p>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.anonymousResponses}
                        onChange={() => setFormData({...formData, anonymousResponses: !formData.anonymousResponses})}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Date limite de réponse */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 mr-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Date limite de réponse</p>
                      <p className="text-sm text-gray-500">Définir une date limite pour les réponses</p>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.responseDeadline}
                        onChange={() => setFormData({...formData, responseDeadline: !formData.responseDeadline})}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Questionnaire d'évaluation */}
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <h2 className="font-medium">Questionnaire d'Évaluation</h2>
                <div className="flex items-center">
                  <button type="button" className="mr-2 text-gray-500">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button type="button" className="text-gray-500">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Boutons navigation */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded border"
                onClick={handleBack}
              >
                Retour
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-orange-500 text-white rounded"
                onClick={handleNext}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Liste des participants */}
        {step === 2 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="font-medium">Listes des Participants</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 w-8">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="p-3 text-sm font-medium">Date & Heure</th>
                      <th className="p-3 text-sm font-medium">Nom</th>
                      <th className="p-3 text-sm font-medium">Prénom</th>
                      <th className="p-3 text-sm font-medium">Email</th>
                      <th className="p-3 text-sm font-medium">Genre</th>
                      <th className="p-3 text-sm font-medium">Téléphone</th>
                      <th className="p-3 text-sm font-medium">Conf Tél</th>
                      <th className="p-3 text-sm font-medium">Conf Email</th>
                      <th className="p-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.length > 0 ? (
                      participants.map((participant) => (
                        <tr key={participant.id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{participant.date}</div>
                            <div className="text-xs text-gray-500">{participant.time}</div>
                          </td>
                          <td className="p-3 text-sm">{participant.nom}</td>
                          <td className="p-3 text-sm">{participant.prenom}</td>
                          <td className="p-3 text-sm">{participant.email}</td>
                          <td className="p-3 text-sm">{participant.genre}</td>
                          <td className="p-3 text-sm">{participant.telephone}</td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${participant.confTel ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {participant.confTel ? 'Confirmé ' : 'En cours '}
                              {participant.confTel ? <Check className="h-3 w-3 ml-1" /> : <X className="h-3 w-3 ml-1" />}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${participant.confEmail ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {participant.confEmail ? 'Confirmé ' : 'En cours '}
                              {participant.confEmail ? <Check className="h-3 w-3 ml-1" /> : <X className="h-3 w-3 ml-1" />}
                            </span>
                          </td>
                          <td className="p-3">
                            <button type="button" className="text-gray-400 hover:text-gray-600">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td  className="p-3 text-center text-gray-500">
                          Aucun participant trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Zone vide pour indiquer que le tableau peut contenir plus d'entrées */}
              {participants.length === 0 && <div className="min-h-12"></div>}
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded border"
                onClick={handlePrevious}
              >
                Retour
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateEvaluationForm;