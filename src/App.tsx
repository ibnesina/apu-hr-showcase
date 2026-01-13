import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import LeaveManagement from "./pages/LeaveManagement";
import LeavePolicies from "./pages/LeavePolicies";
import Attendance from "./pages/Attendance";
import ShiftManagement from "./pages/ShiftManagement";
import HolidayManagement from "./pages/HolidayManagement";
import PayrollSetup from "./pages/PayrollSetup";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import AuditLogs from "./pages/AuditLogs";
import AppraisalCycles from "./pages/AppraisalCycles";
import MyAppraisal from "./pages/MyAppraisal";
import AppraisalReviews from "./pages/AppraisalReviews";
import AppraisalReports from "./pages/AppraisalReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/faculty-dashboard" replace />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={isAdmin ? "/" : "/faculty-dashboard"} replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
      <Route path="/faculty-dashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute adminOnly><Employees /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/leave" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
      <Route path="/leave-policies" element={<ProtectedRoute adminOnly><LeavePolicies /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/shifts" element={<ProtectedRoute adminOnly><ShiftManagement /></ProtectedRoute>} />
      <Route path="/holidays" element={<ProtectedRoute adminOnly><HolidayManagement /></ProtectedRoute>} />
      <Route path="/payroll-setup" element={<ProtectedRoute adminOnly><PayrollSetup /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/appraisal-cycles" element={<ProtectedRoute adminOnly><AppraisalCycles /></ProtectedRoute>} />
      <Route path="/my-appraisal" element={<ProtectedRoute><MyAppraisal /></ProtectedRoute>} />
      <Route path="/appraisal-reviews" element={<ProtectedRoute adminOnly><AppraisalReviews /></ProtectedRoute>} />
      <Route path="/appraisal-reports" element={<ProtectedRoute adminOnly><AppraisalReports /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute adminOnly><Reports /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
