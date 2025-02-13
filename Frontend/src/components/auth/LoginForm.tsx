import { useState } from "react";
   import { Eye, EyeOff } from "react-feather";
   import { zodResolver } from "@hookform/resolvers/zod";
   import { z } from "zod";
   import { useForm } from "react-hook-form";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Button } from "@/components/ui/button";
   import { Link, useNavigate } from "react-router-dom";
   import { toast } from "react-toastify";
   import "react-toastify/dist/ReactToastify.css";
   import { login } from "@/services/authService";

  
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
   const response = await login(data);
   console.log("Réponse API :", response);

   if (response && response.role && response.user) {
   localStorage.setItem('userRole', response.role);
   localStorage.setItem('firstName', response.user.firstName);
   localStorage.setItem('lastName', response.user.lastName);
   console.log("User data stored in localStorage:", {
   firstName: response.user.firstName,
   lastName: response.user.lastName,
   role: response.role
   });
   toast.success(response.message, { position: "top-right", autoClose: 3000 });
   if (response.role === "Formateur") {
   navigate("/formateur/dashboardFormateur");
   } else if (response.role === "Manager") {
   navigate("/manager/dashboardManager");
   } else if (response.role === "Coordinateur") {
   navigate("/coordinateur/dashboardCoordinateur");
   } else if (response.role === "Technicien") {
   navigate("/technicien/dashboardTechnicien");
   }
   } else {
   toast.error("Role or user data not found in response", { position: "top-right", autoClose: 3000 });
   }
   } catch (error) {
   if (error.response && error.response.status === 400) {
   toast.error(error.response.data.message, { position: "top-right", autoClose: 3000 });
   } else {
   toast.error("Erreur serveur. Veuillez réessayer plus tard.");
   console.error(error);
   }
   } finally {
   setLoading(false);
   }
   };

   return (
   <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
   <div className="space-y-4">
   {/* Email */}
   <div className="space-y-2">
   <Label htmlFor="email">
   Adresse email<span className="text-red-500 ml-1">*</span>
   </Label>
   <Input id="email" type="email" {...register("email")} className="w-full" />

   {errors.email?.message && (
   <p className="text-red-500 text-sm">{String(errors.email.message)}</p>

   )}
   </div>

   {/* Mot de passe */}

   <div className="space-y-2">
   <Label htmlFor="password">Mot de passe<span className="text-red-500 ml-1">*</span></Label>

   <div className="relative">
   <Input
   id="password"
   type={showPassword ? "text" : "password"}
   {...register("password")}
   className="w-full pr-10"
   />
   <button
   type="button"
   onClick={() => setShowPassword(!showPassword)}
   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
   >
   {showPassword ? <EyeOff /> : <Eye />}
   </button>
   </div>
   {errors.password?.message && (
   <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
   )}
   </div>
   {/* Lien mot de passe oublié */}
   <Link to="/forgot-password" className="block text-sm text-orange-500 hover:text-orange-600">
   Mot de passe oublié ?
   </Link>
   </div>

   {/* Bouton de connexion */}
   <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
   {loading ? "Connexion..." : "Connexion"}
   </Button>
   </form>
   );
   }
