import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/DashboardFormateur";
import DashboardManager from "./pages/DashboardManager";

import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import FormateurRoutes from "./routes/FormateurRoutes";
import CoordinateurRoutes from "./routes/CoordinateurRoutes";
import ManagerRoutes from "./routes/ManagerRoutes ";
import TechnicienRoutes from "./routes/TechnecienRoutes.js";
import GenerateLink from "./components/dashboardElement/GenerationLien";
import FormulaireEvaluation from "./components/dashboardElement/FormulaireEvaluation";


import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToastContainer />
      <Sonner />
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Route parent pour les formateurs */}
          <Route path="/formateur/*" element={<FormateurRoutes />} />
          <Route path="/manager/*" element={<ManagerRoutes />} />
          <Route path="/coordinateur/*" element={<CoordinateurRoutes />} />
          <Route path="/Technicien/*" element={<TechnicienRoutes />} />

          <Route path="*" element={<NotFound />} />
          
        <Route path="/" element={<GenerateLink  />} />
        <Route path="/formulaire-evaluation" element={<FormulaireEvaluation />} /> 
    
        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;