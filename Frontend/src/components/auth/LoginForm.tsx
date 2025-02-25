import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "@/services/authService";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await login(data);

      if (!response) {
        throw new Error("No response received from server");
      }
      if (!response.role) {
        throw new Error("Role missing in response");
      }

      // Stockage du rôle
      localStorage.setItem("userRole", response.role);

      // Stockage des données utilisateur
      if (response.user) {
        const { nom, prenom } = response.user;

        if (nom && prenom) {
          localStorage.setItem("nom", nom);
          localStorage.setItem("prenom", prenom);
        }
      }

      // Navigation basée sur le rôle
      const roleRoutes = {
        Formateur: "/formateur/dashboardFormateur",
        Manager: "/manager/dashboardManager",
        Coordinateur: "/coordinateur/dashboardCoordinateur",
        Technicien: "/technicien/dashboardTechnicien",
      };
      const route = roleRoutes[response.role];
      if (route) {
        navigate(route);
      } else {
        toast.error("Rôle non reconnu");
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
    <form onSubmit={onSubmit} className="space-y-6 w-[600px]">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold font-inter">
          Adresse email <span className=" text-sm font-bold font-inter text-[#CD3C14]">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-bold font-inter">
          Mot de passe <span className=" text-sm font-bold font-inter text-[#CD3C14]">*</span>
        </label>
       
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="text-right">
        <a href="/forgot-password" className="text-sm text-[#CD3C14] hover:text-red-700">
          Mot de passe oubliée
        </a>
      </div>
      <button
        type="submit"
        className="w-[200px] bg-[#FF7900] hover:bg-orange-600 text-black py-3 font-bold font-inter"
        disabled={loading}
      >
        {loading ? "Connexion..." : "Connexion"}
      </button>
    </form>
  );
}
