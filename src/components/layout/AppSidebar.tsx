import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  DollarSign,
  BarChart3,
  Bell,
  History,
} from 'lucide-react';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Employees', url: '/employees', icon: Users },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Leave Management', url: '/leave', icon: ClipboardList },
  { title: 'Attendance', url: '/attendance', icon: Calendar },
  { title: 'Payroll', url: '/payroll', icon: DollarSign },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Audit Logs', url: '/audit-logs', icon: History },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src="/apu_logo.png" alt="APU Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">APU HRMS</h1>
            <p className="text-xs text-sidebar-foreground/70">Demo Version</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60 text-center">
          © 2024 Asia Pacific University
        </p>
      </div>
    </aside>
  );
}
