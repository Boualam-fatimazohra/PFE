import { createContext, useCallback, useContext, useState, useEffect, ReactNode } from "react";
import { getNbrEvenementsAssocies, createFormateur } from "../services/formateurService";

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
}

interface FormateurContextType {
  formateurs: Formateur[];
  loading: boolean;
  error: string | null;
  addFormateur: (formateurData: any) => Promise<any>;
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


  return (
    <FormateurContext.Provider
      value={{
        formateurs,
        loading,
        error,
        addFormateur,
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