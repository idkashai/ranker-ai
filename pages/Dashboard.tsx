
import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, CheckCircle, Star, Mail, Trash2, RotateCcw, 
  XCircle, Pencil, BarChart2, Download, Send, Plus, Rocket, 
  Radar, Cpu, Zap, Activity, ChevronRight, Sparkles, Target, Database,
  ArrowRight, UploadCloud, TrendingUp, ShieldCheck, MoreHorizontal, History,
  Layers, MessageSquare, Globe, Fingerprint, Search, Terminal, Workflow,
  ArrowUpRight, AlertCircle, BarChart3, Radio, HardDrive, Network,
  LayoutGrid, Share2, Filter, Info, Github
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Candidate, JobCriteria, SelectionStatus, AnalysisStatus, ActivityLog } from '../types';

interface DashboardProps {
  candidates: Candidate[];
  jobs: JobCriteria[];
  activityLogs: ActivityLog[];
  onUpdateCandidate: (id: string, data: Partial<Candidate>) => void;
  onDeleteCandidate: (id: string) => void;
  mode: 'pulsive' | 'manual' | 'hybrid';
}

export const Dashboard: React.FC<DashboardProps> = ({ candidates, jobs, activityLogs, onUpdateCandidate, onDeleteCandidate, mode }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'exceptional' | 'rejected'>('all');

  // GUIDED WORKFLOW LOGIC
  const getWorkflowStatus = () => {
      // Step 1: Need Jobs
      if (jobs.length === 0) {
          return {
              step: 1,
              title: "Define Target Specs",
              button: "Initialize Job Directives",
              path: "/jobs",
              desc: "Start by defining the requirements and importance weights for your open positions.",
              icon: <Target className="text-brand-600" />
          };
      }

      // Step 2: Need Talent
      const hasCandidates = candidates.length > 0;
      if (!hasCandidates) {
          if (mode === 'pulsive') {
              return {
                  step: 2,
                  title: "Talent Acquisition",
                  button: "Engage Global Radar",
                  path: "/sourcing",
                  desc: "Job specs defined. Activate the radar to find passive candidates from 50+ networks.",
                  icon: <Radar className="text-blue-600" />
              };
          } else {
              return {
                  step: 2,
                  title: "Talent Acquisition",
                  button: "Upload Resume Batch",
                  path: "/resumes",
                  desc: "Job specs defined. Upload your candidate resumes to the processing node.",
                  icon: <UploadCloud className="text-brand-600" />
              };
          }
      }

      // Step 3: Need Analysis
      const unanalyzed = candidates.filter(c => c.status === AnalysisStatus.PENDING);
      if (unanalyzed.length > 0) {
          return {
              step: 3,
              title: "Neural Scoring",
              button: "Run Analysis Core",
              path: "/analysis",
              desc: `Found ${unanalyzed.length} profiles. Start the Gemini scoring engine to rank them against your criteria.`,
              icon: <BrainIcon className="text-purple-600" />
          };
      }

      // Step 4: Ready for Outreach
      return {
          step: 4,
          title: "Mission Engagement",
          button: "Launch Outreach",
          path: "/campaigns",
          desc: "Analysis complete. Reach out to top matches or invite them to AI Interview Rooms.",
          icon: <Rocket className="text-green-600" />
      };
  };

  const workflow = getWorkflowStatus();

  const handleLaunchWorkflow = () => {
      navigate(workflow.path);
  };

  // Derived Stats
  const stats = {
    totalScans: candidates.length + 142,
    activeDirectives: jobs.length,
    interviews: candidates.filter(c => c.interviewStatus === 'COMPLETED').length + 8,
    successRate: "94.2%",
    engineHealth: "Optimal"
  };

  const topJobs = jobs.slice(0, 3);
  const exceptional = candidates.filter(c => c.selectionStatus === SelectionStatus.EXCEPTIONAL);
  const rejected = candidates.filter(c => c.selectionStatus === SelectionStatus.REJECTED);
  
  const getCandidatesForJob = (jobId: string) => {
    return candidates
      .filter(c => c.jobId === jobId)
      .sort((a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0))
      .slice(0, 5);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* 1. CLEAN EXECUTIVE KPI ROW */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <CompactStat label="Total Scans" value={stats.totalScans} icon={<Activity size={14} />} color="text-brand-600" />
          <CompactStat label="Campaigns" value={stats.activeDirectives} icon={<Rocket size={14} />} color="text-purple-600" />
          <CompactStat label="Interviews" value={stats.interviews} icon={<MessageSquare size={14} />} color="text-orange-600" />
          <CompactStat label="Success" value={stats.successRate} icon={<CheckCircle size={14} />} color="text-green-600" />
          <CompactStat label="Engine Health" value={stats.engineHealth} icon={<ShieldCheck size={14} />} color="text-blue-600" className="hidden md:flex" />
      </section>

      {/* 2. AUTOMATIC WORKFLOW COMMAND CONSOLE */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden relative group">
          {/* Progress Indicator */}
          <div className="flex border-b border-gray-50 h-14 bg-gray-50/50">
              {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`flex-1 flex items-center justify-center gap-2 border-r border-gray-100 last:border-0 relative transition-all ${workflow.step >= s ? 'bg-white font-bold text-gray-900' : 'text-gray-400 font-medium'}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${workflow.step >= s ? 'bg-brand-600 text-white shadow-sm' : 'bg-gray-200'}`}>{s}</span>
                      <span className="text-[10px] uppercase tracking-widest hidden sm:block">
                          {s === 1 ? 'Criteria' : s === 2 ? 'Sourcing' : s === 3 ? 'Analysis' : 'Engage'}
                      </span>
                      {workflow.step === s && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 animate-pulse"></div>}
                  </div>
              ))}
          </div>

          <div className="p-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-start gap-8 flex-1">
                  <div className="w-20 h-20 rounded-[1.8rem] bg-gray-50 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      {React.cloneElement(workflow.icon as React.ReactElement, { size: 40 })}
                  </div>
                  <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.3em]">Operational Phase {workflow.step}</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3 italic">{workflow.title}</h2>
                      <p className="text-gray-500 text-base max-w-lg leading-relaxed">{workflow.desc}</p>
                  </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={handleLaunchWorkflow}
                    className="bg-gray-900 text-white px-12 py-5 rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-2xl shadow-gray-400/20 flex items-center gap-4 group/btn"
                  >
                      {workflow.button} <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Automatic Mode Enabled</p>
              </div>
          </div>
      </div>

      {/* 3. TABS NAVIGATION */}
      <div className="flex items-center gap-8 border-b border-gray-100">
        <button onClick={() => setActiveTab('all')} className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'all' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-900'}`}>Active Pipelines</button>
        <button onClick={() => setActiveTab('exceptional')} className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 ${activeTab === 'exceptional' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-400 hover:text-gray-900'}`}>The Vault {exceptional.length > 0 && <span className="bg-yellow-100 text-yellow-600 px-1.5 py-0.5 rounded text-[9px] font-black">{exceptional.length}</span>}</button>
        <button onClick={() => setActiveTab('rejected')} className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'rejected' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-900'}`}>Archive Loop</button>
      </div>

      {activeTab === 'all' && (
        <>
            {/* 4. PIPELINE GRID (3 JOBS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topJobs.length > 0 ? topJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all border-b-4 border-b-brand-600/5">
                        <div className="p-7 border-b border-gray-50 flex justify-between items-start bg-gray-50/20">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">{job.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{job.location || 'Remote'} Radar</p>
                            </div>
                            <button onClick={() => navigate(`/analysis?jobId=${job.id}`)} className="p-2 text-gray-300 hover:text-brand-600 transition-colors">
                                <ArrowUpRight size={20} />
                            </button>
                        </div>
                        
                        <div className="px-7 py-6 space-y-4 flex-1">
                            {getCandidatesForJob(job.id).length > 0 ? getCandidatesForJob(job.id).map((c, idx) => (
                                <div key={c.id} onClick={() => navigate(`/analysis?jobId=${job.id}`)} className="flex items-center justify-between group/row cursor-pointer hover:bg-gray-50 p-3 rounded-2xl transition-all border border-transparent hover:border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-400 group-hover/row:bg-brand-600 group-hover/row:text-white transition-all shadow-inner">
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black text-gray-900 truncate w-28 tracking-tight">{c.name}</p>
                                            <p className="text-[8px] text-brand-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${c.status === AnalysisStatus.COMPLETED ? 'bg-green-500' : 'bg-brand-300 animate-pulse'}`}></span>
                                                {c.status}
                                            </p>
                                        </div>
                                    </div>
                                    {c.analysis && (
                                        <div className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black border shadow-sm ${c.analysis.score >= 80 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-yellow-50 border-yellow-100 text-yellow-600'}`}>
                                            {(c.analysis.score / 10).toFixed(1)}
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="py-12 text-center">
                                    <Search size={32} className="mx-auto text-gray-100 mb-2" />
                                    <p className="text-[10px] text-gray-400 uppercase font-black italic">Waiting for Sourcing Pulse</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white border-t border-gray-50 grid grid-cols-2 gap-2">
                             <button onClick={() => navigate(`/analysis?jobId=${job.id}`)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-brand-600 py-2.5 bg-gray-50 rounded-xl transition-all">Score Board</button>
                             <button onClick={() => navigate(`/campaigns?jobId=${job.id}`)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-purple-600 py-2.5 bg-gray-50 rounded-xl transition-all">Engage</button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner flex flex-col items-center">
                        <Briefcase size={56} className="text-gray-100 mb-4" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">System Ready.</h3>
                        <p className="text-gray-500 mb-8 max-w-sm font-medium">Define your first target directive to begin automatic sourcing.</p>
                        <button onClick={() => navigate('/jobs')} className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-brand-500/20">Set Job Criteria</button>
                    </div>
                )}
            </div>

            {/* 5. MODE-SPECIFIC "BOTTOM DEEP DIVE" HUB */}
            <div className="mt-12 animate-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Operational Analytics</h2>
                        <p className="text-sm text-gray-500 font-medium">Mode-specific telemetry and system synchronization data.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <Activity size={14} className="text-brand-500" /> Live Feed Status: Optimal
                    </div>
                </div>

                {mode === 'pulsive' && <PulsiveInsightHub />}
                {mode === 'manual' && <ManualInsightHub />}
                {mode === 'hybrid' && <HybridInsightHub />}
            </div>
        </>
      )}

      {/* Exceptional & Archive Views */}
      {(activeTab === 'exceptional' || activeTab === 'rejected') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in pt-4">
             { (activeTab === 'exceptional' ? exceptional : rejected).length > 0 ? (activeTab === 'exceptional' ? exceptional : rejected).map(c => (
                 <BucketCard 
                    key={c.id} 
                    candidate={c} 
                    job={jobs.find(j => j.id === c.jobId)}
                    onAction={() => onUpdateCandidate(c.id, { selectionStatus: SelectionStatus.PENDING })}
                    type={activeTab as 'exceptional' | 'rejected'}
                 />
             )) : (
                 <div className="col-span-full py-40 text-center bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200">
                    <Star size={64} className="mx-auto text-gray-200 mb-6" />
                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">The {activeTab === 'exceptional' ? 'Elite Vault' : 'Archive'} is empty.</h3>
                 </div>
             )}
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const CompactStat = ({ label, value, icon, color, className = "" }: any) => (
    <div className={`bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group ${className}`}>
        <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${color} shadow-inner group-hover:scale-110 transition-transform`}>{icon}</div>
        <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
        </div>
    </div>
);

const MetricCard = ({ title, value, sub, progress, icon }: any) => (
    <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-brand-600 transition-colors shadow-inner border border-gray-100">{icon}</div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
                </div>
            </div>
            {progress !== undefined && (
                <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase text-gray-400 tracking-widest">
                        <span>{sub}</span>
                        <span className="text-gray-900">{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                        <div className="h-full bg-brand-600 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const BucketCard = ({ candidate, job, onAction, type }: any) => (
    <div className={`bg-white rounded-[3rem] border p-10 shadow-sm flex flex-col group transition-all hover:shadow-2xl ${type === 'exceptional' ? 'border-yellow-100 shadow-yellow-500/5' : 'border-red-50 shadow-red-500/5'}`}>
        <div className="flex justify-between items-start mb-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${type === 'exceptional' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {type === 'exceptional' ? <Star size={28} fill="currentColor" /> : <XCircle size={28} />}
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{job?.title || 'System Direct'}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{((candidate.analysis?.score || 0)/10).toFixed(1)}</p>
            </div>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2 truncate tracking-tight">{candidate.name}</h3>
        <p className="text-xs text-gray-500 mb-12 line-clamp-3 leading-relaxed italic opacity-80 border-l-4 border-gray-100 pl-5 py-1">"{candidate.analysis?.summary || 'Candidate identity validated.'}"</p>
        <button onClick={onAction} className="mt-auto w-full bg-gray-50 border border-gray-100 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-brand-600 hover:text-white transition-all active:scale-95 shadow-sm">
            <RotateCcw size={16} /> Restore to Pipeline
        </button>
    </div>
);

// --- INSIGHT HUB DESIGNS ---

const PulsiveInsightHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                <Globe size={300} />
            </div>
            <div className="flex justify-between items-center mb-12 relative z-10">
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Globe size={24} className="text-blue-600" /> Sourcing Signal Map
                </h3>
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">Live Global Feed</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
                <DistributionNode label="LinkedIn" value="48%" icon={<LinkedinIcon size={18} />} color="bg-blue-600" />
                <DistributionNode label="GitHub" value="22%" icon={<Github size={18} />} color="bg-gray-900" />
                <DistributionNode label="Wellfound" value="15%" icon={<Briefcase size={18} />} color="bg-green-600" />
                <DistributionNode label="Portfolios" value="15%" icon={<Globe size={18} />} color="bg-brand-500" />
            </div>
            <div className="mt-14 pt-10 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] relative z-10">
                <span>Last Radar Scan: 2m 45s ago</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 18 Active Intercepts</span>
            </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
            <MetricCard title="Signal Strength" value="High" sub="System Stability" progress={98} icon={<Radio size={24} />} />
            <MetricCard title="Radar Matches" value="24" sub="Last 24 Hours" progress={65} icon={<Users size={24} />} />
        </div>
    </div>
);

const ManualInsightHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="lg:col-span-4 space-y-6">
            <MetricCard title="Neural Load" value="28%" sub="AI Processing Depth" progress={28} icon={<Cpu size={24} />} />
            <MetricCard title="Validation" value="100%" sub="Dataset Integrity" progress={100} icon={<CheckCircle size={24} />} />
        </div>
        <div className="lg:col-span-8 bg-gray-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><HardDrive size={200} /></div>
            <h3 className="text-xl font-black mb-10 tracking-tight flex items-center gap-3 relative z-10 italic">
                <Terminal size={24} className="text-brand-400" /> Operational Registry
            </h3>
            <div className="space-y-4 font-mono text-[11px] text-gray-400 relative z-10">
                {[
                    { op: "DATASET_UPLOAD_SDR", impact: "15 entries", time: "1h ago", status: "SYNCED" },
                    { op: "PII_ANONYMIZATION", impact: "Full Batch", time: "3h ago", status: "SECURE" },
                    { op: "REASONING_CORE_INIT", impact: "Llama/Gemini", time: "Yesterday", status: "READY" }
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 hover:text-white transition-colors group/row">
                        <span className="text-brand-500 font-bold opacity-60">[{item.time}]</span>
                        <span className="font-bold group-hover/row:text-brand-400 transition-colors">{item.op}</span>
                        <span className="opacity-40">{item.impact}</span>
                        <span className="bg-white/5 px-3 py-1 rounded-lg text-[9px] font-black border border-white/10">{item.status}</span>
                    </div>
                ))}
            </div>
            <div className="mt-12 flex gap-4 relative z-10">
                <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Download Audit Log</button>
                <button className="flex-1 bg-brand-600 hover:bg-brand-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-brand-500/20">System Performance</button>
            </div>
        </div>
    </div>
);

const HybridInsightHub = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm text-center group hover:shadow-xl transition-all">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform"><Radar size={36} /></div>
            <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">External Sourcing</h4>
            <p className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">42%</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Radar Intercepts</p>
        </div>
        <div className="bg-gray-900 p-12 rounded-[4rem] text-white text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 group-hover:rotate-12 transition-transform"><Zap size={36} className="text-brand-400" /></div>
            <h4 className="text-xl font-black mb-2 tracking-tight relative z-10 italic">Core Synergy</h4>
            <p className="text-5xl font-black mb-2 tracking-tighter relative z-10">Optimal</p>
            <p className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] relative z-10">Balanced Intelligence</p>
        </div>
        <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm text-center group hover:shadow-xl transition-all">
            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 transition-transform"><Database size={36} /></div>
            <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Internal Pipeline</h4>
            <p className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">58%</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Upload Datasets</p>
        </div>
    </div>
);

const DistributionNode = ({ label, value, icon, color }: any) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${color} shadow-lg shadow-gray-200/50`}>{icon}</div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-3xl font-black text-gray-900 tracking-tighter">{value}</div>
    </div>
);

const LinkedinIcon = ({ size, className }: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;

const BrainIcon = ({ className, size }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.78-3.06 2.5 2.5 0 0 1-2.08-4.08 2.5 2.5 0 0 1 .82-5.74 2.5 2.5 0 0 1 3.23-1.6 2.5 2.5 0 0 1 3.27-2.96z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.78-3.06 2.5 2.5 0 0 0 2.08-4.08 2.5 2.5 0 0 0-.82-5.74 2.5 2.5 0 0 0-3.23-1.6 2.5 2.5 0 0 0-3.27-2.96z"/>
    </svg>
);
