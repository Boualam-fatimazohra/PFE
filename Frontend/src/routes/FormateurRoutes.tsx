import { Routes, Route } from "react-router-dom";
import DashboardFormateur from "../pages/DashboardFormateur";
import Dashboard from "../pages/DashboardFormateur";
import NotFound from "../pages/NotFound";
import MesFormations from "@/pages/MesFormation";

const FormateurRoutes = () => {
  return (
    <Routes>
      <Route path="dashboardFormateur" element={<DashboardFormateur />} />
      <Route path="mesformation" element={<MesFormations />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default FormateurRoutes;