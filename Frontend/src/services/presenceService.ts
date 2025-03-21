import axios from 'axios';
import apiClient from './apiClient';

// Interfaces pour les données de présence
interface PresenceData {
  beneficiareFormationId: string;
  isPresent: boolean;
}

interface PresenceRequest {
  jour: string | Date;
  periode: 'Matin' | 'apresMidi';
  presences: PresenceData[];
}

interface PresenceResult {
  beneficiareFormationId: string;
  success: boolean;
  message: string;
  presenceId?: string;
}

interface PresenceResponse {
  success: boolean;
  message: string;
  results: PresenceResult[];
}

/**
 * Enregistre les présences des bénéficiaires pour une date et période spécifiques
 * @param presenceData Les données de présence à enregistrer
 * @returns La réponse du serveur avec les résultats pour chaque bénéficiaire
 */
export const enregistrerPresences = async (presenceData: PresenceRequest): Promise<PresenceResponse> => {
  if (!presenceData.jour || !presenceData.periode || !presenceData.presences || presenceData.presences.length === 0) {
    throw new Error("Données de présence incomplètes");
  }
  try {
    const response = await apiClient.post('/presence/enregistrerPresence', presenceData);
    return response.data;
  } catch (error) {
    // Gestion des différents types d'erreurs
    if (axios.isAxiosError(error)) {
      // Erreurs HTTP spécifiques
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        switch (error.response.status) {
          case 400:
            throw new Error("Données de présence invalides: " + (error.response.data?.message || "Vérifiez le format des données"));
          case 401:
            throw new Error("Authentification requise pour enregistrer les présences");
          case 403:
            throw new Error("Vous n'êtes pas autorisé à enregistrer les présences. Rôle de formateur requis.");
          case 404:
            throw new Error("Ressource non trouvée: " + (error.response.data?.message || "La route ou la ressource demandée n'existe pas"));
          case 500:
            throw new Error("Erreur serveur: " + (error.response.data?.message || "Une erreur est survenue lors du traitement de votre demande"));
          default:
            throw new Error(error.response.data?.message || "Erreur lors de l'enregistrement des présences");
        }
      } else if (error.request) {
        // La requête a été faite mais pas de réponse reçue
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    
    // Autres types d'erreurs
    console.error("Erreur lors de l'enregistrement des présences:", error);
    throw new Error("Erreur inattendue lors de l'enregistrement des présences");
  }
};

/**
 * Récupère les présences pour une formation spécifique à une date donnée
 * @param formationId ID de la formation
 * @param date Date pour laquelle récupérer les présences
 * @returns Les données de présence pour la formation à la date spécifiée
 */
export const getPresencesByFormation = async (formationId: string, date: string | Date): Promise<any> => {
  if (!formationId) {
    throw new Error("ID de formation requis");
  }

  try {
    const response = await apiClient.get(`/presence/formation/${formationId}`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Requête invalide: " + (error.response.data?.message || "Vérifiez les paramètres"));
          case 401:
            throw new Error("Authentification requise pour accéder aux données de présence");
          case 403:
            throw new Error("Accès non autorisé aux données de présence");
          case 404:
            throw new Error("Données de présence non trouvées pour cette formation");
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la récupération des présences");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    
    console.error("Erreur lors de la récupération des présences:", error);
    throw new Error("Erreur inattendue lors de la récupération des présences");
  }
};

/**
 * Met à jour une présence spécifique
 * @param presenceId ID de la présence à mettre à jour
 * @param isPresent Nouvelle valeur de présence
 * @returns Les données de la présence mise à jour
 */
export const updatePresence = async (presenceId: string, isPresent: boolean): Promise<any> => {
  if (!presenceId) {
    throw new Error("ID de présence requis");
  }

  try {
    const response = await apiClient.patch(`/presence/${presenceId}`, { isPresent });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error("Données invalides: " + (error.response.data?.message || "Vérifiez les paramètres"));
          case 401:
            throw new Error("Authentification requise pour modifier la présence");
          case 403:
            throw new Error("Vous n'êtes pas autorisé à modifier cette présence");
          case 404:
            throw new Error("Présence non trouvée: " + (error.response.data?.message || "L'ID fourni n'existe pas"));
          default:
            throw new Error(error.response.data?.message || "Erreur lors de la mise à jour de la présence");
        }
      } else if (error.request) {
        throw new Error("Aucune réponse du serveur. Vérifiez votre connexion internet.");
      }
    }
    
    console.error("Erreur lors de la mise à jour de la présence:", error);
    throw new Error("Erreur inattendue lors de la mise à jour de la présence");
  }
};