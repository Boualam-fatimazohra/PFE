import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
const ValidatePassword = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoutez ici la logique de validation du mot de passe
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
              veuiller le code recu par email
            </p>
          </div>

          <div className="space-y-2 mt-8">
            <Label
              htmlFor="password"
              className="text-sm font-medium font-bold font-inter flex items-center"
            >
              Code de vérification
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 h-10"
            />
          </div>

          <div className="mt-6 flex justify-center sm:justify-start">
            <Button
              type="submit"
              className="w-32 bg-[#FF7900] hover:bg-orange-600 text-black py-2"
              style={{ backgroundColor: "#FF7900" }}
            >
              Valider
            </Button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ValidatePassword;