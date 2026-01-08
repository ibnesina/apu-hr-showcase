# APU HR Management System - Project Overview

## 📋 Project Description

This is a comprehensive HR Management System designed for Asia Pacific University (APU). It's a demo/showcase application that provides a full-featured HR management interface for managing employees, leave requests, payroll, documents, and more.

## 🛠️ Tech Stack

### Frontend Framework & Core Technologies
- **React 18.3.1** - JavaScript library for building user interfaces
- **TypeScript 5.8.3** - Typed superset of JavaScript
- **Vite 5.4.19** - Fast build tool and development server

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library based on Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library
- **next-themes** - Theme management (dark/light mode support)

### Routing & Navigation
- **React Router DOM 6.30.1** - Client-side routing

### State Management & Data Handling
- **TanStack React Query 5.83.0** - Server state management and data fetching
- **React Hook Form 7.61.1** - Form validation and management
- **Zod 3.25.76** - Schema validation

### Charts & Data Visualization
- **Recharts 2.15.4** - Composable charting library built on React components

### Other Libraries
- **date-fns 3.6.0** - Date utility library
- **Sonner** - Toast notifications
- **class-variance-authority** - Utility for constructing className strings
- **cmdk** - Command palette component

## 📦 Project Structure

```
apu-hr-showcase/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   │   └── NavLink.tsx     # Navigation link component
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and data management
│   │   ├── mockData.ts     # Mock data definitions and initial data
│   │   ├── storage.ts      # Session storage management functions
│   │   └── utils.ts        # Utility helper functions
│   ├── pages/              # Page components (routes)
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── Documents.tsx
│   │   ├── LeaveManagement.tsx
│   │   ├── Attendance.tsx
│   │   ├── Payroll.tsx
│   │   ├── Reports.tsx
│   │   ├── Notifications.tsx
│   │   └── AuditLogs.tsx
│   ├── App.tsx             # Main app component with routes
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── Configuration files     # vite, typescript, tailwind, eslint configs
```

## 🎯 Features & Modules

The application includes the following main modules:

1. **Dashboard** - Overview of key HR metrics, statistics, and charts
   - Employee count and distribution
   - Attendance tracking
   - Leave request summary
   - Payroll status
   - Department-wise employee distribution (Pie chart)
   - Monthly attendance trends (Line chart)
   - Leave usage statistics (Bar chart)

2. **Employees** - Employee management
   - View all employees
   - Add new employees
   - Edit employee details
   - Delete employees
   - Filter by department, role, status

3. **Leave Management** - Leave request handling
   - View leave requests (Pending/Approved/Rejected)
   - Approve/Reject leave requests
   - Leave policy management
   - Leave balance tracking

4. **Attendance** - Employee attendance tracking
   - Daily attendance records
   - Check-in/Check-out times
   - Attendance calendar view
   - Attendance statistics

5. **Payroll** - Salary and payroll management
   - Monthly payroll records
   - Basic salary, allowances, deductions
   - Net salary calculations
   - Payroll processing (Pending/Processed status)

6. **Documents** - Document repository
   - Upload and manage HR documents
   - Policy documents
   - Templates
   - Finance documents
   - Version control

7. **Reports** - Reporting and analytics
   - Generate various HR reports
   - Export capabilities

8. **Notifications** - System notifications
   - Leave approvals
   - System alerts
   - Important announcements

9. **Audit Logs** - Activity tracking
   - Track all system actions
   - User activity logs
   - CRUD operation logs with timestamps

## 💾 Data Storage Strategy

### Session Storage Based Persistence

The application uses **browser sessionStorage** for data persistence. This is a demo/showcase application, so data is not persisted to a backend database.

#### How It Works:

1. **Initial Data Loading**: On first load, the app checks sessionStorage for existing data. If none exists, it initializes with mock data from `mockData.ts`.

2. **Storage Keys**: Each data type has its own storage key:
   - `apu_hr_employees` - Employee records
   - `apu_hr_leave_requests` - Leave request data
   - `apu_hr_leave_policies` - Leave policy configurations
   - `apu_hr_documents` - Document metadata
   - `apu_hr_payroll` - Payroll records
   - `apu_hr_audit_logs` - System activity logs

3. **Data Operations**: All CRUD operations (Create, Read, Update, Delete) are handled through the `storage.ts` helper functions:
   - `getEmployees()`, `addEmployee()`, `updateEmployee()`, `deleteEmployee()`
   - `getLeaveRequests()`, `updateLeaveRequestStatus()`
   - `getPayrollRecords()`, `processPayroll()`
   - `getDocuments()`, `addDocument()`
   - `getAuditLogs()`, `addAuditLog()`

4. **Audit Trail**: Every data modification automatically creates an audit log entry with:
   - Action type (Created/Updated/Deleted)
   - Module name
   - User (currently hardcoded as "Admin")
   - Timestamp
   - Operation details

5. **Session Lifecycle**: Data persists only during the browser session. When the browser tab/window is closed, all data is reset to initial mock data on next visit.

#### Advantages of This Approach:
- ✅ No backend required for demo purposes
- ✅ Fast data operations (no network latency)
- ✅ Easy to reset and test
- ✅ Data automatically resets when session ends
- ✅ Perfect for showcase/demo applications

#### Limitations:
- ❌ Data lost when browser tab is closed
- ❌ Not shared across browser tabs
- ❌ No multi-user support
- ❌ Limited storage capacity (~5-10MB)

### Data Models

The application defines the following TypeScript interfaces:

- **Employee** - Personal info, department, role, employment details
- **LeaveRequest** - Leave type, dates, status, approvals
- **LeavePolicy** - Leave types, annual limits, rules
- **AttendanceRecord** - Daily attendance with check-in/out times
- **PayrollRecord** - Salary components and calculations
- **Document** - File metadata, categories, versions
- **AuditLog** - System activity tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or bun package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server
After running `npm run dev`, the application will be available at `http://localhost:5173` (default Vite port).

## 🎨 Styling & Theming

- The app uses a maroon/burgundy color scheme (`#8B1538` as primary color)
- Supports dark/light mode theme switching
- Fully responsive design for mobile, tablet, and desktop
- Consistent spacing and typography using Tailwind utilities
- Accessible components from Radix UI primitives

## 📝 Notes

- This is a **demo/showcase application** designed to demonstrate HR management functionality
- All data is mock data and stored in browser sessionStorage
- The application is fully client-side with no backend integration
- User authentication is not implemented (single user "Admin")
- File uploads are simulated (document management is metadata only)

## 🔮 Future Enhancements (Potential)

To convert this into a production application, consider:
- Backend API integration (REST/GraphQL)
- Database for persistent storage (PostgreSQL, MongoDB, etc.)
- User authentication & authorization (JWT, OAuth)
- Real file upload and storage (S3, Azure Blob, etc.)
- Email notifications
- Advanced reporting and analytics
- Multi-tenant support
- Role-based access control (RBAC)
- Internationalization (i18n)
