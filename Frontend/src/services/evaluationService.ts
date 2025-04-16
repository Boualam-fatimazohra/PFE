// evaluationService.ts
/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import apiClient from './apiClient';

// Interfaces
interface Evaluation {
  _id?: string;
  formationTitle: string;
  formation: string;
  dateDebut?: string;
  dateFin?: string;
  formateur?: string;
  nombreParticipants?: number;
  parametres: {
    anonymousResponses: boolean;
    responseDeadline: boolean;
    responseDeadlineDate?: string | null;
  };
  statut: string;
  dateCreation: Date;
}

interface EvaluationResponse {
  message: string;
  evaluation: Evaluation;
}

// Créer une évaluation
// Dans evaluationService.ts
export const createEvaluation = async (
  evaluationData: {
    title: string;
    formationId: string;
    startDate?: string;
    endDate?: string;
    trainer?: string;
    participants?: number;
    anonymousResponses: boolean;
    responseDeadline: boolean;
    responseDeadlineDate?: string;
    beneficiaryIds: string[];
  }
): Promise<EvaluationResponse> => {
  try {
    // Format data consistently with backend expectations
    const formattedData = {
      title: evaluationData.title,
      formationId: evaluationData.formationId,
      startDate: evaluationData.startDate,
      endDate: evaluationData.endDate,
      dateFin: evaluationData.endDate, // ajouté
      trainer: evaluationData.trainer,
      participants: evaluationData.participants,
      nombreParticipants: evaluationData.participants, 
      anonymousResponses: evaluationData.anonymousResponses,
      responseDeadline: evaluationData.responseDeadline,
      responseDeadlineDate: evaluationData.responseDeadlineDate,
      beneficiaryIds: evaluationData.beneficiaryIds
    };
    
    console.log("Sending evaluation data:", formattedData);
    
    // Utilise apiClient qui inclut déjà les cookies avec le token
    const response = await apiClient.post(`/evaluation/CreatEvaluation`, formattedData);

    return response.data;
  } catch (error) {
    console.error("API error details:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Server response error:", error.response.data);
        switch (error.response.status) {
          case 400:
            throw new Error("Données d'évaluation invalides: " + (error.response.data?.message || "Veuillez vérifier les champs requis"));
          case 401:
            throw new Error("Non autorisé: Veuillez vous connecter pour créer une évaluation");
          case 500:
            throw new Error("Erreur serveur: " + (error.response.data?.message || "Une erreur s'est produite sur le serveur"));
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la création de l'évaluation");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    throw new Error("Erreur inattendue lors de la création de l'évaluation");
  }
};

// Récupérer toutes les évaluations
export const getAllEvaluations = async (): Promise<Evaluation[]> => {
  try {
    const response = await apiClient.get('/evaluation/AllEvaluation');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error("Erreur lors de la récupération des évaluations: " + (error.response.data?.message || ""));
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la récupération des évaluations:", error);
    throw new Error("Erreur inattendue lors de la récupération des évaluations");
  }
};

// Récupérer une évaluation par ID
export const getEvaluationById = async (evaluationId: string): Promise<Evaluation> => {
  if (!evaluationId) {
    throw new Error("ID d'évaluation requis");
  }
  
  try {
    const response = await apiClient.get(`/evaluation/${evaluationId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Évaluation non trouvée");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la récupération de l'évaluation");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la récupération de l'évaluation:", error);
    throw new Error("Erreur inattendue lors de la récupération de l'évaluation");
  }
};

// Mettre à jour une évaluation
export const updateEvaluation = async (evaluationId: string, evaluationData: Partial<Evaluation>): Promise<EvaluationResponse> => {
  if (!evaluationId) {
    throw new Error("ID d'évaluation requis");
  }
  
  try {
    const response = await apiClient.put(`/evaluation/${evaluationId}`, evaluationData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Données d'évaluation invalides: " + (error.response.data?.message || ""));
          case 404:
            throw new Error("Évaluation non trouvée");
          case 403:
            throw new Error("Accès non autorisé à cette évaluation");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la mise à jour de l'évaluation");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la mise à jour de l'évaluation:", error);
    throw new Error("Erreur inattendue lors de la mise à jour de l'évaluation");
  }
};

// Supprimer une évaluation
export const deleteEvaluation = async (evaluationId: string): Promise<{ message: string }> => {
  if (!evaluationId) {
    throw new Error("ID d'évaluation requis");
  }
  
  try {
    const response = await apiClient.delete(`/evaluation/${evaluationId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Évaluation non trouvée");
          case 403:
            throw new Error("Accès non autorisé à cette évaluation");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la suppression de l'évaluation");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la suppression de l'évaluation:", error);
    throw new Error("Erreur inattendue lors de la suppression de l'évaluation");
  }
};

// Récupérer les évaluations par formation
export const getEvaluationsByFormation = async (formationId: string): Promise<Evaluation[]> => {
  if (!formationId) {
    throw new Error("ID de formation requis");
  }
  
  try {
    const response = await apiClient.get(`/evaluation/formation/${formationId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Formation non trouvée");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la récupération des évaluations");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la récupération des évaluations par formation:", error);
    throw new Error("Erreur inattendue lors de la récupération des évaluations");
  }
};

// Envoyer une évaluation aux bénéficiaires
export const sendEvaluationFormation = async (beneficiaryIds: string[], formationId: string) => {
  try {
    // Utilisation de apiClient au lieu de apiCliente pour bénéficier de l'authentification par cookie
    const response = await apiClient.post('/evaluation/sendLinkToBeneficiare', { beneficiaryIds, formationId });
    return response.data;
  } catch (error) {
    console.error("Error d'envoi de lien d'évaluation:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Erreur lors de l'envoi des liens d'évaluation");
    }
    throw error;
  }
};

// Récupérer les statistiques des évaluations
export const getEvaluationStats = async (evaluationId: string): Promise<any> => {
  if (!evaluationId) {
    throw new Error("ID d'évaluation requis");
  }
  
  try {
    const response = await apiClient.get(`/evaluation/${evaluationId}/stats`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            throw new Error("Évaluation non trouvée");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la récupération des statistiques");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    console.error("Erreur lors de la récupération des statistiques d'évaluation:", error);
    throw new Error("Erreur inattendue lors de la récupération des statistiques");
  }
};



export const getEvaluationFormateur = async () => {
  try {
    // Correction du double slash dans l'URL
    const response = await apiClient.get('/evaluation/getEvaluationFormateur');
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }
};
