import { Routes, Route } from "react-router-dom";
import DashboardCoordinateur from "../pages/DashboardCoordinateur";
import NotFound from "../pages/NotFound";

const CoordinateurRoutes = () => {
  return (
    <Routes>
      <Route path="dashboardCoordinateur" element={<DashboardCoordinateur />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default CoordinateurRoutes;