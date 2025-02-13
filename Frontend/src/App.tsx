import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import FormateurRoutes from "./routes/FormateurRoutes";
import CoordinateurRoutes from "./routes/CoordinateurRoutes";
import ManagerRoutes from "./routes/ManagerRoutes";
import TechnicienRoutes from "./routes/TechnecienRoutes";
import GenerateLink from "./components/dashboardElement/GenerationLien";
import FormulaireEvaluation from "./components/dashboardElement/FormulaireEvaluation";

import { ToastContainer } from "react-toastify";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; 

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && <DashboardHeader />}
      <div className={!isLoginPage ? "pt-[70px] pb-[60px] flex-grow" : "flex-grow"}>
        {children}
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <ToastContainer />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Routes pour les différents types d'utilisateurs */}
            <Route path="/formateur/*" element={<FormateurRoutes />} />
            <Route path="/manager/*" element={<ManagerRoutes />} />
            <Route path="/coordinateur/*" element={<CoordinateurRoutes />} />
            <Route path="/technicien/*" element={<TechnicienRoutes />} />

            {/* Autres pages */}
            <Route path="/generate-link" element={<GenerateLink />} />
            <Route path="/formulaire-evaluation" element={<FormulaireEvaluation />} />

            {/* Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
