// Appraisal & Performance Management Data
// All data is stored in sessionStorage for demo purposes

export interface AppraisalCriterion {
  id: string;
  name: string;
  weightage: number;
  description: string;
}

export interface AppraisalCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed';
  cycleType: 'monthly' | 'annual';
  month?: number; // 1-12 for monthly cycles
  year: number;
  criteria: AppraisalCriterion[];
  createdBy: string;
  createdAt: string;
}

export interface ResearchEntry {
  id: string;
  title: string;
  description: string;
  type: 'journal' | 'conference' | 'book' | 'other';
  documents: string[];
  submittedAt: string;
}

export interface AdminContribution {
  id: string;
  title: string;
  description: string;
  category: 'committee' | 'coordination' | 'mentoring' | 'other';
  submittedAt: string;
}

export interface SelfAssessment {
  criterionId: string;
  criterionName: string;
  score: number;
  comments: string;
  documents?: string[];
}

export interface ReviewerAssessment {
  criterionId: string;
  criterionName: string;
  selfScore: number;
  reviewerScore: number;
  reviewerComments: string;
  isAttendanceAutoSuggested?: boolean;
  attendanceAdjusted?: boolean;
}

export interface AIGeneratedScores {
  research: number;
  admin: number;
  reasoning: string;
  generatedAt: string;
}

export interface SystemScores {
  studentFeedback: number;
  attendance: number;
}

export interface AIInsights {
  overallSummary: string;
  strengths: string[];
  areasForImprovement: string[];
  trainingSuggestions: string[];
  attendanceImpact: string;
  generatedAt: string;
}

export interface Appraisal {
  id: string;
  cycleId: string;
  cycleName: string;
  cycleType: 'monthly' | 'annual';
  month?: number;
  year: number;
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'Not Started' | 'Self Assessment' | 'Submitted' | 'Under Review' | 'Reviewed' | 'Completed';
  // New structure for faculty inputs
  researchEntries: ResearchEntry[];
  adminContributions: AdminContribution[];
  // AI-generated scores based on faculty entries
  aiGeneratedScores?: AIGeneratedScores;
  // System scores (read-only for faculty)
  systemScores?: SystemScores;
  // Legacy fields kept for compatibility
  selfAssessments: SelfAssessment[];
  reviewerAssessments: ReviewerAssessment[];
  reviewerId?: string;
  reviewerName?: string;
  submittedAt?: string;
  reviewedAt?: string;
  completedAt?: string;
  aiInsights?: AIInsights;
  finalScore?: number;
  performanceCategory?: 'Excellent' | 'Good' | 'Needs Improvement';
  finalRecommendations?: string;
  attendanceSummary?: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    lateCount: number;
    attendancePercentage: number;
  };
}

const STORAGE_KEYS = {
  APPRAISAL_CYCLES: 'apu_hr_appraisal_cycles',
  APPRAISALS: 'apu_hr_appraisals',
};

// Default evaluation criteria (4 criteria - Teaching Performance removed)
export const defaultCriteria: AppraisalCriterion[] = [
  { id: 'research', name: 'Research & Publications', weightage: 30, description: 'Research output, publications, and academic contributions' },
  { id: 'admin', name: 'Administrative Contribution', weightage: 25, description: 'Committee work, administrative duties, and institutional service' },
  { id: 'feedback', name: 'Student Feedback', weightage: 25, description: 'Student satisfaction and feedback scores' },
  { id: 'attendance', name: 'Attendance', weightage: 20, description: 'Punctuality, presence, and availability' },
];

// Get month name
const getMonthName = (month: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
};

// Initial monthly appraisal cycles for 2025
export const initialAppraisalCycles: AppraisalCycle[] = [
  {
    id: 'jan-2025',
    name: 'January 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'Active',
    cycleType: 'monthly',
    month: 1,
    year: 2025,
    criteria: defaultCriteria,
    createdBy: 'Admin',
    createdAt: '2024-12-20',
  },
  {
    id: 'dec-2024',
    name: 'December 2024',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'Completed',
    cycleType: 'monthly',
    month: 12,
    year: 2024,
    criteria: defaultCriteria,
    createdBy: 'Admin',
    createdAt: '2024-11-25',
  },
  {
    id: 'nov-2024',
    name: 'November 2024',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    status: 'Completed',
    cycleType: 'monthly',
    month: 11,
    year: 2024,
    criteria: defaultCriteria,
    createdBy: 'Admin',
    createdAt: '2024-10-25',
  },
  {
    id: 'annual-2024',
    name: 'Annual Review 2024',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Completed',
    cycleType: 'annual',
    year: 2024,
    criteria: defaultCriteria,
    createdBy: 'System (Auto-generated)',
    createdAt: '2025-01-01',
  },
];

// Initial demo appraisals with new structure
const initialAppraisals: Appraisal[] = [
  // Faculty 1 - Current month (January 2025) - Self Assessment in progress
  {
    id: '1',
    cycleId: 'jan-2025',
    cycleName: 'January 2025',
    cycleType: 'monthly',
    month: 1,
    year: 2025,
    employeeId: 'emp1',
    employeeName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    status: 'Self Assessment',
    researchEntries: [
      {
        id: 'r1',
        title: 'Machine Learning in Education: A Comprehensive Review',
        description: 'Published in IEEE Transactions on Education, Q1 journal',
        type: 'journal',
        documents: ['paper_ml_education.pdf'],
        submittedAt: '2025-01-05T10:00:00Z',
      },
    ],
    adminContributions: [
      {
        id: 'a1',
        title: 'Curriculum Committee Member',
        description: 'Participated in CS curriculum revision for 2025',
        category: 'committee',
        submittedAt: '2025-01-03T09:00:00Z',
      },
    ],
    aiGeneratedScores: {
      research: 8,
      admin: 7,
      reasoning: 'Based on 1 Q1 journal publication and active committee participation.',
      generatedAt: '2025-01-05T10:05:00Z',
    },
    systemScores: {
      studentFeedback: 9,
      attendance: 9,
    },
    selfAssessments: [],
    reviewerAssessments: [],
    attendanceSummary: { totalWorkingDays: 22, presentDays: 21, absentDays: 0, leaveDays: 1, lateCount: 1, attendancePercentage: 95 },
  },
  // Faculty 1 - December 2024 - Completed
  {
    id: '2',
    cycleId: 'dec-2024',
    cycleName: 'December 2024',
    cycleType: 'monthly',
    month: 12,
    year: 2024,
    employeeId: 'emp1',
    employeeName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    status: 'Completed',
    researchEntries: [
      {
        id: 'r2',
        title: 'Deep Learning Approaches for Student Performance Prediction',
        description: 'Conference paper at ICML 2024',
        type: 'conference',
        documents: ['icml_paper.pdf'],
        submittedAt: '2024-12-10T11:00:00Z',
      },
    ],
    adminContributions: [
      {
        id: 'a2',
        title: 'Exam Coordination',
        description: 'Coordinated final exams for CS department',
        category: 'coordination',
        submittedAt: '2024-12-05T14:00:00Z',
      },
    ],
    aiGeneratedScores: {
      research: 7,
      admin: 8,
      reasoning: 'Conference paper submission and excellent exam coordination duties.',
      generatedAt: '2024-12-15T09:00:00Z',
    },
    systemScores: {
      studentFeedback: 8,
      attendance: 9,
    },
    selfAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', score: 7, comments: 'ICML conference paper' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 8, comments: 'Exam coordination' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Good semester feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 9, comments: 'Excellent attendance' },
    ],
    reviewerAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 7, reviewerScore: 7, reviewerComments: 'Good research output' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 8, reviewerScore: 8, reviewerComments: 'Great coordination work' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 8, reviewerScore: 8, reviewerComments: 'Consistent feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent record', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev1',
    reviewerName: 'Dr. Amanda Williams',
    submittedAt: '2024-12-15T10:00:00Z',
    reviewedAt: '2024-12-20T14:00:00Z',
    completedAt: '2024-12-28T09:00:00Z',
    finalScore: 8.2,
    performanceCategory: 'Excellent',
    finalRecommendations: 'Continue excellent work. Consider for research grant opportunities.',
    attendanceSummary: { totalWorkingDays: 20, presentDays: 19, absentDays: 0, leaveDays: 1, lateCount: 0, attendancePercentage: 95 },
    aiInsights: {
      overallSummary: 'Dr. Sarah Johnson demonstrates exceptional performance across all criteria with strong research output and excellent teaching delivery.',
      strengths: ['Outstanding teaching performance', 'Strong research publications', 'Excellent attendance record'],
      areasForImprovement: ['Continue expanding research collaborations'],
      trainingSuggestions: ['Grant writing workshop for increased funding opportunities'],
      attendanceImpact: 'Excellent attendance (95%) positively impacts overall performance.',
      generatedAt: '2024-12-20T14:00:00Z',
    },
  },
  // Faculty 2 - January 2025 - Submitted
  {
    id: '3',
    cycleId: 'jan-2025',
    cycleName: 'January 2025',
    cycleType: 'monthly',
    month: 1,
    year: 2025,
    employeeId: 'emp2',
    employeeName: 'Prof. Michael Chen',
    department: 'Business Administration',
    status: 'Submitted',
    researchEntries: [
      {
        id: 'r3',
        title: 'Strategic Management in Digital Era',
        description: 'Book chapter in Springer publication',
        type: 'book',
        documents: ['springer_chapter.pdf'],
        submittedAt: '2025-01-08T09:00:00Z',
      },
      {
        id: 'r4',
        title: 'MBA Case Study: Tech Startup Success',
        description: 'Case study accepted by Harvard Business Review',
        type: 'other',
        documents: ['hbr_case.pdf'],
        submittedAt: '2025-01-10T11:00:00Z',
      },
    ],
    adminContributions: [
      {
        id: 'a3',
        title: 'MBA Program Coordinator',
        description: 'Coordinating entire MBA program activities',
        category: 'coordination',
        submittedAt: '2025-01-02T08:00:00Z',
      },
      {
        id: 'a4',
        title: 'Student Mentoring',
        description: 'Mentoring 5 MBA students on their dissertations',
        category: 'mentoring',
        submittedAt: '2025-01-05T10:00:00Z',
      },
    ],
    aiGeneratedScores: {
      research: 9,
      admin: 9,
      reasoning: 'Exceptional output with book chapter and HBR case study. Outstanding administrative contributions as program coordinator and active mentoring.',
      generatedAt: '2025-01-10T12:00:00Z',
    },
    systemScores: {
      studentFeedback: 8,
      attendance: 8,
    },
    selfAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', score: 9, comments: 'Book chapter + HBR case' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 9, comments: 'MBA coordination + mentoring' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Positive MBA feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 8, comments: 'Good attendance' },
    ],
    reviewerAssessments: [],
    submittedAt: '2025-01-10T14:00:00Z',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 20, absentDays: 1, leaveDays: 1, lateCount: 2, attendancePercentage: 91 },
  },
  // Faculty 3 - January 2025 - Reviewed (pending finalization)
  {
    id: '4',
    cycleId: 'jan-2025',
    cycleName: 'January 2025',
    cycleType: 'monthly',
    month: 1,
    year: 2025,
    employeeId: 'emp3',
    employeeName: 'Dr. Emily Rodriguez',
    department: 'Engineering',
    status: 'Reviewed',
    researchEntries: [
      {
        id: 'r5',
        title: 'Renewable Energy Systems: Design & Implementation',
        description: 'Published in Energy Journal (Impact Factor 8.5)',
        type: 'journal',
        documents: ['energy_journal.pdf'],
        submittedAt: '2025-01-04T10:00:00Z',
      },
    ],
    adminContributions: [
      {
        id: 'a5',
        title: 'Safety Committee Chair',
        description: 'Leading department safety initiatives',
        category: 'committee',
        submittedAt: '2025-01-02T09:00:00Z',
      },
    ],
    aiGeneratedScores: {
      research: 9,
      admin: 7,
      reasoning: 'High-impact journal publication (IF 8.5). Solid administrative contribution as safety chair.',
      generatedAt: '2025-01-08T10:00:00Z',
    },
    systemScores: {
      studentFeedback: 8,
      attendance: 9,
    },
    selfAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', score: 9, comments: 'High-impact journal' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 7, comments: 'Safety committee' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Good lab feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 9, comments: 'Excellent attendance' },
    ],
    reviewerAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent publication' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 7, reviewerScore: 7, reviewerComments: 'Good safety management' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 8, reviewerScore: 8, reviewerComments: 'Consistent feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev2',
    reviewerName: 'Prof. James Wilson',
    submittedAt: '2025-01-08T11:00:00Z',
    reviewedAt: '2025-01-12T10:00:00Z',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 21, absentDays: 0, leaveDays: 1, lateCount: 0, attendancePercentage: 95 },
    aiInsights: {
      overallSummary: 'Dr. Emily Rodriguez demonstrates outstanding research capability with high-impact publications. Strong teaching and attendance record.',
      strengths: ['Exceptional research output', 'Strong teaching methodology', 'Excellent attendance'],
      areasForImprovement: ['Expand administrative contributions'],
      trainingSuggestions: ['Leadership program for future department roles'],
      attendanceImpact: 'Outstanding attendance (95%) demonstrates high commitment.',
      generatedAt: '2025-01-12T10:00:00Z',
    },
  },
  // Faculty 4 - November 2024 - Completed
  {
    id: '5',
    cycleId: 'nov-2024',
    cycleName: 'November 2024',
    cycleType: 'monthly',
    month: 11,
    year: 2024,
    employeeId: 'emp1',
    employeeName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    status: 'Completed',
    researchEntries: [
      {
        id: 'r6',
        title: 'AI Ethics in Higher Education',
        description: 'Journal of Educational Technology',
        type: 'journal',
        documents: ['ai_ethics.pdf'],
        submittedAt: '2024-11-15T09:00:00Z',
      },
    ],
    adminContributions: [
      {
        id: 'a6',
        title: 'Accreditation Documentation',
        description: 'Prepared CS program accreditation documents',
        category: 'coordination',
        submittedAt: '2024-11-20T10:00:00Z',
      },
    ],
    aiGeneratedScores: {
      research: 7,
      admin: 8,
      reasoning: 'Solid journal publication and excellent accreditation preparation work.',
      generatedAt: '2024-11-22T09:00:00Z',
    },
    systemScores: {
      studentFeedback: 8,
      attendance: 9,
    },
    selfAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', score: 7, comments: 'Journal publication' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 8, comments: 'Accreditation work' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Positive feedback' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 9, comments: 'Excellent' },
    ],
    reviewerAssessments: [
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 7, reviewerScore: 7, reviewerComments: 'Solid output' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 8, reviewerScore: 8, reviewerComments: 'Excellent accreditation prep' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 8, reviewerScore: 8, reviewerComments: 'Good' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev1',
    reviewerName: 'Dr. Amanda Williams',
    submittedAt: '2024-11-22T10:00:00Z',
    reviewedAt: '2024-11-26T14:00:00Z',
    completedAt: '2024-11-30T09:00:00Z',
    finalScore: 8.0,
    performanceCategory: 'Excellent',
    finalRecommendations: 'Maintain strong performance. Good candidate for senior roles.',
    attendanceSummary: { totalWorkingDays: 21, presentDays: 20, absentDays: 0, leaveDays: 1, lateCount: 1, attendancePercentage: 95 },
    aiInsights: {
      overallSummary: 'Dr. Sarah Johnson shows consistent excellent performance across all evaluation criteria.',
      strengths: ['Consistent high performance', 'Strong attendance', 'Good research output'],
      areasForImprovement: ['Continue expanding research portfolio'],
      trainingSuggestions: ['Advanced research methodology course'],
      attendanceImpact: 'Excellent attendance positively contributes to evaluation.',
      generatedAt: '2024-11-26T14:00:00Z',
    },
  },
  // Annual 2024 - Auto-generated summary for Dr. Sarah Johnson
  {
    id: '6',
    cycleId: 'annual-2024',
    cycleName: 'Annual Review 2024',
    cycleType: 'annual',
    year: 2024,
    employeeId: 'emp1',
    employeeName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    status: 'Completed',
    researchEntries: [],
    adminContributions: [],
    selfAssessments: [],
    reviewerAssessments: [],
    submittedAt: '2025-01-01T00:00:00Z',
    reviewedAt: '2025-01-01T00:00:00Z',
    completedAt: '2025-01-02T09:00:00Z',
    finalScore: 8.1,
    performanceCategory: 'Excellent',
    finalRecommendations: 'Based on consistent monthly performance, Dr. Johnson is recommended for promotion consideration.',
    attendanceSummary: { totalWorkingDays: 240, presentDays: 228, absentDays: 2, leaveDays: 10, lateCount: 5, attendancePercentage: 95 },
    aiInsights: {
      overallSummary: 'Annual summary based on 12 monthly appraisals. Dr. Sarah Johnson maintained excellent performance throughout 2024 with an average score of 8.1. Strong in research and administrative contributions with consistent attendance.',
      strengths: ['Consistent excellence across all months', 'Strong publication record', 'Reliable attendance'],
      areasForImprovement: ['Increase industry collaboration'],
      trainingSuggestions: ['Leadership development for future department head role'],
      attendanceImpact: 'Annual attendance rate of 95% demonstrates exceptional commitment.',
      generatedAt: '2025-01-01T00:00:00Z',
    },
  },
];

// Generic storage functions
function getFromStorage<T>(key: string, initialData: T[]): T[] {
  const stored = sessionStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  sessionStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

function saveToStorage<T>(key: string, data: T[]): void {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// Appraisal Cycle functions
export const getAppraisalCycles = (): AppraisalCycle[] => 
  getFromStorage(STORAGE_KEYS.APPRAISAL_CYCLES, initialAppraisalCycles);

export const saveAppraisalCycles = (cycles: AppraisalCycle[]) => 
  saveToStorage(STORAGE_KEYS.APPRAISAL_CYCLES, cycles);

export const addAppraisalCycle = (cycle: Omit<AppraisalCycle, 'id' | 'createdAt'>): AppraisalCycle => {
  const cycles = getAppraisalCycles();
  const id = cycle.cycleType === 'monthly' 
    ? `${getMonthName(cycle.month || 1).toLowerCase().slice(0, 3)}-${cycle.year}`
    : `annual-${cycle.year}`;
  
  const newCycle: AppraisalCycle = {
    ...cycle,
    id,
    createdAt: new Date().toISOString().split('T')[0],
  };
  cycles.push(newCycle);
  saveAppraisalCycles(cycles);
  return newCycle;
};

export const updateAppraisalCycle = (id: string, updates: Partial<AppraisalCycle>): AppraisalCycle | null => {
  const cycles = getAppraisalCycles();
  const index = cycles.findIndex(c => c.id === id);
  if (index !== -1) {
    cycles[index] = { ...cycles[index], ...updates };
    saveAppraisalCycles(cycles);
    return cycles[index];
  }
  return null;
};

export const deleteAppraisalCycle = (id: string): boolean => {
  const cycles = getAppraisalCycles();
  const filtered = cycles.filter(c => c.id !== id);
  if (filtered.length !== cycles.length) {
    saveAppraisalCycles(filtered);
    return true;
  }
  return false;
};

// Get monthly cycles for a specific year
export const getMonthlyCycles = (year: number): AppraisalCycle[] => {
  return getAppraisalCycles().filter(c => c.cycleType === 'monthly' && c.year === year);
};

// Get annual cycle for a year
export const getAnnualCycle = (year: number): AppraisalCycle | undefined => {
  return getAppraisalCycles().find(c => c.cycleType === 'annual' && c.year === year);
};

// Appraisal functions
export const getAppraisals = (): Appraisal[] => 
  getFromStorage(STORAGE_KEYS.APPRAISALS, initialAppraisals);

export const saveAppraisals = (appraisals: Appraisal[]) => 
  saveToStorage(STORAGE_KEYS.APPRAISALS, appraisals);

export const getAppraisalByEmployeeAndCycle = (employeeId: string, cycleId: string): Appraisal | undefined => {
  const appraisals = getAppraisals();
  return appraisals.find(a => a.employeeId === employeeId && a.cycleId === cycleId);
};

export const getAppraisalsByEmployee = (employeeId: string): Appraisal[] => {
  return getAppraisals().filter(a => a.employeeId === employeeId);
};

export const getMonthlyAppraisalsByEmployee = (employeeId: string, year?: number): Appraisal[] => {
  const appraisals = getAppraisals().filter(a => 
    a.employeeId === employeeId && a.cycleType === 'monthly'
  );
  if (year) {
    return appraisals.filter(a => a.year === year);
  }
  return appraisals;
};

export const createOrUpdateAppraisal = (appraisal: Omit<Appraisal, 'id'> & { id?: string }): Appraisal => {
  const appraisals = getAppraisals();
  
  if (appraisal.id) {
    const index = appraisals.findIndex(a => a.id === appraisal.id);
    if (index !== -1) {
      appraisals[index] = { ...appraisals[index], ...appraisal } as Appraisal;
      saveAppraisals(appraisals);
      return appraisals[index];
    }
  }
  
  const newAppraisal: Appraisal = {
    ...appraisal,
    id: Date.now().toString(),
  } as Appraisal;
  appraisals.push(newAppraisal);
  saveAppraisals(appraisals);
  return newAppraisal;
};

export const updateAppraisalStatus = (id: string, status: Appraisal['status']): Appraisal | null => {
  const appraisals = getAppraisals();
  const index = appraisals.findIndex(a => a.id === id);
  if (index !== -1) {
    appraisals[index].status = status;
    if (status === 'Submitted') {
      appraisals[index].submittedAt = new Date().toISOString();
    } else if (status === 'Reviewed') {
      appraisals[index].reviewedAt = new Date().toISOString();
    } else if (status === 'Completed') {
      appraisals[index].completedAt = new Date().toISOString();
    }
    saveAppraisals(appraisals);
    return appraisals[index];
  }
  return null;
};

// AI Score Generator (Simulated - Rule-based)
export const generateAIScoresForEntry = (
  researchEntries: ResearchEntry[],
  adminContributions: AdminContribution[]
): AIGeneratedScores => {
  let researchScore = 5;
  let adminScore = 5;
  const reasons: string[] = [];

  // Calculate research score based on entries
  if (researchEntries.length === 0) {
    researchScore = 4;
    reasons.push('No research submissions this month.');
  } else {
    const journalCount = researchEntries.filter(r => r.type === 'journal').length;
    const conferenceCount = researchEntries.filter(r => r.type === 'conference').length;
    const bookCount = researchEntries.filter(r => r.type === 'book').length;
    const otherCount = researchEntries.filter(r => r.type === 'other').length;

    researchScore = Math.min(10, 5 + (journalCount * 2) + (conferenceCount * 1.5) + (bookCount * 2) + (otherCount * 1));
    
    if (journalCount > 0) reasons.push(`${journalCount} journal publication(s)`);
    if (conferenceCount > 0) reasons.push(`${conferenceCount} conference paper(s)`);
    if (bookCount > 0) reasons.push(`${bookCount} book/chapter(s)`);
    if (otherCount > 0) reasons.push(`${otherCount} other contribution(s)`);
  }

  // Calculate admin score based on contributions
  if (adminContributions.length === 0) {
    adminScore = 4;
    reasons.push('No administrative contributions recorded.');
  } else {
    const committeeCount = adminContributions.filter(a => a.category === 'committee').length;
    const coordinationCount = adminContributions.filter(a => a.category === 'coordination').length;
    const mentoringCount = adminContributions.filter(a => a.category === 'mentoring').length;
    const otherCount = adminContributions.filter(a => a.category === 'other').length;

    adminScore = Math.min(10, 5 + (coordinationCount * 2) + (committeeCount * 1.5) + (mentoringCount * 1.5) + (otherCount * 1));
    
    if (coordinationCount > 0) reasons.push(`${coordinationCount} coordination role(s)`);
    if (committeeCount > 0) reasons.push(`${committeeCount} committee involvement(s)`);
    if (mentoringCount > 0) reasons.push(`${mentoringCount} mentoring activity(ies)`);
  }

  return {
    research: Math.round(researchScore * 10) / 10,
    admin: Math.round(adminScore * 10) / 10,
    reasoning: reasons.join('. ') + '.',
    generatedAt: new Date().toISOString(),
  };
};

// AI Insights Generator (Rule-based simulation)
export const generateAIInsights = (appraisal: Appraisal): AIInsights => {
  const reviewerScores = appraisal.reviewerAssessments || [];
  const avgScore = reviewerScores.length > 0 
    ? reviewerScores.reduce((sum, a) => sum + a.reviewerScore, 0) / reviewerScores.length 
    : 0;
  
  const attendance = appraisal.attendanceSummary;
  const attendanceRate = attendance?.attendancePercentage || 85;
  
  // Rule-based strengths
  const strengths: string[] = [];
  const improvements: string[] = [];
  const trainingSuggestions: string[] = [];
  
  reviewerScores.forEach(assessment => {
    if (assessment.reviewerScore >= 8) {
      strengths.push(`Strong performance in ${assessment.criterionName}`);
    } else if (assessment.reviewerScore <= 5) {
      improvements.push(`Enhancement needed in ${assessment.criterionName}`);
      if (assessment.criterionName.includes('Research')) {
        trainingSuggestions.push('Research methodology workshop recommended');
      }
    }
  });
  
  if (attendanceRate >= 95) {
    strengths.push('Excellent attendance record demonstrates strong commitment');
  } else if (attendanceRate < 80) {
    improvements.push('Attendance consistency requires attention');
    trainingSuggestions.push('Time management workshop recommended');
  }
  
  if (strengths.length === 0) {
    strengths.push('Consistent performance across evaluation criteria');
  }
  if (improvements.length === 0) {
    improvements.push('Continue current trajectory with focus on innovation');
  }
  if (trainingSuggestions.length === 0) {
    trainingSuggestions.push('Leadership development program for career advancement');
  }
  
  // Generate summary based on score
  let overallSummary = '';
  if (avgScore >= 8) {
    overallSummary = `${appraisal.employeeName} demonstrates exceptional performance across all evaluation criteria. The faculty shows strong dedication to academic excellence with consistent research output and administrative contributions.`;
  } else if (avgScore >= 6) {
    overallSummary = `${appraisal.employeeName} shows good overall performance with notable strengths in core competencies. There are opportunities for improvement that, when addressed, will elevate the overall performance profile.`;
  } else {
    overallSummary = `${appraisal.employeeName} has areas requiring attention for performance improvement. A structured development plan focusing on identified gaps is recommended.`;
  }
  
  let attendanceImpact = '';
  if (attendanceRate >= 95) {
    attendanceImpact = 'Outstanding attendance record (above 95%) positively contributes to overall performance evaluation.';
  } else if (attendanceRate >= 85) {
    attendanceImpact = 'Good attendance record maintains satisfactory contribution to performance metrics.';
  } else {
    attendanceImpact = 'Attendance below expected threshold impacts overall performance evaluation.';
  }
  
  return {
    overallSummary,
    strengths,
    areasForImprovement: improvements,
    trainingSuggestions,
    attendanceImpact,
    generatedAt: new Date().toISOString(),
  };
};

// Calculate attendance summary from attendance records
export const calculateAttendanceSummary = (employeeId: string): Appraisal['attendanceSummary'] => {
  // Simulated attendance data - in real scenario would fetch from attendance records
  const totalWorkingDays = 22;
  const presentDays = Math.floor(Math.random() * 4) + 18; // 18-22
  const leaveDays = Math.floor(Math.random() * 3);
  const absentDays = totalWorkingDays - presentDays - leaveDays;
  const lateCount = Math.floor(Math.random() * 5);
  
  return {
    totalWorkingDays,
    presentDays,
    absentDays: Math.max(0, absentDays),
    leaveDays,
    lateCount,
    attendancePercentage: Math.round((presentDays / totalWorkingDays) * 100),
  };
};

// Calculate suggested attendance score based on attendance data
export const calculateAttendanceScore = (summary: Appraisal['attendanceSummary']): number => {
  if (!summary) return 7;
  const { attendancePercentage, lateCount } = summary;
  
  let score = 10;
  if (attendancePercentage < 95) score -= 1;
  if (attendancePercentage < 90) score -= 1;
  if (attendancePercentage < 85) score -= 2;
  if (attendancePercentage < 80) score -= 2;
  if (lateCount > 3) score -= 1;
  if (lateCount > 5) score -= 1;
  
  return Math.max(1, score);
};

// Generate mock system scores (Student Feedback, Attendance)
export const generateSystemScores = (employeeId: string, attendanceSummary?: Appraisal['attendanceSummary']): SystemScores => {
  // Mock data - would come from respective modules
  return {
    studentFeedback: Math.floor(Math.random() * 3) + 7, // 7-9
    attendance: attendanceSummary ? calculateAttendanceScore(attendanceSummary) : 8,
  };
};

// Get available months for creating appraisals - ONLY returns months with Active cycles
export const getAvailableMonthsForAppraisal = (employeeId: string, year: number): number[] => {
  const existingAppraisals = getMonthlyAppraisalsByEmployee(employeeId, year);
  const existingMonths = existingAppraisals.map(a => a.month).filter(Boolean) as number[];
  
  // Get all ACTIVE monthly cycles for the year
  const activeCycles = getAppraisalCycles().filter(
    c => c.cycleType === 'monthly' && c.year === year && c.status === 'Active'
  );
  const activeMonths = activeCycles.map(c => c.month).filter(Boolean) as number[];
  
  // Return active months that don't already have an appraisal
  return activeMonths.filter(m => !existingMonths.includes(m));
};
