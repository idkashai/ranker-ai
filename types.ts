
export enum AnalysisStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum SelectionStatus {
  PENDING = 'PENDING',
  EXCEPTIONAL = 'EXCEPTIONAL',
  REJECTED = 'REJECTED',
  SHORTLISTED = 'SHORTLISTED'
}

export type PipelineStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected';

export interface Note {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export type InterviewStatus = 'NOT_INVITED' | 'INVITED' | 'IN_PROGRESS' | 'COMPLETED';

export interface SkillMatch {
  skill: string;
  present: boolean;
  relevance: string; // "High", "Medium", "Low"
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface AIAnalysisResult {
  score: number; // 0-100
  summary: string;
  contactDetails?: ContactDetails;
  pros: string[];
  cons: string[];
  experienceRating: string; // "Junior", "Mid", "Senior", "Expert"
  skillsAnalysis: SkillMatch[];
  recommendedAction: 'Interview' | 'Keep on File' | 'Reject';
}

export interface InterviewQuestion {
  id: string;
  text: string;
  type: 'technical' | 'behavioral' | 'general';
  focusArea?: string;
}

export interface InterviewConfig {
  questions: InterviewQuestion[];
  durationMinutes: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeText: string; 
  fileName: string;
  fileData?: string | null; 
  fileType?: string;
  uploadDate: string;
  jobId: string;
  status: AnalysisStatus;
  selectionStatus?: SelectionStatus;
  stage?: PipelineStage; 
  notes?: Note[]; 
  analysis?: AIAnalysisResult;
  interviewStatus?: InterviewStatus;
  interviewAnswers?: Record<string, string>; 
  source?: 'UPLOAD' | 'PUBLIC_LINK' | 'SOURCING';
  profileUrl?: string;
  isOpenToWork?: boolean;
  lastScanned?: string;
}

export interface SourcingProfile {
  id: string;
  name: string;
  headline: string;
  location: string;
  platform: 'LinkedIn' | 'GitHub' | 'Twitter' | 'Portfolio';
  skills: string[];
  isOpenToWork: boolean;
  profileUrl: string;
  lastUpdated: string;
}

export interface JobCriteria {
  id: string;
  title: string;
  department?: string;
  type?: string;
  location?: string;
  description: string;
  requiredSkills: string[];
  weightedSkills?: WeightedSkill[]; 
  experienceLevel: string;
  createdAt: string;
  interviewConfig?: InterviewConfig;
}

export interface WeightedSkill {
  skill: string;
  weight: number; 
}

export interface ActivityLog {
  id: string;
  type: 'JOB_CREATED' | 'CAMPAIGN_LAUNCHED' | 'INTERVIEW_COMPLETED' | 'RESUME_UPLOADED' | 'CANDIDATE_ANALYZED' | 'SOURCING_SCAN';
  description: string;
  timestamp: string;
  user: string;
}

// CampaignLog interface for tracking recruitment outreach activities
export interface CampaignLog {
  id: string;
  date: string;
  type: 'Bulk Email' | 'Individual Email' | 'Interview Invite' | 'Public Link';
  recipientCount: number;
  jobId: string;
  jobTitle: string;
  status: 'Sent' | 'Active';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'recruiter';
  company: string;
  plan?: string;
}
