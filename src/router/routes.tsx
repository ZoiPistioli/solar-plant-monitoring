import { LayoutDashboard, Columns2, MonitorDot } from 'lucide-react';

export const ROUTES = {
  home: {
    path: '/',
    label: 'Dashboard',
    icon: <LayoutDashboard className="text-inherit h-5 w-5" />,
  },
  plants: {
    path: '/solar-panel-plants',
    label: 'Solar Panel Plants',
    icon: <Columns2 className="text-inherit h-5 w-5" />,
  },
};