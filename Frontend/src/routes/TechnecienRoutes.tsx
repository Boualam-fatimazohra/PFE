import DashboardManager from "@/pages/DashboardManager";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";
import DashboardFormateur from "../pages/DashboardTechnicien";
import DashboardTechnicien from "../pages/DashboardTechnicien";


const ManagerRoutes = () => {
  return (
    <Routes>
      <Route path="DashboardTechnicien" element={<DashboardTechnicien/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ManagerRoutes;