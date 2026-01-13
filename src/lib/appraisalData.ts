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
  criteria: AppraisalCriterion[];
  createdBy: string;
  createdAt: string;
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
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'Not Started' | 'Self Assessment' | 'Submitted' | 'Under Review' | 'Reviewed' | 'Completed';
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

// Default evaluation criteria
export const defaultCriteria: AppraisalCriterion[] = [
  { id: 'teaching', name: 'Teaching Performance', weightage: 30, description: 'Quality of lectures, student engagement, and teaching methodology' },
  { id: 'research', name: 'Research & Publications', weightage: 25, description: 'Research output, publications, and academic contributions' },
  { id: 'admin', name: 'Administrative Contribution', weightage: 15, description: 'Committee work, administrative duties, and institutional service' },
  { id: 'feedback', name: 'Student Feedback', weightage: 15, description: 'Student satisfaction and feedback scores' },
  { id: 'attendance', name: 'Attendance', weightage: 15, description: 'Punctuality, presence, and availability' },
];

// Initial appraisal cycles
export const initialAppraisalCycles: AppraisalCycle[] = [
  {
    id: '1',
    name: 'Annual Appraisal 2025',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'Active',
    criteria: defaultCriteria,
    createdBy: 'Admin',
    createdAt: '2024-12-15',
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
  const newCycle: AppraisalCycle = {
    ...cycle,
    id: Date.now().toString(),
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

// Appraisal functions
export const getAppraisals = (): Appraisal[] => 
  getFromStorage(STORAGE_KEYS.APPRAISALS, []);

export const saveAppraisals = (appraisals: Appraisal[]) => 
  saveToStorage(STORAGE_KEYS.APPRAISALS, appraisals);

export const getAppraisalByEmployeeAndCycle = (employeeId: string, cycleId: string): Appraisal | undefined => {
  const appraisals = getAppraisals();
  return appraisals.find(a => a.employeeId === employeeId && a.cycleId === cycleId);
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
      if (assessment.criterionName.includes('Teaching')) {
        trainingSuggestions.push('Pedagogy enhancement program suggested');
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
    overallSummary = `${appraisal.employeeName} demonstrates exceptional performance across all evaluation criteria. The faculty shows strong dedication to academic excellence with consistent delivery of high-quality teaching and research output. Continued focus on maintaining these standards will further enhance institutional contribution.`;
  } else if (avgScore >= 6) {
    overallSummary = `${appraisal.employeeName} shows good overall performance with notable strengths in core competencies. There are opportunities for improvement in specific areas that, when addressed, will elevate the overall performance profile. The faculty demonstrates commitment to professional growth.`;
  } else {
    overallSummary = `${appraisal.employeeName} has areas requiring attention for performance improvement. A structured development plan focusing on identified gaps is recommended. With targeted support and training, significant improvement is achievable in the upcoming evaluation period.`;
  }
  
  let attendanceImpact = '';
  if (attendanceRate >= 95) {
    attendanceImpact = 'Outstanding attendance record (above 95%) positively contributes to overall performance evaluation, reflecting high commitment and reliability.';
  } else if (attendanceRate >= 85) {
    attendanceImpact = 'Good attendance record maintains satisfactory contribution to performance metrics. Minor improvements in punctuality could further enhance overall assessment.';
  } else {
    attendanceImpact = 'Attendance below expected threshold impacts overall performance evaluation. Improved presence and punctuality are strongly recommended for the next evaluation period.';
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
