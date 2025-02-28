import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function VerifyCodeForm() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { verifyResetCode } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await verifyResetCode(code);
      setSuccess(true);
      
      // Redirection après un court délai
      setTimeout(() => {
        navigate("/reset-password"); // Remplacez par votre route de réinitialisation
      }, 1500);
      
    } catch (err) {
      setError(err.message || "Code invalide ou expiré. Veuillez réessayer.");
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
              Vérification du
              <br />
              code reçu
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Veuillez saisir le code reçu par email
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              Code vérifié avec succès. Vous allez être redirigé vers la page de réinitialisation du mot de passe.
            </div>
          )}
          
          <div className="space-y-2 mt-8">
            <Label
              htmlFor="code"
              className="text-sm font-medium font-bold font-inter flex items-center"
            >
              Code de vérification
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 h-10"
              disabled={isLoading || success}
              placeholder="Entrez le code à 6 chiffres"
              maxLength={20}
            />
          </div>
          <div className="mt-6 flex justify-center sm:justify-start">
            <Button
              type="submit"
              className="w-32 bg-[#FF7900] hover:bg-orange-600 text-black py-2"
              style={{ backgroundColor: "#FF7900" }}
              disabled={isLoading || success || code.length < 6}
            >
              {isLoading ? "Vérification..." : "Vérifier"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}