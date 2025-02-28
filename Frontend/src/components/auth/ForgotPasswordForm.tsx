import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // Importez ceci si vous utilisez react-router

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate(); // Utilisez ceci si vous utilisez react-router
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await forgotPassword(email);
      setSuccess(true);
      
      // Redirection après un court délai pour que l'utilisateur puisse voir le message de succès
      setTimeout(() => {
        navigate("/verify-code"); // Remplacez par votre route de vérification
      }, 1500);
      
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-[calc(70vh-130px)]">
      <div className="w-full max-w-md mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold font-inter text-black leading-tight tracking-wide">
              Récupérer un mot
              <br />
              de passe oublié ?
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Accédez à votre compte email pour modifier le mot de passe
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Un email a été envoyé à {email} avec les instructions pour réinitialiser votre mot de passe.
            </div>
          )}
          
          <div className="space-y-2 mt-8">
            <Label
              htmlFor="email"
              className="text-sm font-medium font-bold font-inter flex items-center"
            >
              Adresse email
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 h-10"
              disabled={isLoading || success}
            />
          </div>
          
          <div className="mt-6 flex justify-center sm:justify-start">
            <Button
              type="submit"
              className="w-32 bg-[#FF7900] hover:bg-orange-600 text-black py-2"
              style={{ backgroundColor: "#FF7900" }}
              disabled={isLoading || success}
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}