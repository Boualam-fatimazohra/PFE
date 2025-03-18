import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (email: string, password: string) => {
    let isValid = true;
    
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("L'adresse email est requise");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Le mot de passe est requis");
      isValid = false;
    }

    return isValid;
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput?.value?.trim() || "";
  
    if (!email) {
      setEmailError("Veuillez entrer un email");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Veuillez entrer un email valide");
      return;
    }
  
    console.log("Navigating to /forgot-password with email:", email); // Debug
    navigate("/forgot-password", { state: { email } });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validation du formulaire
    if (!validateForm(email, password)) {
      return;
    }

    setLoading(true);

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
      
      if (error.message.includes("password")) {
        setPasswordError("Mot de passe incorrect");
      } else if (error.message.includes("email") || error.message.includes("user")) {
        setEmailError("Adresse email incorrecte ou inexistante");
      } else {
        setEmailError("Identifiants incorrects");
      }
      
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
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className={`w-full p-2 border ${emailError ? "border-[#CD3C14]" : "border-gray-300"} rounded`} 
        />
        {emailError && (
          <div className="flex text-bold items-center text-[#CD3C14] text-sm mt-1">
            <AlertTriangle size={16} className="mr-1" />
            <span>{emailError}</span>
          </div>
        )}
      </div>
      <div className="relative space-y-2">
        <label htmlFor="password" className="block text-sm font-bold font-inter">
          Mot de passe <span className="text-sm font-bold font-inter text-[#CD3C14]">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={`w-full p-2 border ${passwordError ? "border-[#CD3C14]" : "border-gray-300"} rounded pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && (
          <div className="flex text-bold items-center text-[#CD3C14] text-sm mt-1">
            <AlertTriangle size={16} className="mr-1" />
            <span>{passwordError}</span>
          </div>
        )}
      </div>
      <div className="text-right">
        <a href="#" onClick={handleForgotPassword} className="text-sm text-[#CD3C14] hover:text-red-700">Mot de passe oublié</a>
      </div>
      <button type="submit" className="w-[200px] bg-[#FF7900] hover:bg-orange-600 text-black py-3 font-bold font-inter" disabled={loading}>
        {loading ? "Connexion..." : "Connexion"}
      </button>
    </form>
  );
}