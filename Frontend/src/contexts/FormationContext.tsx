import axios from 'axios';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllFormations as fetchFormations, createFormation as addFormation } from '../services/formationService';
import { deleteFormation as apiDeleteFormation, updateFormation as ipUpdateFormation } from '../services/formationService';
import { getNbrBeneficiairesParFormateur, getBeneficiaireFormation as fetchBeneficiaires, createFormationDraft as createFormationDraftService } from "../services/formationService";
import { getAllFormationsManager as fetchAuthenticatedFormations } from "../services/formationService";
import { Formation, FormationResponse } from '@/components/formation-modal/types';

interface Beneficiaire {
  _id?: string;
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
  telephone?: number;
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
  formation: string;
  beneficiaire: Beneficiaire;
}

interface FormationContextType {
  formations: Formation[];
  filteredFormations: Formation[];
  loading: boolean;
  error: string | null;
  addNewFormation: (formationData: Formation) => Promise<void>;
  deleteFormation: (id: string) => Promise<void>;
  updateFormation: (id: string, formationData: Partial<Formation>) => Promise<void>;
  refreshFormations: () => Promise<void>;
  searchFormations: (query: string) => void;
  nombreBeneficiaires: number | null; 
  getBeneficiaireFormation: (formationId: string) => Promise<BeneficiaireInscription[]>;
  createFormationDraft: (formationData: Formation) => Promise<FormationResponse>;
  sendEvaluationFormation: (beneficiaryIds: string[], formationId: string) => Promise<any>;
  getAllFormationsManager: () => Promise<Formation[]>;
}

interface FormationProviderProps {
  children: ReactNode;
}

const FormationContext = createContext<FormationContextType | undefined>(undefined);

export const FormationProvider: React.FC<FormationProviderProps> = ({ children }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nombreBeneficiaires, setNombreBeneficiaires] = useState<number | null>(null);
  
  const fetchNombreBeneficiaires = async () => {
    try {
      setError(null);
      const data = await getNbrBeneficiairesParFormateur();
      setNombreBeneficiaires(data.nombreBeneficiaires);
      return data.nombreBeneficiaires;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la récupération du nombre de bénéficiaires";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const getFormations = async () => {
      try {
        setLoading(true);
        
        // Chargement parallèle des formations et du nombre de bénéficiaires
        const [formationsData, beneficiairesData] = await Promise.all([
          fetchFormations(),
          getNbrBeneficiairesParFormateur()
        ]);
        
        setFormations(formationsData);
        console.log("formation de contexte", formationsData);
        setNombreBeneficiaires(beneficiairesData.nombreBeneficiaires);
        setFilteredFormations(formationsData);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };

    getFormations();
  }, []);

  const refreshFormations = async () => {
    setLoading(true);
    try {
      const data = await fetchFormations();
      setFormations(data);
      setFilteredFormations(data);
      setError(null);
      return data;
    } catch (error) {
      setError('Failed to refresh formations');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addNewFormation = async (formationData: Formation) => {
    try {
      setError(null);
      const response = await addFormation(formationData);
      setFormations((prevFormations) => [...prevFormations, response.formation]);
      setFilteredFormations((prevFiltered) => [...prevFiltered, response.formation]);
      return response.formation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'ajout de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' }
  });

  // Fonction pour envoyer les liens d'évaluation aux bénéficiaires
  const apiSendEvaluationFormation = async (beneficiaryIds: string[], formationId: string) => {
    try {
      const response = await apiClient.post('/api/evaluation/sendLinkToBeneficiare', { beneficiaryIds, formationId });
      return response.data;
    } catch (error) {
      // Si l'endpoint n'existe pas (404), utiliser la logique de mock pour le développement
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('Endpoint not found, using mock response for development');
        
        // Logique de mock qui peut être utilisée pendant le développement
        return {
          success: true,
          message: `Successfully sent evaluation links to ${beneficiaryIds.length} beneficiaries (mock response)`,
          sentTo: beneficiaryIds
        };
      }
      
      // Si c'est une autre erreur, la propager
      throw error;
    }
  };

  const deleteFormation = async (id: string) => {
    try {
      setError(null);
      await apiDeleteFormation(id);
      
      setFormations((prevFormations) => 
        prevFormations.filter((formation) => formation._id !== id)
      );
      setFilteredFormations((prevFiltered) => 
        prevFiltered.filter((formation) => formation._id !== id)
      );
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la suppression de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const updateFormation = async (id: string, formationData: Partial<Formation>) => {
    try {
      setError(null);
      const updatedFormation = await ipUpdateFormation(id, formationData);
      
      const updateFormationInList = (formationsList: Formation[]) =>
        formationsList.map((formation) => 
          formation._id === id ? { ...formation, ...updatedFormation } : formation
        );
      
      setFormations(updateFormationInList);
      setFilteredFormations(updateFormationInList);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la mise à jour de la formation";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const searchFormations = (query: string) => {
    if (!query.trim()) {
      setFilteredFormations(formations);
      return;
    }

    const results = formations.filter(formation => 
      formation.nom.toLowerCase().includes(query.toLowerCase()) ||
      (formation.status && formation.status.toLowerCase().includes(query.toLowerCase())) ||
      (formation.tags && formation.tags.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredFormations(results);
  };

  const getBeneficiaireFormation = async (id: string): Promise<BeneficiaireInscription[]> => {
    try {
      console.log("Récupération des bénéficiaires pour la formation:", id);
      return await fetchBeneficiaires(id);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la récupération des bénéficiaires";
      setError(errorMessage);
      throw error;
    }
  };
  
  const getAllFormationsManager = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAuthenticatedFormations();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de la récupération des formations authentifiées";
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createFormationDraft = async (formationData: Formation): Promise<FormationResponse> => {
    try {
      setError(null);
      const newDraft = await createFormationDraftService(formationData);
      
      // Add the new formation to the state only if it has 'data'
      if (newDraft && newDraft.data) {
        // Add isDraft property to the formation data before adding it to the state
        const formationWithDraft = {
          ...newDraft.data,
          isDraft: true,  // Set this explicitly
          currentStep: 2
        };
        
        // Update both formations and filteredFormations with the new draft
        setFormations(prev => [...prev, formationWithDraft]);
        setFilteredFormations(prev => [...prev, formationWithDraft]);
        
        console.log("formation Draft added to state:", formationWithDraft);
      }
      
      return newDraft;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la création du brouillon";
      
      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  const sendEvaluationFormation = async (beneficiaryIds: string[], formationId: string) => {
    try {
      setError(null);
      const response = await apiSendEvaluationFormation(beneficiaryIds, formationId);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de l'envoi des liens d'évaluation";

      console.error(errorMessage);
      setError(errorMessage);
      throw error;
    }
  };

  return (
    <FormationContext.Provider value={{ 
      formations, 
      loading, 
      error, 
      addNewFormation, 
      deleteFormation, 
      updateFormation, 
      refreshFormations, 
      filteredFormations,
      searchFormations, 
      nombreBeneficiaires,
      getBeneficiaireFormation,
      sendEvaluationFormation,
      getAllFormationsManager,
      createFormationDraft
    }}>
      {children}
    </FormationContext.Provider>
  );
};

export const useFormations = (): FormationContextType => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations doit être utilisé dans un FormationProvider');
  }
  return context;
};