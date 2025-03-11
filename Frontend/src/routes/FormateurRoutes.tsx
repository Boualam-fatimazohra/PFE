import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";
import { FormationProvider } from "@/contexts/FormationContext";
import FormationModal from "@/components/dashboardElement/formationModal";
import { EvenementsAssociesProvider } from '../contexts/FormateurContext';
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationsHistory from "@/components/notification/NotificationsHistory";
import EvaluationPages from "@/pages/EvaluationPages";
import BeneficiairesList from "@/components/Formation/Beneficiaires";
const FormateurRoutes = () => {
  return (
    <FormationProvider>
    <EvenementsAssociesProvider>
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="formationModal" element={< FormationModal/>} />
      <Route path="notifications" element={<NotificationsHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </EvenementsAssociesProvider>
    </FormationProvider>
  );
};

export default FormateurRoutes;