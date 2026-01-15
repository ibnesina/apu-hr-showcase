# APU HR Management System - Showcase Demo

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

A comprehensive, modern HR Management System demo built for Asia Pacific University (APU)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [Key Technologies](#-key-technologies)
- [Available Scripts](#-available-scripts)
- [Documentation](#-documentation)
- [Browser Support](#-browser-support)

---

## 🌟 Overview

This is a **client prototype/showcase** of a comprehensive HR Management System designed for educational institutions. The application demonstrates a full-featured HR interface for managing employees, leave requests, payroll, recruitment, appraisal, attendance tracking, and more.

**Note:** This is a frontend-only demo application that uses browser session storage for data persistence. No backend server is required.

---

## ✨ Features

### 🏢 Core HR Modules

- **Dashboard** - Comprehensive overview with charts and statistics
  - Employee metrics and distribution
  - Attendance trends visualization
  - Leave request summaries
  - Payroll status tracking
  - Interactive charts (Recharts)

- **Employee Management** - Complete CRUD operations
  - Add, edit, delete employees
  - Advanced filtering (department, role, status)
  - Employee profile management
  - Department-wise organization

- **Leave Management** - Full leave request workflow
  - Submit leave requests
  - Approve/reject leave applications
  - Leave balance tracking
  - Leave policy management
  - Holiday calendar

- **Attendance Tracking** - Real-time attendance monitoring
  - Daily check-in/check-out records
  - Calendar view
  - Attendance statistics and reports
  - Shift management

- **Payroll System** - Salary management
  - Payroll processing
  - Salary slip generation
  - Payroll setup and configuration
  - Payment history

- **Document Management** - Centralized document hub
  - Upload and manage HR documents
  - Document categorization
  - Access control

- **Recruitment Module** - End-to-end hiring process
  - Job postings management
  - Application tracking
  - Interview scheduling
  - Candidate evaluation
  - Recruitment reports

- **Performance Appraisal** - Employee evaluation system
  - Appraisal cycles management
  - Performance reviews
  - Goal tracking
  - Reports and analytics

- **Reports & Analytics** - Comprehensive reporting
  - Various HR reports
  - Audit logs
  - Export capabilities

- **Notifications & Alerts** - Real-time updates
  - System notifications
  - Activity tracking

### 🎨 UI/UX Features

- **Dark/Light Mode** - Theme switching support
- **Responsive Design** - Mobile-friendly interface
- **Accessibility** - Built with Radix UI for WCAG compliance
- **Modern UI** - shadcn/ui component library
- **Smooth Animations** - Tailwind CSS animations

---

## 🛠️ Tech Stack

### Frontend Core
- **React 18.3.1** - JavaScript library for building user interfaces
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 5.4.19** - Next-generation frontend tooling

### UI Framework & Design
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful & consistent icon library
- **next-themes** - Dark mode support

### Routing & State
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack React Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Performant form validation
- **Zod 3.25.76** - TypeScript-first schema validation

### Data Visualization
- **Recharts 2.15.4** - Composable charting library

### Utilities
- **date-fns 3.6.0** - Modern JavaScript date utility
- **class-variance-authority** - CSS class utilities
- **clsx & tailwind-merge** - Conditional class merging
- **Sonner** - Toast notifications

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) OR **bun** (v1.0.0 or higher)
- **Git** (for cloning the repository)

### Check your versions:
```bash
node --version
npm --version
```

### Install Node.js
If you don't have Node.js installed, use [nvm](https://github.com/nvm-sh/nvm) (recommended):

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install latest LTS version of Node.js
nvm install --lts
nvm use --lts
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd apu-hr-showcase
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using bun (faster):
```bash
bun install
```

### 3. Verify Installation

Check if all dependencies are installed correctly:
```bash
npm list --depth=0
```

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at:
- **Local:** `http://localhost:8080`
- **Network:** `http://[your-ip]:8080`

### Production Build

Build the application for production:

```bash
npm run build
```

Build files will be generated in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 🔐 Demo Credentials

The application includes pre-configured demo accounts for testing:

### Admin Account
- **Username:** `admin`
- **Password:** Any password (authentication is bypassed for demo)
- **Role:** Administrator
- **Access:** Full system access

### Faculty Accounts

**Faculty 1:**
- **Username:** `faculty1`
- **Name:** Dr. Ahmad Razali
- **Department:** Computer Science

**Faculty 2:**
- **Username:** `faculty2`
- **Name:** Prof. Siti Aminah
- **Department:** Business

**Faculty 3:**
- **Username:** `faculty3`
- **Name:** Mr. Lee Wei Ming
- **Department:** Engineering

**Password:** Any password (authentication is bypassed for demo)

**Note:** All user data is stored in browser session storage and persists only during the current browser session.

---

## 📁 Project Structure

```
apu-hr-showcase/
├── public/                      # Static assets
│   └── robots.txt              # SEO configuration
│
├── src/                         # Source code
│   ├── components/             # React components
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx    # Button component
│   │   │   ├── card.tsx      # Card component
│   │   │   ├── dialog.tsx    # Dialog/modal component
│   │   │   ├── form.tsx      # Form components
│   │   │   ├── table.tsx     # Table component
│   │   │   └── ...           # Other UI components
│   │   ├── layout/           # Layout components
│   │   │   ├── AppHeader.tsx # Main header
│   │   │   ├── AppSidebar.tsx # Navigation sidebar
│   │   │   └── AppLayout.tsx # Main layout wrapper
│   │   └── NavLink.tsx       # Custom nav link
│   │
│   ├── contexts/              # React Context providers
│   │   └── AuthContext.tsx   # Authentication context
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx    # Responsive design hook
│   │   └── use-toast.ts      # Toast notification hook
│   │
│   ├── lib/                   # Utility functions & data
│   │   ├── auth.ts           # Authentication logic
│   │   ├── mockData.ts       # Demo data definitions
│   │   ├── storage.ts        # Session storage utilities
│   │   ├── recruitmentData.ts # Recruitment module data
│   │   ├── appraisalData.ts  # Appraisal module data
│   │   └── utils.ts          # Helper functions
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── FacultyDashboard.tsx # Faculty view
│   │   ├── Employees.tsx     # Employee management
│   │   ├── LeaveManagement.tsx # Leave requests
│   │   ├── Attendance.tsx    # Attendance tracking
│   │   ├── Payroll.tsx       # Payroll management
│   │   ├── Documents.tsx     # Document management
│   │   ├── Reports.tsx       # Reports & analytics
│   │   ├── JobOpenings.tsx   # Recruitment - job postings
│   │   ├── Applications.tsx  # Recruitment - applications
│   │   ├── Interviews.tsx    # Recruitment - interviews
│   │   ├── MyAppraisal.tsx   # Performance appraisal
│   │   ├── Login.tsx         # Login page
│   │   └── ...               # Other pages
│   │
│   ├── App.tsx                # Main app component & routing
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite type definitions
│
├── .eslintrc.config.js         # ESLint configuration
├── components.json             # shadcn/ui configuration
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── postcss.config.js           # PostCSS configuration
├── PROJECT_OVERVIEW.md         # Detailed project overview
├── TECHNICAL_DOCUMENTATION.md  # Technical documentation
└── README.md                   # This file
```

---

## 🔑 Key Technologies

### UI Components (shadcn/ui)

This project uses [shadcn/ui](https://ui.shadcn.com/), a collection of re-usable components built with Radix UI and Tailwind CSS. Key components include:

- Form elements (Input, Textarea, Select, Checkbox, etc.)
- Layout components (Card, Dialog, Sheet, Tabs, etc.)
- Navigation (Sidebar, Navigation Menu, etc.)
- Data display (Table, Avatar, Badge, etc.)
- Feedback (Toast, Alert, Progress, etc.)

### Session Storage

The application uses browser **sessionStorage** for data persistence:

```typescript
// Data persists during the browser session
sessionStorage.setItem('apu_hr_employees', JSON.stringify(employees))
```

**Note:** Data is cleared when the browser tab is closed.

### Authentication Flow

1. User enters credentials on login page
2. System checks username against predefined demo accounts
3. User object is stored in sessionStorage
4. Protected routes check for authenticated user
5. Logout clears sessionStorage

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server on port 8080 |
| **build** | `npm run build` | Build for production (optimized) |
| **build:dev** | `npm run build:dev` | Build in development mode |
| **preview** | `npm run preview` | Preview production build locally |
| **lint** | `npm run lint` | Run ESLint for code quality |

---

## 📚 Documentation

For more detailed information, refer to:

- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Complete project overview and features
- **[TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md)** - In-depth technical documentation
- **[shadcn/ui Docs](https://ui.shadcn.com/)** - UI component documentation
- **[Vite Docs](https://vitejs.dev/)** - Build tool documentation
- **[React Router Docs](https://reactrouter.com/)** - Routing documentation

---

## 🌐 Browser Support

The application is compatible with modern browsers:

- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Opera (v76+)

**Note:** IE11 is not supported.

---

## 🚨 Important Notes

- **Demo Application:** This is a prototype for client demonstration purposes
- **No Backend:** All data is stored in browser sessionStorage
- **Session Persistence:** Data persists only during the current browser session
- **Authentication:** Login uses demo credentials with bypassed password validation
- **Mock Data:** All data is simulated for demonstration

---

## 📞 Support & Contact

For questions or support regarding this demo:

- Check the [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for feature details
- Review [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) for technical info
- Contact the development team

---

## 📄 License

This is a proprietary demo/showcase application developed for Asia Pacific University (APU).

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

</div>
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
