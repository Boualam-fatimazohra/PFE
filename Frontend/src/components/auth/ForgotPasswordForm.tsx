import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de récupération de mot de passe ici
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
              className="w-full border border-gray-300 p-2 h-10 "
            />
          </div>

          <div className="mt-6 flex justify-center sm:justify-start">
            <Button
              type="submit"
              className="w-32 bg-[#FF7900] hover:bg-orange-600 text-black py-2"
              style={{ backgroundColor: "#FF7900" }}
            >
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
