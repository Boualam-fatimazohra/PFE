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
import DetailsFormation from "./components/dashboardElement/DetailsFormation";
import { ToastContainer } from "react-toastify";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import FormationTerminer from "./pages/FormationTerminer";
import { FormationAvenir } from "./pages/FormationAvenir";
import FormationModal from "./components/dashboardElement/formationModal";
import MesFormation from "./pages/MesFormation";
import { Calendar } from "lucide-react";
import CalendarView from "./components/dashboardElement/CalendarView";
import Chatbot from "./pages/Chatbot";
import { AuthProvider } from "./contexts/AuthContext";
import AddFormation from "./pages/apiTesting/AddFormation";
import FormateurFormations from "./pages/apiTesting/FormateurFormations";
import { FormationProvider } from "./contexts/FormationContext";
import BeneficiairesList from "./components/Formation/Beneficiaires";
import EvaluationPages from "@/pages/EvaluationPages";
import FormationDashboard from "@/components/dashboardElement/FormationManager";
import FormateurManager from "@/components/dashboardElement/FormateurManager";
import BootcampsList from "./components/dashboardElement/Bootcamps";
import CalendrierManager from "./components/dashboardElement/CalendrierManager";
import CreatEvent from "./components/dashboardElement/CreatEvent";
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
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <AuthProvider>
      <FormationProvider>
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
                  <Route path="/CalendarView" element={<CalendarView />} />

                  <Route path="/formations" element={<FormateurFormations />} />
                  <Route path="/CreatEvent" element={<CreatEvent />} />

                </Route>

                {/* Routes pour formateurs, managers et coordinateurs */}
                <Route element={<ProtectedRoute allowedRoles={["Formateur"]} />}>
                  <Route path="/generate-link" element={<GenerateLink />} />
                  <Route path="/beneficiaires" element={<BeneficiairesList />} />
                  <Route path="/addformation" element={<AddFormation />} />
                  <Route path="/FormationTerminer" element={<FormationTerminer />} />
                  <Route path="/FormationAvenir" element={<FormationAvenir />} />
                  <Route path="/FormationModal" element={<FormationModal />} />
                  <Route path="/EvaluationPages" element={<EvaluationPages />} />
                  <Route path="/DetailsFormation" element={<DetailsFormation />} />

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
                <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
                  <Route path="/CalendrierManager" element={<CalendrierManager />} />
                  <Route path="/Ecolcode" element={<Ecolecode />} />
                </Route>
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </FormationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;