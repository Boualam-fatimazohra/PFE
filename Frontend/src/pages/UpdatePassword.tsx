import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import des icônes
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

const NewPassword = () => {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await resetPassword(password);
      setSuccess("Votre mot de passe a été réinitialisé avec succès !");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(70vh-130px)]">
      <div className="w-full max-w-md mx-auto px-4">
        <Header />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold font-inter text-black leading-tight tracking-wide">
              Validation du mot
              <br />
              de passe oublié
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Entrez votre nouveau mot de passe pour réinitialiser votre compte
            </p>
          </div>

          <div className="space-y-2 mt-8">
            <Label htmlFor="password" className="text-sm font-medium font-bold font-inter flex items-center">
              Nouveau mot de passe <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Label htmlFor="confirmPassword" className="text-sm font-medium font-bold font-inter flex items-center">
              Confirmer le mot de passe <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <div className="mt-6 flex justify-center sm:justify-start">
            <Button
              type="submit"
              className="w-32 bg-[#FF7900] hover:bg-orange-600 text-black py-2"
              style={{ backgroundColor: "#FF7900" }}
              disabled={loading}
            >
              {loading ? "Chargement..." : "Valider"}
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default NewPassword;
