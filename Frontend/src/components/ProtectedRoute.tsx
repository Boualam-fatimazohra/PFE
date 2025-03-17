/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [storedUser, setStoredUser] = useState<any>(null);

  useEffect(() => {
    // Essayer de récupérer l'utilisateur du localStorage en cas de rafraîchissement
    const checkLocalStorage = () => {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        setStoredUser(JSON.parse(storedUserData));
      }
      setLoading(false);
    };

    // Si user est déjà chargé depuis le contexte, pas besoin d'attendre
    if (user) {
      setLoading(false);
    } else {
      checkLocalStorage();
    }
  }, [user]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Utiliser soit l'utilisateur du contexte, soit celui récupéré du localStorage
  const currentUser = user || storedUser;

  // Si aucun utilisateur n'est trouvé, rediriger vers la page de connexion
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Si des rôles sont spécifiés et que l'utilisateur n'a pas le rôle requis
  if (allowedRoles.length > 0) {
    // Comparaison insensible à la casse
    const userRole = currentUser.role.toLowerCase();
    const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!hasRequiredRole) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Retourner les enfants directs ou l'Outlet pour les routes imbriquées
  return children ? <>{children}</> : <Outlet />;
};

// Page d'accès refusé (inchangée)
export const AccessDenied = () => {
  const { logout } = useAuth();
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
      <p className="mb-4">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      {user && (
        <p className="mb-4 text-gray-600">Votre rôle actuel: {user.role}</p>
      )}
      <div className="flex gap-4">
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Retour
        </button>
        <button 
          onClick={() => logout()} 
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};