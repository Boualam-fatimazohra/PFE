import BootcampsList from "@/components/dashboardElement/Bootcamps";
import CalendrierManager from "@/components/dashboardElement/CalendrierManager";
import CreatEvent from "@/components/dashboardElement/CreatEvent";
import FormateurManager from "@/components/dashboardElement/FormateurManager";
import FormationDashboard from "@/components/dashboardElement/FormationManager";
import { FormationProvider } from "@/contexts/FormationContext";
import DashboardManager from "@/pages/DashboardManager";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Ecolcode from "@/components/dashboardElement/Ecolcode";
import GestionFormation from "@/components/dashboardElement/GestionFormationManager";
import GestionFormateurManager from "@/components/dashboardElement/GestionFormateurManager";
import FormationManager from "@/components/Formation/FormationManager";
import { EdcProvider } from "@/contexts/EdcContext";
import { EvenementProvider } from "@/contexts/EvenementContext";


const ManagerRoutes = () => {
  return (
    <FormationProvider>
      <EvenementProvider>
    <NotificationProvider>
    <EdcProvider>
    <Routes>
      <Route path="/dashboardManager" element={<DashboardManager />} />
      <Route path="*" element={<NotFound />} />
          
          <Route path="/Ecolcode" element={<Ecolcode/>}/>

          <Route path="/CalendrierManager" element={<CalendrierManager />} />
          <Route path="/CreatEvent" element={<CreatEvent />} />
          <Route path="/GestionFormateurManager" element={<GestionFormateurManager/>} />
          <Route path="/GestionFormation" element={<FormationManager/>} />

    </Routes>
    </EdcProvider>
    </NotificationProvider>
    </EvenementProvider>
    </FormationProvider>

  );
};

export default ManagerRoutes;