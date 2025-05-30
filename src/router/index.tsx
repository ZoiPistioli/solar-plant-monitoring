import { ROUTES } from '@/router/routes';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import SolarPanelPlants from '@/pages/SolarPanelPlants';
import Layout from '@/components/Layout';
import Monitoring from '@/pages/MonitoringDashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home.path} element={<Dashboard />} />
        <Route path={ROUTES.plants.path} element={<SolarPanelPlants />} />
        <Route path="/solar-panel-plants/:uid" element={<Monitoring />} />
      </Route>
    </Routes>
  );
}