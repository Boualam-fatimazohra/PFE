import DashboardManager from "@/pages/DashboardManager";
import { Routes, Route } from "react-router-dom";
import NotFound from "../pages/NotFound";

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/DashboardManager" element={<DashboardManager />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ManagerRoutes;