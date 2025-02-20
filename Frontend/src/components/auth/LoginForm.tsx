import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "@/services/authService";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    try {
      const response = await login(data);
      
      console.log("Full response:", response);

      if (!response) {
        throw new Error("No response received from server");
      }

      if (!response.role) {
        throw new Error("Role missing in response");
      }

      // Stockage du rôle
      localStorage.setItem('userRole', response.role);

      // Stockage des données utilisateur en les mappant depuis nom/prenom
      if (response.user) {
        const nom = response.user.nom;
        const prenom = response.user.prenom;
        
        if (nom && prenom) {
          localStorage.setItem('nom', nom);
          localStorage.setItem('prenom', prenom);
          
          console.log("Successfully stored user data:", {
            nom: nom,
            prenom: prenom,
            role: response.role
          });
        } else {
          console.warn("User data incomplete:", response.user);
        }
      }

      toast.success("Connexion réussie");

      // Navigation basée sur le rôle
      const roleRoutes = {
        "Formateur": "/formateur/dashboardFormateur",
        "Manager": "/manager/dashboardManager",
        "Coordinateur": "/coordinateur/dashboardCoordinateur",
        "Technicien": "/technicien/dashboardTechnicien"
      };

      const route = roleRoutes[response.role];
      if (route) {
        navigate(route);
      } else {
        toast.error("Role non reconnu");
      }

    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Erreur de connexion";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Adresse email<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            required
            className="w-full" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Mot de passe<span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        <Link 
          to="/forgot-password" 
          className="block text-sm text-orange-500 hover:text-orange-600"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
        disabled={loading}
      >
        {loading ? "Connexion..." : "Connexion"}
      </Button>
    </form>
  );
}