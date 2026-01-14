
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { JobManagement } from './pages/JobManagement';
import { ResumeProcessing } from './pages/ResumeProcessing';
import { AnalysisResults } from './pages/AnalysisResults';
import { EmailCampaign } from './pages/EmailCampaign';
import { InterviewRoom } from './pages/InterviewRoom';
import { SourcingCenter } from './pages/SourcingCenter';
import { Downloads } from './pages/Downloads';
import { Pricing } from './pages/Pricing';
import { DiscoveryEngine } from './pages/DiscoveryEngine';
import { Contact } from './pages/Contact';
import { WorkflowSelector } from './pages/WorkflowSelector';
import { User, JobCriteria, Candidate, AnalysisStatus, SelectionStatus, ActivityLog } from './types';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MOCK_USER: User = {
  id: 'u1',
  name: 'Expert Recruiter',
  email: 'expert@recruitpro.ai',
  phone: '+92 300 1234567',
  role: 'recruiter',
  company: 'Global Talent Corp',
  plan: 'Enterprise Pro'
};

const INITIAL_JOBS: JobCriteria[] = [
  {
    id: 'j1',
    title: 'Principal Software Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    description: 'Lead our AI core development team using React and Node.js.',
    requiredSkills: ['React', 'Node.js', 'System Design'],
    weightedSkills: [{ skill: 'React', weight: 10 }, { skill: 'Node.js', weight: 8 }, { skill: 'AWS', weight: 7 }],
    experienceLevel: 'Senior',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'j2',
    title: 'Product Marketing Lead',
    department: 'Growth',
    type: 'Full-time',
    location: 'London, UK',
    description: 'Drive market penetration for our autonomous platforms.',
    requiredSkills: ['SaaS', 'GTM', 'SEO'],
    weightedSkills: [{ skill: 'GTM Strategy', weight: 10 }, { skill: 'SaaS Marketing', weight: 9 }],
    experienceLevel: 'Lead',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'j3',
    title: 'Cloud Architect (Azure)',
    department: 'Infrastructure',
    type: 'Contract',
    location: 'Hybrid',
    description: 'Optimizing high-scale cloud deployments.',
    requiredSkills: ['Azure', 'Terraform', 'K8s'],
    weightedSkills: [{ skill: 'Azure', weight: 10 }, { skill: 'Kubernetes', weight: 9 }],
    experienceLevel: 'Senior',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    fileName: 'sarah_resume.pdf',
    resumeText: 'Senior developer with 10 years experience in React and AWS...',
    uploadDate: new Date().toISOString(),
    jobId: 'j1',
    status: AnalysisStatus.COMPLETED,
    selectionStatus: SelectionStatus.EXCEPTIONAL,
    stage: 'Interview',
    analysis: { score: 94, summary: "Top-tier technical architect with massive leadership signals.", pros: ["System Design expert", "10y tenure"], cons: [], experienceRating: "Expert", skillsAnalysis: [], recommendedAction: "Interview" }
  },
  {
    id: 'c2',
    name: 'John Miller',
    email: 'john@tech.io',
    fileName: 'miller_cv.docx',
    resumeText: 'Fullstack engineer focused on Node and React ecosystems...',
    uploadDate: new Date().toISOString(),
    jobId: 'j1',
    status: AnalysisStatus.COMPLETED,
    selectionStatus: SelectionStatus.SHORTLISTED,
    stage: 'Screening',
    analysis: { score: 82, summary: "Solid mid-to-senior profile with strong individual contributor marks.", pros: ["Strong Node.js", "Clean Code"], cons: ["Leadership gap"], experienceRating: "Senior", skillsAnalysis: [], recommendedAction: "Interview" }
  },
  {
    id: 'c3',
    name: 'Emma Watson',
    email: 'emma@marketing.com',
    fileName: 'watson_marketer.pdf',
    resumeText: 'Marketing professional with GTM experience in SaaS...',
    uploadDate: new Date().toISOString(),
    jobId: 'j2',
    status: AnalysisStatus.COMPLETED,
    selectionStatus: SelectionStatus.PENDING,
    stage: 'Applied',
    analysis: { score: 76, summary: "Great local knowledge, needs more enterprise SaaS scaling proof.", pros: ["GTM focus"], cons: ["SaaS depth"], experienceRating: "Mid", skillsAnalysis: [], recommendedAction: "Keep on File" }
  },
  {
    id: 'c4',
    name: 'Ali Raza',
    email: 'ali@cloud.pk',
    fileName: 'ali_azure_cv.pdf',
    resumeText: 'Cloud engineer certified in Azure and Terraform...',
    uploadDate: new Date().toISOString(),
    jobId: 'j3',
    status: AnalysisStatus.PENDING,
    selectionStatus: SelectionStatus.PENDING,
    stage: 'Applied'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
      const saved = localStorage.getItem('recruitpro_user');
      return saved ? JSON.parse(saved) : null;
  });

  const [selectedMode, setSelectedMode] = useState<'pulsive' | 'manual' | 'hybrid' | null>(() => {
      return localStorage.getItem('recruitpro_mode') as any;
  });

  const [jobs, setJobs] = useState<JobCriteria[]>(() => {
      const saved = localStorage.getItem('recruitpro_jobs');
      return (saved && JSON.parse(saved).length > 0) ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
      const saved = localStorage.getItem('recruitpro_candidates');
      return (saved && JSON.parse(saved).length > 0) ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
      const saved = localStorage.getItem('recruitpro_logs');
      return saved ? JSON.parse(saved) : [
        { id: '1', type: 'JOB_CREATED', description: 'Directive Initialized: Principal Software Engineer', timestamp: new Date().toISOString(), user: 'System' },
        { id: '2', type: 'CANDIDATE_ANALYZED', description: 'Neural Scoring Complete: Sarah Connor', timestamp: new Date().toISOString(), user: 'AI Core' }
      ];
  });

  useEffect(() => { localStorage.setItem('recruitpro_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('recruitpro_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('recruitpro_candidates', JSON.stringify(candidates)); }, [candidates]);
  useEffect(() => { localStorage.setItem('recruitpro_logs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { 
    if (selectedMode) localStorage.setItem('recruitpro_mode', selectedMode);
    else localStorage.removeItem('recruitpro_mode');
  }, [selectedMode]);

  const handleLogin = () => setUser(MOCK_USER);
  const handleLogout = () => {
    setUser(null);
    setSelectedMode(null);
  };
  
  const handleUpdateUser = (updatedUser: Partial<User>) => {
    if (user) setUser({ ...user, ...updatedUser });
  };

  const handleSelectMode = (mode: 'pulsive' | 'manual' | 'hybrid') => {
    setSelectedMode(mode);
  };

  const logActivity = (type: ActivityLog['type'], description: string) => {
      const newLog: ActivityLog = {
          id: Date.now().toString(),
          type,
          description,
          timestamp: new Date().toISOString(),
          user: user?.name || 'System'
      };
      setActivityLogs(prev => [newLog, ...prev]);
  };

  const addJob = (job: JobCriteria) => {
      setJobs([...jobs, job]);
      logActivity('JOB_CREATED', `Created new job: ${job.title}`);
  };
  
  const updateJob = (id: string, updatedJob: Partial<JobCriteria>) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, ...updatedJob } : j));
  };
  
  const deleteJob = (id: string) => setJobs(jobs.filter(j => j.id !== id));

  const addCandidate = (cand: Candidate) => {
    setCandidates(prev => [...prev, cand]);
    logActivity('RESUME_UPLOADED', `Imported profile: ${cand.name}`);
  };

  const handleUpload = (files: File[], jobId: string, texts: string[], fileDataList?: {data: string | null, type: string}[]) => {
    const newCandidates: Candidate[] = files.map((file, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.split('.')[0], 
      email: 'candidate@example.com',
      fileName: file.name,
      resumeText: texts[i],
      uploadDate: new Date().toISOString(),
      jobId,
      status: AnalysisStatus.PENDING,
      selectionStatus: SelectionStatus.PENDING,
      stage: 'Applied',
      source: 'UPLOAD',
      fileData: fileDataList ? fileDataList[i].data : undefined,
      fileType: fileDataList ? fileDataList[i].type : undefined
    }));
    setCandidates([...candidates, ...newCandidates]);
    logActivity('RESUME_UPLOADED', `Uploaded ${files.length} resumes to system.`);
  };

  const deleteCandidate = (id: string) => setCandidates(candidates.filter(c => c.id !== id));

  const updateCandidate = (id: string, data: Partial<Candidate>) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const handleInterviewComplete = (candidateId: string, answers: Record<string, string>, newCandidateData?: Partial<Candidate>) => {
      if (candidateId === 'new_public' && newCandidateData) {
          const newCandidate: Candidate = {
              id: Math.random().toString(36).substr(2, 9),
              name: newCandidateData.name || 'Unknown',
              email: newCandidateData.email || 'unknown@example.com',
              fileName: 'Interview Application',
              resumeText: 'Application via Public Link.',
              uploadDate: new Date().toISOString(),
              jobId: newCandidateData.jobId || 'general',
              status: AnalysisStatus.PENDING,
              selectionStatus: SelectionStatus.PENDING,
              stage: 'Applied',
              interviewStatus: 'COMPLETED',
              interviewAnswers: answers,
              source: 'PUBLIC_LINK'
          };
          setCandidates([...candidates, newCandidate]);
          logActivity('INTERVIEW_COMPLETED', `Public interview: ${newCandidate.name}`);
      } else {
          updateCandidate(candidateId, { 
              interviewStatus: 'COMPLETED',
              interviewAnswers: answers
          });
      }
  };

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup onLogin={handleLogin} />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-it-works" element={<DiscoveryEngine />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/interview/public/:jobId" element={<InterviewRoom jobs={jobs} onComplete={handleInterviewComplete} />} />
        
        <Route path="/*" element={
          user ? (
            !selectedMode ? (
              <WorkflowSelector onSelect={handleSelectMode} />
            ) : (
              <Layout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} currentMode={selectedMode} onSwitchMode={() => setSelectedMode(null)}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard candidates={candidates} jobs={jobs} activityLogs={activityLogs} onUpdateCandidate={updateCandidate} onDeleteCandidate={deleteCandidate} mode={selectedMode} />} />
                  <Route path="/jobs" element={<JobManagement jobs={jobs} onAddJob={addJob} onUpdateJob={updateJob} onDeleteJob={deleteJob} />} />
                  <Route path="/resumes" element={<ResumeProcessing jobs={jobs} candidates={candidates} onUpload={handleUpload} onDeleteCandidate={deleteCandidate} />} />
                  <Route path="/analysis" element={<AnalysisResults candidates={candidates} jobs={jobs} onUpdateCandidate={updateCandidate} />} />
                  <Route path="/sourcing" element={<SourcingCenter jobs={jobs} onAddCandidate={addCandidate} />} />
                  <Route path="/campaigns" element={<EmailCampaign candidates={candidates} jobs={jobs} onUpdateJob={updateJob} onLogActivity={logActivity} />} />
                  <Route path="/interview/:candidateId" element={<InterviewRoom candidates={candidates} jobs={jobs} onComplete={handleInterviewComplete} />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            )
          ) : (
            <Navigate to="/" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
