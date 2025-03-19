import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyPassword from "./pages/VerifyPassword"
import ValidatePassword from "./pages/ValidatePassword";
import NewPassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";
import EvaluationForm from "./pages/FormulaireEvaluation";
import FormateurRoutes from "./routes/FormateurRoutes";
import CoordinateurRoutes from "./routes/CoordinateurRoutes";
import ManagerRoutes from "./routes/ManagerRoutes";
import TechnicienRoutes from "./routes/TechnecienRoutes";
import GenerateLink from "./components/dashboardElement/GenerationLien";
import FormulaireEvaluation from "./pages/FormulaireEvaluation";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import Chatbot from "./pages/Chatbot";
import { AuthProvider } from "./contexts/AuthContext";
import CalendrierManager from "./components/dashboardElement/CalendrierManager";
import Ecolecode from "./components/dashboardElement/Ecolcode";
import { ProtectedRoute, AccessDenied } from "./components/ProtectedRoute";

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
    <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* Routes publiques - Pas de protection */}
                <Route path="/" element={<Index />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyPassword />} />
                <Route path="/reset-password" element={<NewPassword />} />
                <Route path="/ValidatePassword" element={<ValidatePassword />} />
                <Route path="/NewPassword" element={<NewPassword />} />
                <Route path="/evaluation/:id/:token" element={<EvaluationForm />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="*" element={<NotFound />} />

                {/* Routes protégées pour tous les utilisateurs authentifiés */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/Chatbot" element={<Chatbot />} />
                  <Route path="/formulaire-evaluation" element={<FormulaireEvaluation />} />
                  <Route path="/EvaluationForm" element={<EvaluationForm />} />
                </Route>

                {/* Routes pour formateurs, managers et coordinateurs */}
                <Route element={<ProtectedRoute allowedRoles={["Formateur"]} />}>
                  <Route path="/generate-link" element={<GenerateLink />} />
                </Route>

                {/* Routes spécifiques par rôle */}
                <Route path="/formateur/*" element={
                  <ProtectedRoute allowedRoles={["Formateur"]}>
                    <FormateurRoutes />
                  </ProtectedRoute>
                } />

                <Route path="/manager/*" element={
                  <ProtectedRoute allowedRoles={["Manager"]}>
                    <ManagerRoutes />
                  </ProtectedRoute>
                } />

                <Route path="/coordinateur/*" element={
                  <ProtectedRoute allowedRoles={["Coordinateur"]}>
                    <CoordinateurRoutes />
                  </ProtectedRoute>
                } />

                <Route path="/technicien/*" element={
                  <ProtectedRoute allowedRoles={["Technicien"]}>
                    <TechnicienRoutes />
                  </ProtectedRoute>
                } />

                {/* Route spécifique aux managers */}
                
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;