import BootcampsList from "@/components/dashboardElement/Bootcamps";
import FormateurManager from "@/components/dashboardElement/FormateurManager";
import FormationDashboard from "@/components/dashboardElement/FormationManager";
import { FormationProvider } from "@/contexts/FormationContext";
import DashboardManager from "@/pages/DashboardManager";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";

const ManagerRoutes = () => {
  return (
    <FormationProvider>

    <Routes>
      <Route path="/dashboardManager" element={<DashboardManager />} />
      <Route path="*" element={<NotFound />} />
          <Route path="/FormationDashboard" element={<FormationDashboard />} /> 
          <Route path="/FormateurManager" element={<FormateurManager />} /> 
          <Route path="/BootcampsList" element={<BootcampsList />} />
    </Routes>
    </FormationProvider>

  );
};

export default ManagerRoutes;