import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";
import { FormationProvider } from "@/contexts/FormationContext";
import FormationModal from "@/components/dashboardElement/formationModal";
import { EvenementsAssociesProvider } from '../contexts/FormateurContext';
import { NotificationProvider } from "@/contexts/NotificationContext";
const FormateurRoutes = () => {
  return (
    <FormationProvider>
    <EvenementsAssociesProvider>
    <NotificationProvider>
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="formationModal" element={< FormationModal/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </NotificationProvider>
    </EvenementsAssociesProvider>
    </FormationProvider>
  );
};

export default FormateurRoutes;