import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  login as loginService, 
  logout as logoutService,
  forgotPassword as forgotPasswordService,
  verifyResetCode as verifyResetCodeService,
  changePassword as changePasswordService
} from "@/services/authServices";

interface User {
  nom: string;
  prenom: string;
  userId: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  resetState: {
    email: string | null;
    codeVerified: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [resetState, setResetState] = useState<{
    email: string | null;
    codeVerified: boolean;
  }>({
    email: null,
    codeVerified: false
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginService(email, password);
      const userData = {
        nom: response.user.nom,
        prenom: response.user.prenom,
        userId: response.user.userId,
        role: response.role,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    localStorage.removeItem("user");
  };

  const forgotPassword = async (email: string) => {
    try {
      await forgotPasswordService(email);
      // Enregistrer l'email pour les étapes suivantes
      setResetState(prev => ({ ...prev, email }));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const verifyResetCode = async (code: string) => {
    try {
      await verifyResetCodeService(code);
      // Marquer que le code a été vérifié
      setResetState(prev => ({ ...prev, codeVerified: true }));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      // Vérifier que le code a été vérifié avant de permettre le changement de mot de passe
      if (!resetState.codeVerified) {
        throw new Error("Le code de vérification doit d'abord être validé");
      }
      await changePasswordService(newPassword);
      // Réinitialiser l'état après un changement de mot de passe réussi
      setResetState({ email: null, codeVerified: false });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        forgotPassword, 
        verifyResetCode, 
        resetPassword,
        resetState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};