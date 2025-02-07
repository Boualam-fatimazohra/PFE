import { useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string(),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
const onSubmit = async (data) => {
  setLoading(true);
  try {
    const response = await axios.post("http://localhost:5000/api/auth/signIn", data, { withCredentials: true });
    console.log("Réponse API :", response.data);
    if (response.data.role === "Mentor") {
      toast.success(response.data.message, { position: "top-right", autoClose: 3000 });
      navigate("/formateur/dashboardFormateur");
    }
    else if (response.data.role === "Admin") {
     //todo 
  } }
   catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message, { position: "top-right", autoClose: 3000 });

    } else {
      toast.error("Server error. Please try again later");
      console.error(error);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Adresse email<span className="text-red-500 ml-1">*</span></Label>
          <Input id="email" type="email" {...register("email")} className="w-full" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2 relative">
          <Label htmlFor="password">Mot de passe<span className="text-red-500 ml-1">*</span></Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} className="w-full pr-10" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <Link to="/forgot-password" className="block text-sm text-orange-500 hover:text-orange-600">Mot de passe oublié ?</Link>
      </div>

      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
        {loading ? "Connexion..." : "Connexion"}
      </Button>
    </form>
  );
}
