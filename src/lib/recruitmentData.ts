// Recruitment & ATS Data
// All data is stored in sessionStorage for demo purposes

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  employmentType: 'Academic' | 'Non-Academic';
  qualifications: string;
  experienceLevel: string;
  description: string;
  status: 'Draft' | 'Published' | 'Closed';
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  resumeFileName: string;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedAt: string;
  aiInsights?: AIInsights;
  interviews: Interview[];
  finalComments?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  scheduledDate: string;
  interviewType: 'Online' | 'In-person';
  panelMembers: string[];
  notes: string;
  outcome: 'Pending' | 'Passed' | 'Failed' | 'On Hold';
  createdAt: string;
}

export interface AIInsights {
  resumeSummary: string;
  skillMatchScore: number;
  strengths: string[];
  skillGaps: string[];
  overallAssessment: string;
  generatedAt: string;
}

const STORAGE_KEYS = {
  JOB_OPENINGS: 'apu_hr_job_openings',
  APPLICATIONS: 'apu_hr_applications',
};

// Helper functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = sessionStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = <T>(key: string, data: T): void => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

// Initial mock data
const initialJobOpenings: JobOpening[] = [
  {
    id: 'job1',
    title: 'Senior Lecturer - Computer Science',
    department: 'School of Computing',
    employmentType: 'Academic',
    qualifications: 'PhD in Computer Science or related field. Teaching experience preferred.',
    experienceLevel: '5+ years',
    description: 'We are seeking a passionate Senior Lecturer to join our Computer Science department. The role involves teaching undergraduate and postgraduate courses, conducting research, and supervising student projects.',
    status: 'Published',
    createdBy: 'HR Admin',
    createdAt: '2025-01-05',
    publishedAt: '2025-01-06',
  },
  {
    id: 'job2',
    title: 'Associate Professor - Business Administration',
    department: 'School of Business',
    employmentType: 'Academic',
    qualifications: 'PhD in Business Administration, MBA, or related field. Strong research record required.',
    experienceLevel: '8+ years',
    description: 'Join our Business School as an Associate Professor. Lead research initiatives, teach MBA courses, and contribute to curriculum development.',
    status: 'Published',
    createdBy: 'HR Admin',
    createdAt: '2025-01-03',
    publishedAt: '2025-01-04',
  },
  {
    id: 'job3',
    title: 'IT Support Specialist',
    department: 'IT Services',
    employmentType: 'Non-Academic',
    qualifications: 'Bachelor\'s degree in IT or related field. Certifications in networking preferred.',
    experienceLevel: '2-3 years',
    description: 'Provide technical support to staff and students. Maintain IT infrastructure and assist with system administration.',
    status: 'Published',
    createdBy: 'HR Admin',
    createdAt: '2025-01-08',
    publishedAt: '2025-01-09',
  },
  {
    id: 'job4',
    title: 'Research Assistant - Engineering',
    department: 'School of Engineering',
    employmentType: 'Academic',
    qualifications: 'Master\'s degree in Engineering. Research experience in renewable energy preferred.',
    experienceLevel: '1-2 years',
    description: 'Support ongoing research projects in renewable energy systems. Assist with data collection, analysis, and publication preparation.',
    status: 'Draft',
    createdBy: 'HR Admin',
    createdAt: '2025-01-10',
  },
];

const initialApplications: Application[] = [
  {
    id: 'app1',
    jobId: 'job1',
    jobTitle: 'Senior Lecturer - Computer Science',
    fullName: 'Dr. Ahmad Rizwan',
    email: 'ahmad.rizwan@email.com',
    phone: '+60 12-345 6789',
    education: 'PhD Computer Science - University of Melbourne (2018), MSc Computer Science - UM (2014)',
    experience: '6 years as Lecturer at University of Malaya, 2 years industry experience at Intel',
    resumeFileName: 'ahmad_rizwan_cv.pdf',
    status: 'Interview Scheduled',
    appliedAt: '2025-01-07',
    aiInsights: {
      resumeSummary: 'Experienced academic with strong teaching background and industry exposure. PhD holder with publications in machine learning and data science.',
      skillMatchScore: 87,
      strengths: ['Strong academic credentials', 'Industry experience', 'Published researcher', 'Teaching excellence'],
      skillGaps: ['Limited experience in curriculum development', 'No administrative experience mentioned'],
      overallAssessment: 'Highly suitable candidate with excellent academic credentials. Strong match for the Senior Lecturer position.',
      generatedAt: '2025-01-07T10:00:00Z',
    },
    interviews: [
      {
        id: 'int1',
        applicationId: 'app1',
        scheduledDate: '2025-01-20T10:00:00',
        interviewType: 'In-person',
        panelMembers: ['Prof. James Lee', 'Dr. Sarah Chen', 'HR Manager'],
        notes: 'First round interview - Technical and teaching demonstration',
        outcome: 'Pending',
        createdAt: '2025-01-12',
      },
    ],
  },
  {
    id: 'app2',
    jobId: 'job1',
    jobTitle: 'Senior Lecturer - Computer Science',
    fullName: 'Dr. Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+60 17-890 1234',
    education: 'PhD Computer Science - NUS (2019), BTech Computer Science - IIT Delhi (2012)',
    experience: '5 years as Assistant Professor at NUS, Research Fellow at Google (1 year)',
    resumeFileName: 'priya_sharma_cv.pdf',
    status: 'Shortlisted',
    appliedAt: '2025-01-08',
    aiInsights: {
      resumeSummary: 'Outstanding researcher with international teaching experience. Former Google Research Fellow with expertise in AI and machine learning.',
      skillMatchScore: 92,
      strengths: ['Exceptional research profile', 'International experience', 'Industry connections', 'AI/ML expertise'],
      skillGaps: ['May require adjustment to local academic context'],
      overallAssessment: 'Exceptional candidate with strong research credentials and industry experience. Highly recommended for interview.',
      generatedAt: '2025-01-08T14:00:00Z',
    },
    interviews: [],
  },
  {
    id: 'app3',
    jobId: 'job2',
    jobTitle: 'Associate Professor - Business Administration',
    fullName: 'Prof. Michael Tan',
    email: 'michael.tan@email.com',
    phone: '+60 19-456 7890',
    education: 'PhD Business Administration - Harvard Business School (2015), MBA - INSEAD (2008)',
    experience: '10 years as Associate Professor at NTU Singapore, Consultant at McKinsey (3 years)',
    resumeFileName: 'michael_tan_cv.pdf',
    status: 'Offered',
    appliedAt: '2025-01-05',
    aiInsights: {
      resumeSummary: 'Senior academic with impressive credentials from top institutions. Extensive consulting experience adds practical business insights.',
      skillMatchScore: 95,
      strengths: ['Top-tier education', 'Strong publication record', 'Industry consulting experience', 'Leadership experience'],
      skillGaps: ['Salary expectations may be higher than budget'],
      overallAssessment: 'Outstanding candidate who exceeds requirements. Highly recommended for immediate offer consideration.',
      generatedAt: '2025-01-05T09:00:00Z',
    },
    interviews: [
      {
        id: 'int2',
        applicationId: 'app3',
        scheduledDate: '2025-01-10T14:00:00',
        interviewType: 'Online',
        panelMembers: ['Dean of Business School', 'Prof. Linda Wong', 'HR Director'],
        notes: 'Excellent presentation. Strong strategic thinking demonstrated.',
        outcome: 'Passed',
        createdAt: '2025-01-08',
      },
    ],
    finalComments: 'Candidate accepted the offer. Expected joining date: February 15, 2025.',
  },
  {
    id: 'app4',
    jobId: 'job3',
    jobTitle: 'IT Support Specialist',
    fullName: 'Jason Lee Wei Ming',
    email: 'jason.lee@email.com',
    phone: '+60 16-234 5678',
    education: 'Bachelor of IT - APU (2021), Cisco CCNA Certified',
    experience: '3 years as IT Support at TM, Internship at APU IT Department',
    resumeFileName: 'jason_lee_cv.pdf',
    status: 'Applied',
    appliedAt: '2025-01-12',
    aiInsights: {
      resumeSummary: 'APU alumnus with relevant IT support experience. Holds industry certifications and familiar with university environment.',
      skillMatchScore: 78,
      strengths: ['APU graduate - familiar with systems', 'Industry certifications', 'Relevant experience'],
      skillGaps: ['Limited experience with enterprise systems', 'No cloud platform experience mentioned'],
      overallAssessment: 'Good candidate with relevant background. Recommended for shortlisting.',
      generatedAt: '2025-01-12T11:00:00Z',
    },
    interviews: [],
  },
  {
    id: 'app5',
    jobId: 'job1',
    jobTitle: 'Senior Lecturer - Computer Science',
    fullName: 'Dr. Kevin Ng',
    email: 'kevin.ng@email.com',
    phone: '+60 11-567 8901',
    education: 'PhD Computer Science - University of Sydney (2020), MSc - University of Melbourne (2016)',
    experience: '3 years as Lecturer at Monash Malaysia',
    resumeFileName: 'kevin_ng_cv.pdf',
    status: 'Rejected',
    appliedAt: '2025-01-06',
    aiInsights: {
      resumeSummary: 'Early-career academic with limited experience. Good academic credentials but lacks senior-level teaching exposure.',
      skillMatchScore: 58,
      strengths: ['Recent PhD', 'Good academic background'],
      skillGaps: ['Insufficient experience for senior role', 'Limited research publications', 'No industry experience'],
      overallAssessment: 'Does not meet minimum experience requirements for Senior Lecturer position. May be suitable for Lecturer role.',
      generatedAt: '2025-01-06T15:00:00Z',
    },
    interviews: [],
    finalComments: 'Candidate does not meet the 5+ years experience requirement. Suggested to apply for Lecturer positions when available.',
  },
];

// Job Openings Functions
export const getJobOpenings = (): JobOpening[] =>
  getFromStorage(STORAGE_KEYS.JOB_OPENINGS, initialJobOpenings);

export const saveJobOpenings = (jobs: JobOpening[]) =>
  saveToStorage(STORAGE_KEYS.JOB_OPENINGS, jobs);

export const getPublishedJobs = (): JobOpening[] =>
  getJobOpenings().filter(j => j.status === 'Published');

export const addJobOpening = (job: Omit<JobOpening, 'id' | 'createdAt'>): JobOpening => {
  const jobs = getJobOpenings();
  const newJob: JobOpening = {
    ...job,
    id: `job${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  jobs.push(newJob);
  saveJobOpenings(jobs);
  return newJob;
};

export const updateJobOpening = (id: string, updates: Partial<JobOpening>): JobOpening | null => {
  const jobs = getJobOpenings();
  const index = jobs.findIndex(j => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    saveJobOpenings(jobs);
    return jobs[index];
  }
  return null;
};

export const deleteJobOpening = (id: string): boolean => {
  const jobs = getJobOpenings();
  const filtered = jobs.filter(j => j.id !== id);
  if (filtered.length !== jobs.length) {
    saveJobOpenings(filtered);
    return true;
  }
  return false;
};

// Application Functions
export const getApplications = (): Application[] =>
  getFromStorage(STORAGE_KEYS.APPLICATIONS, initialApplications);

export const saveApplications = (apps: Application[]) =>
  saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);

export const getApplicationsByJob = (jobId: string): Application[] =>
  getApplications().filter(a => a.jobId === jobId);

export const addApplication = (app: Omit<Application, 'id' | 'appliedAt' | 'status' | 'interviews' | 'aiInsights'>): Application => {
  const apps = getApplications();
  const aiInsights = generateAIInsights(app);
  
  const newApp: Application = {
    ...app,
    id: `app${Date.now()}`,
    appliedAt: new Date().toISOString().split('T')[0],
    status: 'Applied',
    interviews: [],
    aiInsights,
  };
  apps.push(newApp);
  saveApplications(apps);
  return newApp;
};

export const updateApplicationStatus = (id: string, status: Application['status'], comments?: string): Application | null => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index !== -1) {
    apps[index].status = status;
    if (comments) {
      apps[index].finalComments = comments;
    }
    saveApplications(apps);
    return apps[index];
  }
  return null;
};

export const updateApplication = (id: string, updates: Partial<Application>): Application | null => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index !== -1) {
    apps[index] = { ...apps[index], ...updates };
    saveApplications(apps);
    return apps[index];
  }
  return null;
};

// Interview Functions
export const addInterview = (applicationId: string, interview: Omit<Interview, 'id' | 'applicationId' | 'createdAt'>): Interview | null => {
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === applicationId);
  if (index !== -1) {
    const newInterview: Interview = {
      ...interview,
      id: `int${Date.now()}`,
      applicationId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    apps[index].interviews.push(newInterview);
    apps[index].status = 'Interview Scheduled';
    saveApplications(apps);
    return newInterview;
  }
  return null;
};

export const updateInterview = (applicationId: string, interviewId: string, updates: Partial<Interview>): Interview | null => {
  const apps = getApplications();
  const appIndex = apps.findIndex(a => a.id === applicationId);
  if (appIndex !== -1) {
    const intIndex = apps[appIndex].interviews.findIndex(i => i.id === interviewId);
    if (intIndex !== -1) {
      apps[appIndex].interviews[intIndex] = { ...apps[appIndex].interviews[intIndex], ...updates };
      saveApplications(apps);
      return apps[appIndex].interviews[intIndex];
    }
  }
  return null;
};

// AI Insights Generator (Rule-based simulation)
export const generateAIInsights = (app: Omit<Application, 'id' | 'appliedAt' | 'status' | 'interviews' | 'aiInsights'>): AIInsights => {
  const strengths: string[] = [];
  const skillGaps: string[] = [];
  let skillMatchScore = 60;

  // Analyze education
  const education = app.education.toLowerCase();
  if (education.includes('phd')) {
    strengths.push('Advanced academic credentials (PhD)');
    skillMatchScore += 15;
  } else if (education.includes('master') || education.includes('msc') || education.includes('mba')) {
    strengths.push('Strong postgraduate education');
    skillMatchScore += 10;
  }

  if (education.includes('harvard') || education.includes('mit') || education.includes('stanford') || 
      education.includes('oxford') || education.includes('cambridge') || education.includes('nus') ||
      education.includes('ntu') || education.includes('insead')) {
    strengths.push('Education from prestigious institution');
    skillMatchScore += 5;
  }

  // Analyze experience
  const experience = app.experience.toLowerCase();
  const yearsMatch = experience.match(/(\d+)\s*years?/);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
  
  if (years >= 8) {
    strengths.push('Extensive professional experience');
    skillMatchScore += 10;
  } else if (years >= 5) {
    strengths.push('Solid work experience');
    skillMatchScore += 7;
  } else if (years >= 3) {
    strengths.push('Relevant work experience');
    skillMatchScore += 5;
  } else {
    skillGaps.push('Limited professional experience');
    skillMatchScore -= 5;
  }

  if (experience.includes('professor') || experience.includes('lecturer')) {
    strengths.push('Teaching experience in higher education');
    skillMatchScore += 5;
  }

  if (experience.includes('research') || experience.includes('publication')) {
    strengths.push('Research background');
    skillMatchScore += 5;
  }

  if (experience.includes('industry') || experience.includes('corporate') || experience.includes('consultant')) {
    strengths.push('Industry/corporate exposure');
    skillMatchScore += 3;
  }

  // Common skill gaps based on analysis
  if (!experience.includes('admin') && !experience.includes('management')) {
    skillGaps.push('No administrative experience mentioned');
  }

  if (!experience.includes('curriculum') && !experience.includes('program')) {
    skillGaps.push('Limited curriculum development exposure');
  }

  // Ensure score is within bounds
  skillMatchScore = Math.min(98, Math.max(35, skillMatchScore));

  // Generate resume summary
  const resumeSummary = `Candidate with ${years > 0 ? `${years}+ years of experience` : 'relevant background'} in ${
    app.education.includes('Computer') ? 'computing/technology' : 
    app.education.includes('Business') ? 'business/management' :
    app.education.includes('Engineering') ? 'engineering' : 'their field'
  }. ${strengths.length > 0 ? strengths[0] + '.' : ''} ${
    education.includes('phd') ? 'Holds doctoral qualifications.' : 
    education.includes('master') ? 'Holds postgraduate qualifications.' : ''
  }`;

  // Generate overall assessment
  let overallAssessment = '';
  if (skillMatchScore >= 85) {
    overallAssessment = 'Excellent candidate who meets or exceeds position requirements. Highly recommended for immediate interview.';
  } else if (skillMatchScore >= 70) {
    overallAssessment = 'Good candidate with relevant qualifications. Recommended for shortlisting and further evaluation.';
  } else if (skillMatchScore >= 55) {
    overallAssessment = 'Candidate meets basic requirements with some gaps. May be considered if other candidates are unavailable.';
  } else {
    overallAssessment = 'Candidate does not sufficiently meet position requirements. Not recommended for this role.';
  }

  return {
    resumeSummary,
    skillMatchScore,
    strengths: strengths.length > 0 ? strengths : ['Submitted complete application'],
    skillGaps: skillGaps.length > 0 ? skillGaps : ['Further evaluation needed'],
    overallAssessment,
    generatedAt: new Date().toISOString(),
  };
};

// Recruitment Statistics
export const getRecruitmentStats = () => {
  const jobs = getJobOpenings();
  const apps = getApplications();

  const openPositions = jobs.filter(j => j.status === 'Published').length;
  const totalApplications = apps.length;
  const statusCounts = {
    applied: apps.filter(a => a.status === 'Applied').length,
    shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
    interviewed: apps.filter(a => a.status === 'Interview Scheduled').length,
    offered: apps.filter(a => a.status === 'Offered').length,
    rejected: apps.filter(a => a.status === 'Rejected').length,
  };

  // Mock time-to-hire (in days)
  const avgTimeToHire = 21;

  return {
    openPositions,
    totalApplications,
    statusCounts,
    avgTimeToHire,
    jobStats: jobs.map(j => ({
      id: j.id,
      title: j.title,
      status: j.status,
      applicationCount: apps.filter(a => a.jobId === j.id).length,
    })),
  };
};
