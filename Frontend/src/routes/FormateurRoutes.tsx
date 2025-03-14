import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";
import { FormationProvider } from "@/contexts/FormationContext";
import FormationModal from "@/components/dashboardElement/formationModal";
import { EvenementsAssociesProvider } from '../contexts/FormateurContext';
import { NotificationProvider } from "@/contexts/NotificationContext";
import EvaluationPages from "@/pages/EvaluationPages";
import BeneficiairesList from "@/components/Formation/Beneficiaires";
import CalendarView from "@/components/dashboardElement/CalendarView"
const FormateurRoutes = () => {
  return (
    <FormationProvider>
    <EvenementsAssociesProvider>
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="formationModal" element={< FormationModal/>} />
      <Route path="*" element={<NotFound />} />
      <Route path="BeneficiairesList"element={<BeneficiairesList/>}/>
      <Route path="EvaluationPages"element={<EvaluationPages/>}/>
      <Route path="CalendarView"element={<CalendarView/>}/>

    </Routes>
    </EvenementsAssociesProvider>
    </FormationProvider>
  );
};

export default FormateurRoutes;