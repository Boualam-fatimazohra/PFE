/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const roleRoutes: Record<string, string> = {
        Formateur: "/formateur/dashboardFormateur",
        Manager: "/manager/dashboardManager",
        Coordinateur: "/coordinateur/dashboardCoordinateur",
        Technicien: "/technicien/dashboardTechnicien",
      };

      navigate(roleRoutes[user.role] || "/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-[600px]">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-bold font-inter">
          Adresse email <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
        </label>
        <input id="email" name="email" type="email" required className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-bold font-inter">
          Mot de passe <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
        </label>
        <input id="password" name="password" type="password" required className="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div className="text-right">
        <a href="/forgot-password" className="text-sm text-[#CD3C14] hover:text-red-700">Mot de passe oublié</a>
      </div>
      <button type="submit" className="w-[200px] bg-[#FF7900] hover:bg-orange-600 text-black py-3 font-bold font-inter" disabled={loading}>
        {loading ? "Connexion..." : "Connexion"}
      </button>
    </form>
  );
}
