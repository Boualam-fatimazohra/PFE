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
import AjoutFormateur from "@/components/dashboardElement/AjoutFormateur";
import ModifieFormateur from "@/components/dashboardElement/ModifieFormateur";
import FablabSolidaire from "@/components/dashboardElement/FablabSolidaire";
import OrangeFab from "@/components/dashboardElement/OrangeFab";
import Coordination from "@/components/dashboardElement/Corrdination";
import GestionFormationManager from "@/components/dashboardElement/GestionFormationManager";
import { FormateurProvider } from "@/contexts/FormateurContext";
import UpdateFormateur from "@/components/dashboardElement/UpdateFormateur";
import DetailFormateur from "@/components/dashboardElement/DetailFormateur";
import { EncadrantFormationProvider } from "@/contexts/EncadrantFormationContext ";


const ManagerRoutes = () => {
  return (
    <FormationProvider>
      <EvenementProvider>
    <NotificationProvider>
    <EdcProvider>
    <FormateurProvider> 
    <EncadrantFormationProvider>
    <Routes>
      <Route path="/dashboardManager" element={<DashboardManager />} />
      <Route path="*" element={<NotFound />} />
          
          <Route path="/Ecolcode" element={<Ecolcode/>}/>
          <Route path="/FablabSolidaire" element={<FablabSolidaire/>}/>
          <Route path="/OrangeFab" element={<OrangeFab/>}/>
          <Route path="/Coordination" element={<Coordination/>}/>


          <Route path="/CalendrierManager" element={<CalendrierManager />} />
          <Route path="/CreatEvent" element={<CreatEvent />} />
          <Route path="/GestionFormateurManager" element={<GestionFormateurManager/>} />
          <Route path="/GestionFormation" element={<FormationManager/>} />
          <Route path="/GestionFormationManager" element={<GestionFormationManager/>} />

          <Route path="/AjoutFormateur" element={<AjoutFormateur/>} />
          <Route path="/updateFormateur/:id" element={<UpdateFormateur/>} />
          <Route path="/ModifieFormateur/:id" element={<ModifieFormateur />} />
          <Route path="/DetailFormateur/:id" element={<DetailFormateur />} />




    </Routes>
    </EncadrantFormationProvider>
    </FormateurProvider>
    </EdcProvider>
    </NotificationProvider>
    </EvenementProvider>
    </FormationProvider>

  );
};

export default ManagerRoutes;