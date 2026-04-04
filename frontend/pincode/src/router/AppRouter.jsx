import { Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import RoutedLayout from "../components/routed/RoutedLayout";
import DashboardPage from "../pages/DashboardPage";
import ExplorePage from "../pages/ExplorePage";
import PincodeLookupPage from "../pages/PincodeLookupPage";
import AboutPage from "../pages/AboutPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<RoutedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/pincode" element={<PincodeLookupPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
