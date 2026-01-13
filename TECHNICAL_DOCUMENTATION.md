# APU HR Management System - Technical Documentation

## 📌 Overview
This is a **demo/showcase HR Management System** built for Asia Pacific University (APU). It's a frontend-only application that simulates a complete HR system with authentication, employee management, leave management, attendance tracking, and payroll features.

---

## 🛠️ Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library for building interactive components |
| **TypeScript** | 5.8.3 | Type-safe JavaScript for better development experience |
| **Vite** | 5.4.19 | Fast build tool and development server |
| **React Router DOM** | 6.30.1 | Client-side routing for SPA navigation |

### UI Framework & Styling
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **shadcn/ui** | Pre-built accessible UI components based on Radix UI |
| **Radix UI** | Unstyled, accessible component primitives |
| **Lucide React** | Icon library with 1000+ icons |
| **next-themes** | Dark/light mode theme management |

### Data Management
| Technology | Purpose |
|------------|---------|
| **Session Storage** | Browser storage for persisting demo data |
| **TanStack React Query** | Server state management (prepared for API integration) |
| **React Hook Form** | Form validation and state management |
| **Zod** | Schema validation for form inputs |

### Data Visualization
| Technology | Purpose |
|------------|---------|
| **Recharts** | React-based charting library for dashboards |

---

## 🏗️ Project Architecture

### Folder Structure
```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components (buttons, inputs, dialogs, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Main Layout)
│   └── NavLink.tsx     # Custom navigation link component
│
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state management
│
├── hooks/              # Custom React hooks
│   └── use-mobile.tsx  # Hook for responsive design
│
├── lib/                # Core business logic
│   ├── auth.ts         # Authentication logic
│   ├── mockData.ts     # Initial mock data definitions
│   ├── storage.ts      # Session storage CRUD operations
│   └── utils.ts        # Utility functions
│
├── pages/              # Page components (route components)
│   ├── Dashboard.tsx
│   ├── FacultyDashboard.tsx
│   ├── Employees.tsx
│   ├── LeaveManagement.tsx
│   ├── Attendance.tsx
│   ├── Payroll.tsx
│   ├── Documents.tsx
│   ├── Reports.tsx
│   └── ... (other pages)
│
├── App.tsx             # Main app with routing configuration
└── main.tsx            # Application entry point
```

---

## 🔐 Authentication System

### How It Works

#### 1. **Demo User Accounts**
The system uses predefined demo accounts located in `/src/lib/auth.ts`:

```typescript
- Admin Account: username: "admin"
- Faculty Accounts: "faculty1", "faculty2", "faculty3"
```

**Password**: Any password works for demo purposes (not validated).

#### 2. **Login Flow**
1. User enters username and password on `/login` page
2. `login()` function in `auth.ts` checks username against `demoUsers` object
3. On successful match:
   - User object is stored in **sessionStorage** with key `apu_hr_auth_user`
   - Audit log entry is created
   - User is redirected to appropriate dashboard (Admin → `/`, Faculty → `/faculty-dashboard`)
4. On failure: Error toast is shown

#### 3. **Session Management**
- **Storage Type**: Browser Session Storage (data persists until browser tab is closed)
- **Auth State**: Managed by `AuthContext.tsx` using React Context API
- **Protected Routes**: Routes check authentication status before rendering

#### 4. **Role-Based Access Control (RBAC)**
```typescript
Admin Role:
  ✓ Full access to all pages
  ✓ Can add/edit/delete employees
  ✓ Can approve/reject leave requests
  ✓ Can manage payroll, shifts, holidays

Faculty Role:
  ✓ View own dashboard
  ✓ View own documents
  ✓ Apply for leave
  ✓ View own attendance
  ✗ Cannot access admin features
```

#### 5. **Logout Process**
1. User clicks logout button
2. `logout()` function removes auth data from sessionStorage
3. User is redirected to `/login` page
4. Audit log records the logout action

---

## 💾 Data Storage System

### Storage Architecture

This application uses **Browser Session Storage** to simulate a database. All data is stored client-side and persists only during the browser session.

#### Storage Keys
```typescript
apu_hr_employees        → Employee records
apu_hr_leave_requests   → Leave applications
apu_hr_leave_policies   → Leave policy rules
apu_hr_leave_balances   → Employee leave balances
apu_hr_documents        → Document metadata
apu_hr_payroll          → Payroll records
apu_hr_payroll_setup    → Salary configurations
apu_hr_audit_logs       → System activity logs
apu_hr_attendance       → Attendance records
apu_hr_shifts           → Shift schedules
apu_hr_holidays         → Holiday calendar
apu_hr_auth_user        → Current logged-in user
```

### Data Flow

#### 1. **Initial Data Load**
- On first page load, `mockData.ts` provides initial data arrays
- `storage.ts` checks if data exists in sessionStorage
- If not found, initial data is saved to sessionStorage
- This happens automatically via `getFromStorage()` function

#### 2. **CRUD Operations**

##### Adding an Employee
```
User Action → Add Employee Form
    ↓
Validation (React Hook Form + Zod)
    ↓
addEmployee() in storage.ts
    ↓
Generate unique ID (timestamp-based)
    ↓
Update employees array
    ↓
Save to sessionStorage
    ↓
Create audit log entry
    ↓
UI updates (React state refresh)
```

**Storage Location**: `sessionStorage['apu_hr_employees']`

**Data Structure**:
```typescript
{
  id: "1704758400000",
  name: "Dr. John Doe",
  email: "john.doe@apu.edu.my",
  department: "Computer Science",
  role: "Senior Lecturer",
  grade: "DG52",
  employmentType: "Full-time",
  status: "Active",
  joinDate: "2024-01-15",
  phone: "+60123456789",
  shiftId: "1" // optional
}
```

##### Applying for Leave
```
User Action → Apply Leave Form
    ↓
Fill: Leave Type, Start Date, End Date, Reason
    ↓
addLeaveRequest() in storage.ts
    ↓
Generate unique ID
    ↓
Calculate number of days
    ↓
Set status: "Pending"
    ↓
Save to sessionStorage
    ↓
Create audit log entry
    ↓
UI updates with new leave request
```

**Storage Location**: `sessionStorage['apu_hr_leave_requests']`

**Data Structure**:
```typescript
{
  id: "1704758400001",
  employeeId: "1",
  employeeName: "Dr. Ahmad Razali",
  leaveType: "Annual Leave",
  startDate: "2024-02-01",
  endDate: "2024-02-05",
  days: 5,
  reason: "Family vacation",
  status: "Pending",
  appliedDate: "2024-01-15"
}
```

##### Approving Leave
```
Admin Action → Approve Leave Button
    ↓
updateLeaveRequestStatus(id, "Approved")
    ↓
Update leave request status
    ↓
Deduct from employee leave balance
    ↓
Mark attendance as "Leave" for those dates
    ↓
Save all changes to sessionStorage
    ↓
Create audit log entry
    ↓
UI updates (request moves to Approved tab)
```

**Side Effects**:
1. **Leave Balance Update**: Reduces remaining leave days for that type
2. **Attendance Update**: Marks dates as "Leave" status in attendance records
3. **Audit Log**: Records the approval action

#### 3. **Data Persistence**

**Session Storage** means:
- ✅ Data persists across page refreshes
- ✅ Data persists across navigation
- ❌ Data is cleared when browser tab is closed
- ❌ Data is NOT shared between different tabs
- ❌ Data is NOT synchronized with server

To make data permanent, you would need to integrate with a backend API.

---

## 📊 Dashboard Statistics

### Static vs Dynamic Data

#### Current Implementation (Mostly Static)
The dashboard displays statistics from `dashboardStats` object in `mockData.ts`:

```typescript
{
  totalEmployees: 8,          // ❌ STATIC (hardcoded)
  activeEmployees: 7,         // ❌ STATIC
  attendanceToday: 85,        // ❌ STATIC
  pendingLeaveRequests: 2,    // ❌ STATIC
  payrollStatus: 'In Progress',
  departmentDistribution: [...], // ❌ STATIC
  monthlyAttendance: [...],      // ❌ STATIC
  leaveUsage: [...]              // ❌ STATIC
}
```

**Problem**: These numbers don't update when you add/remove employees or manage leaves.

#### Solution (Dynamic Calculation)
The employee count has been made dynamic by calculating it from the actual employee data stored in sessionStorage.

---

## 🔄 Key Features Data Flow

### 1. Employee Management
```
Pages Used: Employees.tsx
Storage: apu_hr_employees
Functions: getEmployees(), addEmployee(), updateEmployee(), deleteEmployee()

Operations:
- View all employees (with search/filter)
- Add new employee (admin only)
- Edit employee details (admin only)
- Delete/deactivate employee (admin only)
```

### 2. Leave Management
```
Pages Used: LeaveManagement.tsx, LeavePolicies.tsx
Storage: apu_hr_leave_requests, apu_hr_leave_policies, apu_hr_leave_balances
Functions: getLeaveRequests(), addLeaveRequest(), updateLeaveRequestStatus()

Operations:
- View all leave requests (with status filter)
- Apply for leave (all users)
- Approve/reject leave (admin only)
- Cancel leave (requester only, if pending)
- View leave balances
```

### 3. Attendance Tracking
```
Pages Used: Attendance.tsx
Storage: apu_hr_attendance
Functions: getAttendance(), updateAttendanceRecord()

Operations:
- View monthly attendance calendar
- Mark attendance (Present/Absent/Leave)
- View attendance statistics
- Check late arrivals
- Automatic holiday marking
```

### 4. Payroll Management
```
Pages Used: Payroll.tsx, PayrollSetup.tsx
Storage: apu_hr_payroll, apu_hr_payroll_setup
Functions: getPayrollRecords(), calculatePayroll()

Operations:
- Setup employee salary (admin)
- Generate monthly payroll
- Calculate deductions (absent days, unpaid leave)
- Process payroll
- View payroll history
```

### 5. Document Management
```
Pages Used: Documents.tsx
Storage: apu_hr_documents
Functions: getDocuments(), addDocument()

Operations:
- View documents (with category filter)
- Upload new documents
- Download/view documents
- Delete documents (admin only)
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm install        # Install dependencies
npm run dev        # Start development server
```
Access at: `http://localhost:5173`

### Production Build
```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.ts` | Tailwind CSS customization |
| `components.json` | shadcn/ui configuration |
| `package.json` | Dependencies and scripts |

---

## 🎨 UI Components

The application uses **shadcn/ui** components, which are:
- Fully customizable (source code included)
- Accessible (ARIA compliant)
- Based on Radix UI primitives
- Styled with Tailwind CSS

Components are located in `src/components/ui/` and include:
- Forms: Input, Select, Checkbox, Radio, DatePicker
- Overlays: Dialog, Sheet, Popover, Tooltip
- Feedback: Toast, Alert, Progress
- Data Display: Table, Card, Badge, Avatar
- Navigation: Tabs, Accordion, Breadcrumb

---

## 🔍 Important Technical Notes

### 1. No Backend Required
This is a **pure frontend application**. All data is managed in the browser. To convert to a full-stack application, you would need to:
- Create a backend API (Node.js, Python, etc.)
- Replace `storage.ts` functions with API calls
- Add authentication tokens (JWT)
- Use a real database (PostgreSQL, MongoDB, etc.)

### 2. Data is NOT Permanent
- Data resets when browser tab is closed
- Each browser tab has its own isolated data
- Clearing browser data will reset the application

### 3. Security Considerations
- **This is a demo**: No real security implemented
- Passwords are not validated
- No encryption on data
- No protection against XSS/CSRF
- **Do not use in production without proper security implementation**

### 4. Scalability
Current architecture is suitable for:
- ✅ Demo/prototype/showcase
- ✅ Small team testing (< 10 users)
- ❌ Production use
- ❌ Multi-user concurrent access
- ❌ Large datasets (> 1000 records)

---

## 📝 Code Quality Features

- **TypeScript**: Full type safety across the application
- **ESLint**: Code linting for consistency
- **Component-based**: Modular, reusable components
- **Context API**: Centralized state management for auth
- **Custom hooks**: Reusable logic (use-mobile, use-toast)
- **Responsive Design**: Works on mobile, tablet, desktop
- **Dark Mode Support**: Theme switching capability

---

## 🐛 Known Limitations

1. **No data synchronization**: Changes in one tab don't reflect in another
2. **No file upload**: Documents are metadata only (no actual file storage)
3. **No email notifications**: Leave approvals don't trigger emails
4. **No real-time updates**: No WebSocket or polling
5. **No data export**: Cannot export reports to Excel/PDF
6. **No multi-language support**: English only
7. **No audit trail for data changes**: Limited audit logging

---

## 🎯 Future Enhancement Possibilities

1. **Backend Integration**
   - REST API or GraphQL
   - Real database
   - JWT authentication

2. **Advanced Features**
   - Email notifications
   - File upload to cloud storage
   - Real-time updates (WebSocket)
   - Advanced reporting (PDF/Excel export)
   - Multi-language support
   - Role-based permissions (more granular)

3. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Automated testing
   - Monitoring and logging

---

## 📞 Demo Login Credentials

```
Admin Account:
Username: admin
Password: (any)

Faculty Accounts:
Username: faculty1, faculty2, or faculty3
Password: (any)
```

---

## 🏁 Summary

This APU HR Management System is a **frontend demo application** that simulates a complete HR system using:
- React + TypeScript for UI
- Session Storage as a mock database
- shadcn/ui for beautiful components
- Vite for fast development

It's designed to showcase features and UX, not for production use. To make it production-ready, integrate with a proper backend, database, and implement security measures.
