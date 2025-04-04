import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";
import { FormationProvider } from "@/contexts/FormationContext";
import FormationModal from "@/components/dashboardElement/formationModal";
import CreatEvent from "@/components/dashboardElement/CreatEvent";
import { NotificationProvider } from "@/contexts/NotificationContext";
import EvaluationPages from "@/pages/EvaluationPages";
import BeneficiairesList from "@/components/Formation/Beneficiaires";
import CalendarView from "@/components/dashboardElement/CalendarView"
import { EvenementProvider } from "@/contexts/EvenementContext";
import EvaluationDashboard from "@/components/dashboardElement/EvaluationDashboard";
import CreateEvaluationForm from "@/components/dashboardElement/creatEvaluation";
const FormateurRoutes = () => {
  return (
    <FormationProvider>
      <EvenementProvider>
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="formationModal" element={< FormationModal/>} />
      <Route path="EvaluationDashboard" element={< EvaluationDashboard/>} />

      <Route path="*" element={<NotFound />} />
      <Route path="BeneficiairesList"element={<BeneficiairesList/>}/>
      <Route path="EvaluationPages"element={<EvaluationPages/>}/>
      <Route path="CalendarView"element={<CalendarView/>}/>
      <Route path="CreatEvent"element={<CreatEvent/>}/>
      <Route path="creatEvaluation"element={<CreateEvaluationForm/>}/>


    </Routes>
    </EvenementProvider>
    </FormationProvider>
  );
};

export default FormateurRoutes;