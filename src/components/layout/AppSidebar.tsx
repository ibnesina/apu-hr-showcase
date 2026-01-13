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
  Home,
  Clock,
  CalendarDays,
  Settings,
  Award,
  Star,
  ClipboardCheck,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const adminMenuItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Employees', url: '/employees', icon: Users },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Leave Management', url: '/leave', icon: ClipboardList },
  { title: 'Leave Policies', url: '/leave-policies', icon: Settings },
  { title: 'Attendance', url: '/attendance', icon: Calendar },
  { title: 'Shifts', url: '/shifts', icon: Clock },
  { title: 'Holidays', url: '/holidays', icon: CalendarDays },
  { title: 'Payroll Setup', url: '/payroll-setup', icon: Settings },
  { title: 'Payroll', url: '/payroll', icon: DollarSign },
  { title: 'Appraisal Cycles', url: '/appraisal-cycles', icon: Award },
  { title: 'Appraisal Reviews', url: '/appraisal-reviews', icon: ClipboardCheck },
  { title: 'Appraisal Reports', url: '/appraisal-reports', icon: TrendingUp },
  { title: 'Reports', url: '/reports', icon: BarChart3 },
  { title: 'Audit Logs', url: '/audit-logs', icon: History },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

const facultyMenuItems = [
  { title: 'My Dashboard', url: '/faculty-dashboard', icon: Home },
  { title: 'My Attendance', url: '/attendance', icon: Calendar },
  { title: 'My Leaves', url: '/leave', icon: ClipboardList },
  { title: 'My Appraisal', url: '/my-appraisal', icon: Star },
  { title: 'My Payslips', url: '/payroll', icon: DollarSign },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Notifications', url: '/notifications', icon: Bell },
];

export function AppSidebar() {
  const location = useLocation();
  const { isAdmin, isFaculty } = useAuth();

  const menuItems = isAdmin ? adminMenuItems : facultyMenuItems;

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
            <p className="text-xs text-sidebar-foreground/70">
              {isAdmin ? 'Admin Panel' : 'Faculty Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
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
