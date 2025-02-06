import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password recovery logic here
  };
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Récupérer un mot de passe oublié ?
        </h1>
        <p className="text-gray-600">
          Accédez à votre compte email pour modifier le mot de passe
        </p>
      </div>
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
      </div>
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Envoyer
      </Button>
    </form>
  );
}