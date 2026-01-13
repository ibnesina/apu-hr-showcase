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

// Initial demo appraisals data
const initialAppraisals: Appraisal[] = [
  {
    id: '1',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp1',
    employeeName: 'Dr. Sarah Johnson',
    department: 'Computer Science',
    status: 'Submitted',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 8, comments: 'Achieved excellent student feedback ratings. Introduced innovative teaching methods including flipped classroom approach.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 7, comments: 'Published 3 papers in peer-reviewed journals. Ongoing research in AI/ML applications.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 8, comments: 'Led the curriculum revision committee. Active participation in faculty meetings.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 9, comments: 'Received 4.7/5.0 average rating from students across all courses.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 9, comments: 'Maintained excellent attendance throughout the evaluation period.' },
    ],
    reviewerAssessments: [],
    submittedAt: '2025-01-10T09:30:00Z',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 21, absentDays: 0, leaveDays: 1, lateCount: 1, attendancePercentage: 95 },
  },
  {
    id: '2',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp2',
    employeeName: 'Prof. Michael Chen',
    department: 'Business Administration',
    status: 'Reviewed',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 9, comments: 'Outstanding teaching delivery with case-study approach.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 8, comments: 'Published 2 papers and 1 book chapter on strategic management.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 7, comments: 'Served as MBA program coordinator.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Consistent positive feedback from MBA students.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 8, comments: 'Good attendance record with occasional conference travel.' },
    ],
    reviewerAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent classroom engagement observed.' },
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 8, reviewerScore: 8, reviewerComments: 'Strong research output with quality publications.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 7, reviewerScore: 7, reviewerComments: 'Effective program coordination.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 8, reviewerScore: 8, reviewerComments: 'Consistent feedback scores.' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 8, reviewerScore: 8, reviewerComments: 'Satisfactory attendance.', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev1',
    reviewerName: 'Dr. Amanda Williams',
    submittedAt: '2025-01-08T14:20:00Z',
    reviewedAt: '2025-01-12T10:15:00Z',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 20, absentDays: 1, leaveDays: 1, lateCount: 2, attendancePercentage: 91 },
    aiInsights: {
      overallSummary: 'Prof. Michael Chen demonstrates exceptional performance across all evaluation criteria. The faculty shows strong dedication to academic excellence with consistent delivery of high-quality teaching and notable research output. His coordination of the MBA program reflects strong administrative capabilities.',
      strengths: ['Strong performance in Teaching Performance', 'Strong performance in Research & Publications', 'Excellent student engagement and feedback'],
      areasForImprovement: ['Continue current trajectory with focus on innovation', 'Expand research collaboration opportunities'],
      trainingSuggestions: ['Leadership development program for career advancement', 'Advanced research methodology workshop'],
      attendanceImpact: 'Good attendance record (91%) maintains satisfactory contribution to performance metrics. Conference-related absences are professionally justified.',
      generatedAt: '2025-01-12T10:15:00Z',
    },
  },
  {
    id: '3',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp3',
    employeeName: 'Dr. Emily Rodriguez',
    department: 'Engineering',
    status: 'Completed',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 8, comments: 'Focused on practical engineering applications.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 9, comments: 'Lead researcher on 2 funded projects.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 7, comments: 'Department safety coordinator.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 8, comments: 'Highly rated for practical lab sessions.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 9, comments: 'Excellent attendance.' },
    ],
    reviewerAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', selfScore: 8, reviewerScore: 8, reviewerComments: 'Practical approach well received.' },
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 9, reviewerScore: 9, reviewerComments: 'Outstanding research leadership.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 7, reviewerScore: 7, reviewerComments: 'Effective safety management.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 8, reviewerScore: 8, reviewerComments: 'Strong practical teaching.' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Excellent record.', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev2',
    reviewerName: 'Prof. James Wilson',
    submittedAt: '2025-01-05T11:00:00Z',
    reviewedAt: '2025-01-10T14:30:00Z',
    completedAt: '2025-01-13T09:00:00Z',
    finalScore: 8.2,
    performanceCategory: 'Excellent',
    finalRecommendations: 'Continue research leadership role. Consider for department head position in future.',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 21, absentDays: 0, leaveDays: 1, lateCount: 0, attendancePercentage: 95 },
    aiInsights: {
      overallSummary: 'Dr. Emily Rodriguez demonstrates exceptional performance with outstanding research output and strong teaching delivery. Her leadership in funded research projects and practical approach to engineering education makes her a valuable asset to the department.',
      strengths: ['Strong performance in Research & Publications', 'Strong performance in Attendance', 'Excellent research leadership', 'Practical teaching approach'],
      areasForImprovement: ['Continue current trajectory with focus on innovation', 'Expand student mentorship activities'],
      trainingSuggestions: ['Leadership development program for career advancement', 'Grant writing workshop for increased funding'],
      attendanceImpact: 'Outstanding attendance record (95%) positively contributes to overall performance evaluation, reflecting high commitment and reliability.',
      generatedAt: '2025-01-10T14:30:00Z',
    },
  },
  {
    id: '4',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp4',
    employeeName: 'Dr. David Kim',
    department: 'Computer Science',
    status: 'Completed',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 7, comments: 'Taught advanced programming courses.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 6, comments: 'Working on PhD completion.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 6, comments: 'Lab maintenance duties.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 7, comments: 'Good feedback from students.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 7, comments: 'Satisfactory attendance.' },
    ],
    reviewerAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', selfScore: 7, reviewerScore: 7, reviewerComments: 'Solid teaching performance.' },
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 6, reviewerScore: 6, reviewerComments: 'PhD focus understandable, expect more post-completion.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 6, reviewerScore: 6, reviewerComments: 'Adequate contribution.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 7, reviewerScore: 7, reviewerComments: 'Positive student feedback.' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 7, reviewerScore: 7, reviewerComments: 'Room for improvement.', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev1',
    reviewerName: 'Dr. Amanda Williams',
    submittedAt: '2025-01-06T10:00:00Z',
    reviewedAt: '2025-01-11T15:00:00Z',
    completedAt: '2025-01-13T10:30:00Z',
    finalScore: 6.6,
    performanceCategory: 'Good',
    finalRecommendations: 'Support PhD completion. Assign research mentor post-completion.',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 19, absentDays: 2, leaveDays: 1, lateCount: 3, attendancePercentage: 86 },
    aiInsights: {
      overallSummary: 'Dr. David Kim shows good overall performance with notable strengths in core teaching competencies. PhD completion focus is understandable. With targeted support and training, significant improvement is achievable in the upcoming evaluation period.',
      strengths: ['Solid teaching delivery', 'Consistent performance across evaluation criteria'],
      areasForImprovement: ['Enhancement needed in Research & Publications', 'Attendance consistency requires attention'],
      trainingSuggestions: ['Research methodology workshop recommended', 'Time management workshop recommended'],
      attendanceImpact: 'Good attendance record (86%) maintains satisfactory contribution to performance metrics. Minor improvements in punctuality recommended.',
      generatedAt: '2025-01-11T15:00:00Z',
    },
  },
  {
    id: '5',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp5',
    employeeName: 'Prof. Lisa Thompson',
    department: 'Business Administration',
    status: 'Completed',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 9, comments: 'Led executive education programs.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 9, comments: 'Published in top-tier journals.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 8, comments: 'Faculty development lead.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 9, comments: 'Highest rated professor in department.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 10, comments: 'Perfect attendance.' },
    ],
    reviewerAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', selfScore: 9, reviewerScore: 9, reviewerComments: 'Exceptional teaching.' },
      { criterionId: 'research', criterionName: 'Research & Publications', selfScore: 9, reviewerScore: 9, reviewerComments: 'Top-tier publications.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', selfScore: 8, reviewerScore: 9, reviewerComments: 'Outstanding leadership.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', selfScore: 9, reviewerScore: 9, reviewerComments: 'Best in class.' },
      { criterionId: 'attendance', criterionName: 'Attendance', selfScore: 10, reviewerScore: 10, reviewerComments: 'Perfect record.', isAttendanceAutoSuggested: true },
    ],
    reviewerId: 'rev3',
    reviewerName: 'Dean Robert Brown',
    submittedAt: '2025-01-04T09:00:00Z',
    reviewedAt: '2025-01-09T11:00:00Z',
    completedAt: '2025-01-12T16:00:00Z',
    finalScore: 9.2,
    performanceCategory: 'Excellent',
    finalRecommendations: 'Strong candidate for department head. Continue mentoring junior faculty.',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 22, absentDays: 0, leaveDays: 0, lateCount: 0, attendancePercentage: 100 },
    aiInsights: {
      overallSummary: 'Prof. Lisa Thompson demonstrates exceptional performance across all evaluation criteria. Her outstanding teaching, research excellence, and perfect attendance make her a model faculty member. Strong leadership potential identified.',
      strengths: ['Strong performance in Teaching Performance', 'Strong performance in Research & Publications', 'Strong performance in Student Feedback', 'Excellent attendance record demonstrates strong commitment'],
      areasForImprovement: ['Continue current trajectory with focus on innovation'],
      trainingSuggestions: ['Leadership development program for career advancement'],
      attendanceImpact: 'Outstanding attendance record (100%) positively contributes to overall performance evaluation, reflecting exceptional commitment and reliability.',
      generatedAt: '2025-01-09T11:00:00Z',
    },
  },
  {
    id: '6',
    cycleId: '1',
    cycleName: 'Annual Appraisal 2025',
    employeeId: 'emp6',
    employeeName: 'Dr. Robert Martinez',
    department: 'Engineering',
    status: 'Submitted',
    selfAssessments: [
      { criterionId: 'teaching', criterionName: 'Teaching Performance', score: 7, comments: 'Taught mechanical design courses with hands-on projects.' },
      { criterionId: 'research', criterionName: 'Research & Publications', score: 7, comments: 'Working on renewable energy research with 1 paper under review.' },
      { criterionId: 'admin', criterionName: 'Administrative Contribution', score: 6, comments: 'Member of equipment procurement committee.' },
      { criterionId: 'feedback', criterionName: 'Student Feedback', score: 7, comments: 'Positive feedback for practical approach.' },
      { criterionId: 'attendance', criterionName: 'Attendance', score: 8, comments: 'Good attendance maintained.' },
    ],
    reviewerAssessments: [],
    submittedAt: '2025-01-11T16:45:00Z',
    attendanceSummary: { totalWorkingDays: 22, presentDays: 20, absentDays: 1, leaveDays: 1, lateCount: 2, attendancePercentage: 91 },
  },
];

// Appraisal functions
export const getAppraisals = (): Appraisal[] => 
  getFromStorage(STORAGE_KEYS.APPRAISALS, initialAppraisals);

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
