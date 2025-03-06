import BootcampsList from "@/components/dashboardElement/Bootcamps";
import CalendrierManager from "@/components/dashboardElement/CalendrierManager";
import FormateurManager from "@/components/dashboardElement/FormateurManager";
import FormationDashboard from "@/components/dashboardElement/FormationManager";
import { FormationProvider } from "@/contexts/FormationContext";
import DashboardManager from "@/pages/DashboardManager";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { NotificationProvider } from "@/contexts/NotificationContext";

const ManagerRoutes = () => {
  return (
    <FormationProvider>
    <NotificationProvider>
    <Routes>
      <Route path="/dashboardManager" element={<DashboardManager />} />
      <Route path="*" element={<NotFound />} />
          <Route path="/FormationDashboard" element={<FormationDashboard />} /> 
          <Route path="/FormateurManager" element={<FormateurManager />} /> 
          <Route path="/BootcampsList" element={<BootcampsList />} />
          <Route path="/CalendrierManager" element={<CalendrierManager />} />

    </Routes>
    </NotificationProvider>
    </FormationProvider>

  );
};

export default ManagerRoutes;