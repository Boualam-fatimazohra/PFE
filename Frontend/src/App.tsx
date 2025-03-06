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
                <Route path="/" element={<Index />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-code" element={<VerifyPassword/>} />
                <Route path="/reset-password" element={<NewPassword />} />
                <Route path="/evaluation/:id" element={<EvaluationForm />} />
                <Route path="/Chatbot" element={<Chatbot />} />
                <Route path="/ValidatePassword" element={<ValidatePassword />} />
                <Route path="/NewPassword" element={<NewPassword />} />
                {/* Routes pour les différents types d'utilisateurs */}

                <Route path="/formateur/*" element={<FormateurRoutes />} />
                <Route path="/manager/*" element={<ManagerRoutes />} />
                <Route path="/coordinateur/*" element={<CoordinateurRoutes />} />
                <Route path="/technicien/*" element={<TechnicienRoutes />} />
                <Route path="/evaluation/:id/:token" element={<EvaluationForm />} />

                {/* Autres pages */}
                <Route path="/generate-link" element={<GenerateLink />} />
                <Route path="/formulaire-evaluation" element={<FormulaireEvaluation />} />
                <Route path="/EvaluationForm" element={<EvaluationForm />} />
                <Route path="/BeneficiairesList" element={<BeneficiairesList />} />
                <Route path="/CalendarView" element={<CalendarView/>}/>
                <Route path="/beneficiaires" element={<BeneficiairesList/>}/>
                <Route path="/DetailsFormation" element={<DetailsFormation />} />
                <Route path="/FormationTerminer" element={<FormationTerminer />} />
                <Route path="/FormationAvenir" element={<FormationAvenir />} />
                <Route path="/EvaluationPages" element={<EvaluationPages />} />
                <Route path="/addformation" element={<AddFormation />} /> 
                <Route path="/formations" element={<FormateurFormations />} /> 

                <Route path="/CalendrierManager" element={<CalendrierManager/>}/>

                {/* Page 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;