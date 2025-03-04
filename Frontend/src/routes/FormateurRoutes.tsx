import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";
import { FormationProvider } from "@/contexts/FormationContext";
import FormationModal from "@/components/dashboardElement/formationModal";
import { EvenementsAssociesProvider } from '../contexts/FormateurContext';
import CalendarView from "@/components/dashboardElement/CalendarView";
import { CalendarProvider } from "@/contexts/CalendarContext";
const FormateurRoutes = () => {
  return (
    <FormationProvider>
      <CalendarProvider>
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="formationModal" element={< FormationModal/>} />
      <Route path="CalendarView" element={<CalendarView/>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
    </CalendarProvider>
    </FormationProvider>
  );
};

export default FormateurRoutes;