import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher le rechargement de la page
            console.log("debut de fct handelsubmit *************");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signIn",
        { email, password },
        { withCredentials: true }
      );

      console.log("Réponse API :", response.data);
      navigate("/formateur/dashboardFormateur"); // Redirection après connexion réussie
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Adresse email<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            Mot de passe<span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <Link to="/forgot-password" className="block text-sm text-orange-500 hover:text-orange-600">
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
        Connexion
      </Button>
    </form>
  );
}
