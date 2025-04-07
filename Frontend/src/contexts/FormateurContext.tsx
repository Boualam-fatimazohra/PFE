import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from "react";
import {
  getNbrEvenementsAssocies,
  createFormateur,
  getFormateurById as fetchFormateurById,
  updateFormateur as updateFormateurService,
  deleteFormateur as deleteFormateurService
} from "../services/formateurService";

interface Formateur {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  specialite: string;
  experience: string;
  dateInscription: string;
  description: string;
  cv: File | null;
  imageFormateur: File | null;
  utilisateur?: {
    prenom: string;
    nom: string;
    email: string;
    numeroTelephone: string;
  };
  entity?: {
    type: string;
    ville: string;
    _id: string;
  };
}

interface FormateurContextType {
  formateurs: Formateur[];
  loading: boolean;
  error: string | null;
  addFormateur: (formateurData: any) => Promise<any>;
  getFormateurById: (id: string) => Promise<any>;
  updateFormateur: (id: string, formateurData: any) => Promise<any>;
  deleteFormateur: (id: string) => Promise<any>; // Add this line
}

const FormateurContext = createContext<FormateurContextType | undefined>(undefined);

export const FormateurProvider = ({ children }: { children: ReactNode }) => {
  const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addFormateur = useCallback(async (formateurData: any) => {
    setLoading(true);
    try {
      const response = await createFormateur(formateurData);
      setError(null);
      return response;
    } catch (err) {
      console.error("Error adding formateur:", err);
      setError("Erreur lors de l'ajout du formateur");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFormateurById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetchFormateurById(id);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error getting formateur ${id}:`, err);
      setError(`Erreur lors de la récupération du formateur`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFormateur = useCallback(async (id: string, formateurData: any) => {
    setLoading(true);
    try {
      const response = await updateFormateurService(id, formateurData);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error updating formateur ${id}:`, err);
      setError(`Erreur lors de la mise à jour du formateur`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add delete formateur function
  const deleteFormateur = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteFormateurService(id);
      setError(null);
      return response;
    } catch (err) {
      console.error(`Error deleting formateur ${id}:`, err);
      setError(`Erreur lors de la suppression du formateur`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FormateurContext.Provider
      value={{
        formateurs,
        loading,
        error,
        addFormateur,
        getFormateurById,
        updateFormateur,
        deleteFormateur // Add this line
      }}
    >
      {children}
    </FormateurContext.Provider>
  );
};

export const useFormateur = (): FormateurContextType => {
  const context = useContext(FormateurContext);
  if (!context) {
    throw new Error("useFormateur must be used within a FormateurProvider");
  }
  return context;
};