import { useState, useEffect } from 'react';
import { Calendar, Eye, Lock, Plus, Check, X, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormations } from '@/contexts/FormationContext';
import { getAllFormations } from '@/services/formationService';
import * as React from "react";
import { sendEvaluationFormation } from "@/services/formationService";
import axios from "axios";
import { createEvaluation } from '@/services/evaluationService';
import { useAuth } from '@/contexts/AuthContext'; // adapte le chemin


// Types
interface Beneficiaire {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  pays: string;
  specialite: string;
  etablissement: string;
  profession: string;
  isBlack: boolean;
  isSaturate: boolean;
  dateNaissance?: string;
  telephone?: string;
  niveau?: string;
  situationProfessionnel?: string;
  nationalite?: string;
  region?: string;
  categorieAge?: string;
}

interface BeneficiaireInscription {
  _id: string;
  confirmationAppel: boolean;
  confirmationEmail: boolean;
  horodateur: string;
  formation: string;
  beneficiaire: Beneficiaire;
}

interface FormationItem {
  id: string;
  title: string;
  status: "En Cours" | "Terminé" | "Avenir" | "Replanifier";
  image: string|File;
  dateDebut: string;
  dateFin?: string;
  dateCreated?: string;
  isDraft?: boolean;
  currentStep?: number;
}

interface ParticipantData {
  _id: string;
  dateNaissance: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  telephone: string;
  confTel: boolean;
  confEmail: boolean;
}

const CreateEvaluationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token  = useAuth(); // Move this here, at the top level

  const [user, setUser] = useState<{ nom: string; prenom: string; role: string } | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [sendingLinks, setSendingLinks] = useState(false);
  const [search, setSearch] = React.useState("");
  const [selectAll, setSelectAll] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 11;
  
  const { getBeneficiaireFormation } = useFormations();  
  const { formations: contextFormations, loading: formationsLoading } = useFormations();

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "", 
    trainer: "",
    participants: "0",
    anonymousResponses: true,
    responseDeadline: false,
  });
  
  const [participants, setParticipants] = useState<ParticipantData[]>([]);
  const [formationId, setFormationId] = useState<string | null>(null);

  const filteredParticipants = participants.filter(p =>
    p.nom?.toLowerCase().includes(search.toLowerCase()) ||
    p.prenom?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedParticipants = filteredParticipants.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const handleSendLinks = async () => {
    if (selectedParticipants.length === 0) {
      alert("Veuillez sélectionner au moins un bénéficiaire");
      return;
    }
    
    try {
      setSendingLinks(true);
      // Utilisation de _id comme dans EvaluationPage
      const response = await sendEvaluationFormation(selectedParticipants, formationId);      
      alert(`Liens d'évaluation envoyés avec succès à ${selectedParticipants.length} bénéficiaires`);
      
      setSelectedParticipants([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi des liens d'évaluation:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          alert("Erreur: Le point d'accès API pour l'envoi des liens d'évaluation n'existe pas. Veuillez contacter l'administrateur.");
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          alert("Erreur: Vous n'êtes pas autorisé à effectuer cette action.");
        } else if (error.response?.data?.message) {
          alert(`Erreur: ${error.response.data.message}`);
        } else {
          alert(`Erreur lors de l'envoi des liens d'évaluation: ${error.message}`);
        }
      } else {
        alert("Une erreur inattendue est survenue lors de l'envoi des liens d'évaluation");
      }
    } finally {
      setSendingLinks(false);
    }
  };

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

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "";
    
    try {
      // Si la date est déjà au format français (DD/MM/YYYY), la convertir
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`; // Retourne tel quel pour l'affichage
      }
      
      // Pour les autres formats (Date JS ou ISO)
      const date = dateString instanceof Date ? dateString : new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Date invalide:", dateString);
        return "";
      }
  
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Erreur de formatage de date:", e, dateString);
      return "";
    }
  };
  const convertToISODate = (dateString: string) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const fetchBeneficiaires = async (formationId: string) => {
    if (!formationId) {
      console.warn("ID de formation non fourni pour récupérer les bénéficiaires");
      return;
    }
    
    try {
      setLoading(true);
      
      const inscriptions = await getBeneficiaireFormation(formationId);
      
      if (inscriptions && Array.isArray(inscriptions)) {
        setFormData(prevData => ({
          ...prevData,
          participants: inscriptions.length.toString()
        }));
        
        if (inscriptions.length > 0) {
          const formattedParticipants = inscriptions.map((inscription: BeneficiaireInscription) => {
            const b = inscription.beneficiaire;
            return {
              _id: b._id, // Utilisation de _id comme dans EvaluationPage
              dateNaissance: b.dateNaissance || '',
              nom: b.nom || '',
              prenom: b.prenom || '',
              email: b.email || '',
              genre: b.genre || '',
              telephone: b.telephone?.toString() || '',
              confTel: inscription.confirmationAppel || false,
              confEmail: inscription.confirmationEmail || false
            };
          });
          
          setParticipants(formattedParticipants);
        } else {
          setParticipants([]);
        }
      } else {
        console.error("Les inscriptions récupérées ne sont pas un tableau:", inscriptions);
        setParticipants([]);
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des bénéficiaires:", err);
      setParticipants([]);
      setFormData(prevData => ({
        ...prevData,
        participants: "0"
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFormationData = async () => {
      try {
        setLoading(true);
        const formationId = id;
        
        if (formationId) {
          setFormationId(formationId);
          
          const formations = await getAllFormations();
          const formationDetails = formations.find(formation => formation._id === formationId);
          
          if (formationDetails) {
            setFormData(prevData => ({
              ...prevData,
              title: formationDetails.nom || "Formation sans titre",
              startDate: formationDetails.dateDebut ? formatDate(formationDetails.dateDebut) : "",
              endDate: formationDetails.dateFin ? formatDate(formationDetails.dateFin) : "",
              trainer: formationDetails.formateur?.nom || "",
              participants: "0",
            }));

            await fetchBeneficiaires(formationId);
          } else {
            setError("Formation non trouvée avec l'ID: " + formationId);
          }
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données de la formation:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchFormationData();
  }, [id, getBeneficiaireFormation]);

  const handleFormationChange = async (formationTitle: string) => {
    try {
      if (!formationTitle) return;
      
      const selectedFormation = contextFormations.find(f => f.nom === formationTitle);
      
      if (selectedFormation) {
        setFormationId(selectedFormation._id);
        
        setFormData(prevState => ({
          ...prevState,
          title: formationTitle,
          startDate: selectedFormation.dateDebut ? formatDate(selectedFormation.dateDebut) : "",
          endDate: selectedFormation.dateFin ? formatDate(selectedFormation.dateFin) : "",
          participants: "0"
        }));
        
        if (selectedFormation._id) {
          await fetchBeneficiaires(selectedFormation._id);
        }
      }
    } catch (err) {
      console.error("Erreur lors du changement de formation:", err);
      setError("Erreur lors du chargement des détails de la formation");
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.title) {
      alert("Veuillez sélectionner une formation avant de continuer.");
      return;
    }
    
    setStep(step + 1);
  };
  
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Dans votre composant creatEvaluation.tsx
  // In your CreateEvaluationForm component

// Dans le handleSubmit de CreateEvaluationForm.tsx, remplacez la portion existante par ce code:

// Dans CreateEvaluationForm.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    
    // Vérifier si des bénéficiaires sont sélectionnés
    if (selectedParticipants.length === 0) {
      // Vous pouvez soit afficher un avertissement
      const confirmSend = window.confirm("Aucun bénéficiaire sélectionné. Voulez-vous tout de même créer l'évaluation?");
      if (!confirmSend) {
        setLoading(false);
        return;
      }
    }
    // Convertir les dates au format ISO avant envoi
    const isoStartDate = convertToISODate(formData.startDate);
    const isoEndDate = convertToISODate(formData.endDate);
   
    const evaluationData = {
      title: formData.title,
      formationId: formationId || '',
      startDate: isoStartDate,
      endDate: isoEndDate,
      dateFin: isoEndDate,
      trainer: user ? `${user.nom} ${user.prenom}` : '',
      participants: parseInt(formData.participants, 10) || 0,
      nombreParticipants: selectedParticipants.length || parseInt(formData.participants, 10) || 0,
      anonymousResponses: formData.anonymousResponses,
      responseDeadline: formData.responseDeadline,
      responseDeadlineDate: formData.responseDeadline ? 
        new Date(isoEndDate).toISOString() : undefined,
      beneficiaryIds: selectedParticipants
    };

    console.log("Submitting evaluation data:", evaluationData);

    // Ne pas passer le token comme second argument
    const response = await createEvaluation(evaluationData);
    console.log("Evaluation created successfully:", response);
    
    alert("Évaluation créée avec succès!");
    navigate('/formateur/EvaluationDashboard');
  } catch (error) {
    console.error("Submission error:", error);
    setError(error instanceof Error ? error.message : "Une erreur inattendue s'est produite");
    alert(`Erreur: ${error instanceof Error ? error.message : "Une erreur inattendue s'est produite"}`);
  } finally {
    setLoading(false);
  }
};

  
  const handleBack = () => {
    navigate('/formateur/EvaluationDashboard');
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      // Utilisation de _id comme dans EvaluationPage
      const allIds = participants.map(participant => participant._id);
      setSelectedParticipants(allIds);
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectParticipant = (id: string) => {
    const isSelected = selectedParticipants.includes(id);
    
    if (isSelected) {
      setSelectedParticipants(selectedParticipants.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
      
      if (selectedParticipants.length + 1 === participants.length) {
        setSelectAll(true);
      }
    }
  };
  
  if (loading || formationsLoading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!contextFormations && !id) {
    return <div className="text-center py-4 text-gray-500">Aucune formation disponible pour créer une évaluation</div>;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white">
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
        {step === 1 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4">Informations de la Formation</h2>
              
              <div className="p-4">
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
                      required
                    >
                      <option value="">Sélectionnez une formation</option>
                      {contextFormations && contextFormations.map((formation) => (
                        <option key={formation._id} value={formation.nom}>
                          {formation.nom}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

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

            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4">Paramètres de l'Évaluation</h2>
              
              <div className="p-4">
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

        {step === 2 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <h2 className="font-medium">Listes des Participants</h2>
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleSendLinks}
                  disabled={sendingLinks || selectedParticipants.length === 0}
                >
                  {sendingLinks ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="white"/>
                      </svg>
                      Envoyer le lien ({selectedParticipants.length})
                    </>
                  )}
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 w-8">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
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
                    {displayedParticipants.length > 0 ? (
                      displayedParticipants.map((participant) => (
                        <tr key={participant._id} className="hover:bg-gray-50">
                          <td className="p-3">
                            <input 
                              type="checkbox" 
                              className="rounded"
                              checked={selectedParticipants.includes(participant._id)}
                              onChange={() => handleSelectParticipant(participant._id)}
                            />
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{participant.dateNaissance || '-'}</div>
                          </td>
                          <td className="p-3 text-sm">{participant.nom || '-'}</td>
                          <td className="p-3 text-sm">{participant.prenom || '-'}</td>
                          <td className="p-3 text-sm">{participant.email || '-'}</td>
                          <td className="p-3 text-sm">{participant.genre || '-'}</td>
                          <td className="p-3 text-sm">{participant.telephone || '-'}</td>
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
                        <td colSpan={10} className="p-3 text-center text-gray-500">
                          Aucun participant trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-500">
                    Affichage de {startIndex + 1} à {Math.min(endIndex, filteredParticipants.length)} sur {filteredParticipants.length} participants
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded ${currentPage === page ? 'bg-orange-500 text-white border-orange-500' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>

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