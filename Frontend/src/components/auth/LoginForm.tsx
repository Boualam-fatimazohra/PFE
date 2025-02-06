import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pour le moment, on redirige directement vers le dashboard
    // La logique d'authentification sera ajoutée plus tard
    navigate('/formateur/dashboardFormateur');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Adresse email
            <span className="text-red-500 ml-1">*</span>
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
            Mot de passe
            <span className="text-red-500 ml-1">*</span>
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

        <Link
          to="/forgot-password"
          className="block text-sm text-orange-500 hover:text-orange-600"
        >
          Mot de passe oubliée
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Connexion
      </Button>
    </form>
  );
}