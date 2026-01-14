
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Candidate, JobCriteria, AnalysisStatus, SelectionStatus, PipelineStage } from '../types';
import { analyzeResumeWithGemini, compareCandidates } from '../services/gemini';
import { 
  Play, Check, Loader2, ThumbsUp, ThumbsDown, AlertTriangle, 
  Sparkles, Briefcase, Filter, UserPlus, X, Star, Trash2, Mail, Send, 
  ChevronRight, Download, Phone, MapPin, Linkedin, FileText, AlertCircle,
  Layout, List, Kanban, GripVertical, Scale, Notebook, Plus, Clock
} from 'lucide-react';
import { exportAnalysisToCSV } from '../services/utils';

interface AnalysisResultsProps {
  candidates: Candidate[];
  jobs: JobCriteria[];
  onUpdateCandidate: (id: string, data: Partial<Candidate>) => void;
}

const PIPELINE_COLUMNS: PipelineStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ candidates, jobs, onUpdateCandidate }) => {
  const [searchParams] = useSearchParams();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [sourcePool, setSourcePool] = useState<'specific' | 'general'>('specific');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  
  // Selection for Comparison
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Modal State
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'analysis' | 'resume' | 'notes'>('analysis');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  // Notes State
  const [newNote, setNewNote] = useState('');

  // Effect to handle URL params for deep linking to Job Analysis
  useEffect(() => {
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam && jobIdParam !== selectedJobId) {
        setSelectedJobId(jobIdParam);
        
        // Auto-detect pool
        const specificCount = candidates.filter(c => c.jobId === jobIdParam).length;
        if (specificCount === 0) {
            setSourcePool('general');
        } else {
            setSourcePool('specific');
        }
    }
  }, [searchParams, candidates]);

  // Handle Job Selection with Smart Defaulting
  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJobId = e.target.value;
    setSelectedJobId(newJobId);
    
    if (newJobId) {
        const specificCount = candidates.filter(c => c.jobId === newJobId).length;
        if (specificCount === 0) {
            setSourcePool('general');
        } else {
            setSourcePool('specific');
        }
    } else {
        setSourcePool('specific');
    }
  };

  const handleDownloadReport = () => {
      exportAnalysisToCSV(candidates, jobs);
  };

  // Filter candidates based on selection
  const displayedCandidates = candidates.filter(c => {
      if (!selectedJobId) return false;
      const matchesPool = sourcePool === 'specific' ? c.jobId === selectedJobId : c.jobId === 'general';
      const isPendingSelection = !c.selectionStatus || c.selectionStatus === SelectionStatus.PENDING || c.selectionStatus === SelectionStatus.SHORTLISTED;
      
      return matchesPool && isPendingSelection;
  }).sort((a, b) => (b.analysis?.score || 0) - (a.analysis?.score || 0)); // Sort by score descending

  const specificCount = selectedJobId ? candidates.filter(c => c.jobId === selectedJobId).length : 0;
  const generalCount = candidates.filter(c => c.jobId === 'general').length;

  const runAnalysis = async (candidate: Candidate) => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;

    onUpdateCandidate(candidate.id, { status: AnalysisStatus.ANALYZING });

    // Construct detailed job criteria string for AI including weights
    let skillsString = job.requiredSkills.join(', ');
    if (job.weightedSkills && job.weightedSkills.length > 0) {
        skillsString = job.weightedSkills
            .map(s => `${s.skill} (Importance: ${s.weight}/10)`)
            .join(', ');
    }

    const jobDesc = `
        Title: ${job.title}
        Type: ${job.type}
        Location: ${job.location}
        Skills & Criteria (with importance weights): ${skillsString}
        Experience Level: ${job.experienceLevel}
        Description: ${job.description}
    `;
    
    try {
        const result = await analyzeResumeWithGemini(candidate.resumeText, jobDesc);
        // If AI finds a better email, update it
        const newEmail = result.contactDetails?.email;
        
        onUpdateCandidate(candidate.id, {
            status: AnalysisStatus.COMPLETED,
            analysis: result,
            jobId: selectedJobId,
            selectionStatus: SelectionStatus.PENDING,
            email: newEmail && newEmail.includes('@') ? newEmail : candidate.email
        });
    } catch (e) {
        onUpdateCandidate(candidate.id, { status: AnalysisStatus.FAILED });
    }
  };

  const runBulkAnalysis = async () => {
      const pending = displayedCandidates.filter(c => c.status === AnalysisStatus.PENDING);
      for (const c of pending) {
          await runAnalysis(c);
      }
  }

  // --- KANBAN HANDLERS ---
  const handleDragStart = (e: React.DragEvent, candidateId: string) => {
      e.dataTransfer.setData('candidateId', candidateId);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
      const candidateId = e.dataTransfer.getData('candidateId');
      if (candidateId) {
          onUpdateCandidate(candidateId, { stage: stage });
      }
  };

  // --- COMPARISON HANDLERS ---
  const toggleComparison = (id: string) => {
      if (selectedForComparison.includes(id)) {
          setSelectedForComparison(selectedForComparison.filter(c => c !== id));
      } else {
          if (selectedForComparison.length < 3) {
              setSelectedForComparison([...selectedForComparison, id]);
          } else {
              alert("You can compare up to 3 candidates.");
          }
      }
  };

  const runComparison = async () => {
      const job = jobs.find(j => j.id === selectedJobId);
      if (!job || selectedForComparison.length < 2) return;
      
      setIsComparing(true);
      const cands = candidates.filter(c => selectedForComparison.includes(c.id));
      const result = await compareCandidates(cands, job.title);
      setComparisonResult(result);
      setIsComparing(false);
  };

  // --- NOTES HANDLER ---
  const handleAddNote = () => {
      if(!viewCandidate || !newNote.trim()) return;
      const note = {
          id: Date.now().toString(),
          text: newNote,
          timestamp: new Date().toISOString(),
          author: 'Recruiter'
      };
      const updatedNotes = viewCandidate.notes ? [...viewCandidate.notes, note] : [note];
      onUpdateCandidate(viewCandidate.id, { notes: updatedNotes });
      setViewCandidate({ ...viewCandidate, notes: updatedNotes });
      setNewNote('');
  };

  const handleDeleteNote = (noteId: string) => {
       if(!viewCandidate) return;
       const updatedNotes = viewCandidate.notes?.filter(n => n.id !== noteId) || [];
       onUpdateCandidate(viewCandidate.id, { notes: updatedNotes });
       setViewCandidate({ ...viewCandidate, notes: updatedNotes });
  };

  // --- Action Handlers ---

  const handleOpenModal = (candidate: Candidate) => {
    setViewCandidate(candidate);
    setIsEmailMode(false);
    setActiveModalTab('analysis');
  };

  const handleCloseModal = () => {
    setViewCandidate(null);
    setIsEmailMode(false);
    setComparisonResult(null);
    setSelectedForComparison([]);
  };

  const handleMarkExceptional = () => {
    if (viewCandidate) {
        onUpdateCandidate(viewCandidate.id, { selectionStatus: SelectionStatus.EXCEPTIONAL });
        handleCloseModal();
    }
  };

  const handleReject = () => {
    if (viewCandidate) {
        onUpdateCandidate(viewCandidate.id, { selectionStatus: SelectionStatus.REJECTED });
        handleCloseModal();
    }
  };

  const handleComposeEmail = () => {
    if (!viewCandidate || !selectedJobId) return;
    
    const job = jobs.find(j => j.id === selectedJobId);
    const firstName = viewCandidate.name.split(' ')[0];
    const topStrengths = viewCandidate.analysis?.pros.slice(0, 2).join(' and ') || 'background';
    
    setEmailSubject(`Interview Invitation: ${job?.title} position at Ranker AI`);
    
    const draft = `Dear ${firstName},

We have reviewed your application for the ${job?.title} position and we are very impressed with your profile. 

Specifically, your ${topStrengths} stood out to our team and aligns perfectly with what we are looking for. We ranked your application highly among our current candidate pool.

We would love to schedule a time to discuss your experience and the role in more detail.

Please let us know your availability for a brief call this week.

Best regards,

Recruitment Team
Ranker AI`;

    setEmailBody(draft);
    setIsEmailMode(true);
  };

  const handleSendEmail = () => {
      alert(`Email sent to ${viewCandidate?.email}`);
      handleCloseModal();
  };

  return (
    <div className="space-y-8 min-h-[600px] pb-20">
        {/* Header & Controls */}
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Analysis & Ranking</h1>
                    <p className="text-gray-500">Analyze candidates and view the leaderboard based on AI scoring.</p>
                </div>
                <div className="flex gap-2">
                    {/* View Toggles */}
                    <div className="bg-white border border-gray-200 rounded-lg p-1 flex">
                        <button 
                           onClick={() => setViewMode('list')}
                           className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                           title="List View"
                        >
                            <List size={18} />
                        </button>
                        <button 
                           onClick={() => setViewMode('board')}
                           className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                           title="Kanban Board View"
                        >
                            <Kanban size={18} />
                        </button>
                    </div>

                    {candidates.some(c => c.status === AnalysisStatus.COMPLETED) && (
                        <button 
                            onClick={handleDownloadReport}
                            className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                        >
                            <Download size={18} />
                            Download Report
                        </button>
                    )}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-end md:items-center">
                <div className="w-full md:w-1/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Briefcase size={14} /> Target Job Profile
                    </label>
                    <div className="relative">
                        <select 
                            value={selectedJobId}
                            onChange={handleJobChange}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none text-gray-900 font-medium"
                        >
                            <option value="">Select a Job to Analyze...</option>
                            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {selectedJobId && (
                    <div className="w-full md:w-1/3 animate-fade-in">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Filter size={14} /> Resume Source
                        </label>
                        <div className="relative">
                            <select 
                                value={sourcePool}
                                onChange={(e) => setSourcePool(e.target.value as 'specific' | 'general')}
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none text-gray-900 font-medium"
                            >
                                <option value="specific">Assigned to Job ({specificCount})</option>
                                <option value="general">General Pool (Unassigned) ({generalCount})</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                )}

                 {selectedJobId && (
                     <div className="w-full md:w-auto flex-1 flex justify-end">
                         <button 
                            onClick={runBulkAnalysis}
                            disabled={displayedCandidates.filter(c => c.status === AnalysisStatus.PENDING).length === 0}
                            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Sparkles size={18} />
                            Analyze Pending ({displayedCandidates.filter(c => c.status === AnalysisStatus.PENDING).length})
                        </button>
                     </div>
                 )}
            </div>
        </div>

        {!selectedJobId ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-center animate-fade-in">
                <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600 shadow-sm">
                    <Sparkles size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Analyze?</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                    Select a job profile from the dropdown above to start ranking candidates.
                </p>
            </div>
        ) : (
            <>
            {/* COMPARISON FLOATING BUTTON */}
            {selectedForComparison.length > 1 && viewMode === 'list' && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 animate-in slide-in-from-bottom-4">
                    <span className="font-medium text-sm">{selectedForComparison.length} Candidates Selected</span>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button 
                        onClick={runComparison}
                        disabled={isComparing}
                        className="flex items-center gap-2 font-bold text-sm hover:text-brand-300 transition-colors"
                    >
                        {isComparing ? <Loader2 size={16} className="animate-spin" /> : <Scale size={16} />}
                        Compare with AI
                    </button>
                    <button onClick={() => setSelectedForComparison([])} className="hover:text-red-300"><X size={16} /></button>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            {viewMode === 'list' ? (
                // LIST VIEW
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            {sourcePool === 'specific' ? 'Ranking Leaderboard' : 'General Pool Candidates'}
                        </h3>
                        <span className="text-xs text-gray-500">
                            Sorted by Fit Score (High to Low)
                        </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                    <th className="px-6 py-4 w-10"></th>
                                    <th className="px-6 py-4 w-16 text-center">Rank</th>
                                    <th className="px-6 py-4">Candidate</th>
                                    <th className="px-6 py-4">Pipeline Stage</th>
                                    <th className="px-6 py-4">Mutual Score</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayedCandidates.length > 0 ? displayedCandidates.map((c, index) => (
                                    <tr key={c.id} className="hover:bg-brand-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedForComparison.includes(c.id)}
                                                onChange={() => toggleComparison(c.id)}
                                                disabled={c.status !== AnalysisStatus.COMPLETED}
                                                className="rounded text-brand-600 focus:ring-brand-500 cursor-pointer disabled:opacity-50"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-gray-400">
                                            {c.status === AnalysisStatus.COMPLETED ? `#${index + 1}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.fileName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 rounded-full text-gray-600 border border-gray-200">
                                                {c.stage || 'Applied'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.status === AnalysisStatus.COMPLETED ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`
                                                        w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border-2
                                                        ${(c.analysis?.score || 0) >= 80 ? 'border-green-100 bg-green-50 text-green-600' :
                                                        (c.analysis?.score || 0) >= 50 ? 'border-yellow-100 bg-yellow-50 text-yellow-600' :
                                                        'border-red-100 bg-red-50 text-red-600'}
                                                    `}>
                                                        {((c.analysis?.score || 0) / 10).toFixed(1)}
                                                    </div>
                                                    <span className="text-xs text-gray-400 font-medium">/ 10</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.status === AnalysisStatus.ANALYZING ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                    <Loader2 size={12} className="animate-spin" /> Analyzing
                                                </span>
                                            ) : c.status === AnalysisStatus.PENDING ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    Analyzed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {c.status === AnalysisStatus.COMPLETED ? (
                                                <button 
                                                    onClick={() => handleOpenModal(c)}
                                                    className="bg-white border border-brand-200 text-brand-600 hover:bg-brand-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                >
                                                    View Analysis
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => runAnalysis(c)}
                                                    disabled={c.status === AnalysisStatus.ANALYZING}
                                                    className="bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 px-4 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
                                                >
                                                    {c.status === AnalysisStatus.ANALYZING ? 'Running...' : 'Analyze'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                                    <UserPlus size={20} />
                                                </div>
                                                <p>No candidates in this list yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                // KANBAN BOARD VIEW
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[600px] animate-fade-in overflow-x-auto pb-4">
                    {PIPELINE_COLUMNS.map(stage => (
                        <div 
                            key={stage} 
                            className="bg-gray-100 rounded-xl p-3 flex flex-col h-full min-w-[250px]"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            <h4 className="font-bold text-gray-700 text-sm mb-3 px-1 flex justify-between items-center">
                                {stage}
                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                    {displayedCandidates.filter(c => (c.stage || 'Applied') === stage).length}
                                </span>
                            </h4>
                            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {displayedCandidates
                                    .filter(c => (c.stage || 'Applied') === stage)
                                    .map(c => (
                                        <div 
                                            key={c.id} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, c.id)}
                                            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
                                            onClick={() => handleOpenModal(c)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-bold text-gray-900 text-sm truncate">{c.name}</h5>
                                                {c.analysis && (
                                                    <span className={`text-xs font-bold ${c.analysis.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {((c.analysis.score)/10).toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mb-2">{c.fileName}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><GripVertical size={12} /> Drag</span>
                                                <button className="hover:text-brand-600">View</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </>
        )}

        {/* COMPARISON MODAL */}
        {comparisonResult && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                            <Scale size={20} className="text-brand-600"/> Candidate Comparison
                        </h3>
                        <button onClick={() => setComparisonResult(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-8 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                        {comparisonResult}
                    </div>
                 </div>
            </div>
        )}

        {/* DETAIL MODAL */}
        {viewCandidate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                    
                    {/* Modal Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white sticky top-0 z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-gray-900">{viewCandidate.name}</h2>
                                {viewCandidate.analysis?.experienceRating && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-bold uppercase tracking-wider">
                                        {viewCandidate.analysis.experienceRating}
                                    </span>
                                )}
                            </div>
                            
                            {/* Contact Details Display */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                                <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {viewCandidate.analysis?.contactDetails?.email || viewCandidate.email}</span>
                                {viewCandidate.analysis?.contactDetails?.phone && (
                                    <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {viewCandidate.analysis.contactDetails.phone}</span>
                                )}
                                {viewCandidate.analysis?.contactDetails?.location && (
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {viewCandidate.analysis.contactDetails.location}</span>
                                )}
                                {viewCandidate.analysis?.contactDetails?.linkedin && (
                                    <span className="flex items-center gap-1.5 text-blue-600"><Linkedin size={14} /> LinkedIn Profile</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                             {/* Score Badge */}
                            <div className="text-center bg-brand-50 px-5 py-2 rounded-xl border border-brand-100">
                                <div className="text-3xl font-bold text-brand-600">
                                    {((viewCandidate.analysis?.score || 0) / 10).toFixed(1)}
                                </div>
                                <div className="text-[10px] text-brand-400 uppercase tracking-wider font-bold">Fit Score</div>
                            </div>
                            <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    {!isEmailMode && (
                        <div className="flex border-b border-gray-100 px-8">
                            <button 
                                onClick={() => setActiveModalTab('analysis')}
                                className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${activeModalTab === 'analysis' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Analysis Report
                            </button>
                            <button 
                                onClick={() => setActiveModalTab('resume')}
                                className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${activeModalTab === 'resume' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Original Resume
                            </button>
                            <button 
                                onClick={() => setActiveModalTab('notes')}
                                className={`pb-3 px-2 text-sm font-bold transition-colors border-b-2 ${activeModalTab === 'notes' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                Recruiter Notes
                            </button>
                        </div>
                    )}

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                        {isEmailMode ? (
                            // EMAIL COMPOSER VIEW
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                                    <div className="w-10 h-10 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Compose Personal Email</h3>
                                        <p className="text-sm text-gray-500">AI-assisted draft based on candidate profile</p>
                                    </div>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">To</label>
                                        <input 
                                            type="text" 
                                            value={viewCandidate.analysis?.contactDetails?.email || viewCandidate.email} 
                                            disabled
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subject</label>
                                        <input 
                                            type="text" 
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Message</label>
                                        <textarea 
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                            className="w-full flex-1 p-4 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono text-sm leading-relaxed resize-none min-h-[300px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={() => setIsEmailMode(false)}
                                        className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back to Analysis
                                    </button>
                                    <button 
                                        onClick={handleSendEmail}
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                                    >
                                        <Send size={16} />
                                        Send Email
                                    </button>
                                </div>
                            </div>
                        ) : activeModalTab === 'resume' ? (
                            // RESUME VIEW
                            <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
                                {viewCandidate.fileData ? (
                                    viewCandidate.fileType?.includes('pdf') ? (
                                        <iframe 
                                            src={viewCandidate.fileData} 
                                            className="w-full h-full rounded-lg border border-gray-100" 
                                            title="Resume Preview"
                                        />
                                    ) : (
                                        <div className="text-center p-8">
                                            <p className="text-gray-500 mb-4">Preview not available for this file type directly.</p>
                                            <a 
                                                href={viewCandidate.fileData} 
                                                download={viewCandidate.fileName} 
                                                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 inline-flex items-center gap-2"
                                            >
                                                <Download size={18} /> Download Resume
                                            </a>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center max-w-lg">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <FileText size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Original File Not Available</h3>
                                        <p className="text-gray-500 mb-6">
                                            The resume file was larger than 400KB and was removed after text extraction to optimize performance. You can still view the extracted text used for analysis below.
                                        </p>
                                        <div className="bg-gray-50 p-4 rounded-lg text-left border border-gray-200 max-h-96 overflow-y-auto text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                            {viewCandidate.resumeText}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : activeModalTab === 'notes' ? (
                            // NOTES VIEW
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-100 bg-gray-50">
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                        <Notebook size={18} className="text-brand-600"/> Candidate Notes
                                    </h4>
                                    <p className="text-sm text-gray-500">Internal notes visible only to the recruitment team.</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {viewCandidate.notes && viewCandidate.notes.length > 0 ? (
                                        viewCandidate.notes.map(note => (
                                            <div key={note.id} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 relative group">
                                                <p className="text-gray-800 text-sm whitespace-pre-wrap mb-2">{note.text}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>{new Date(note.timestamp).toLocaleString()} • {note.author}</span>
                                                    <button 
                                                        onClick={() => handleDeleteNote(note.id)}
                                                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-400 italic">
                                            No notes added yet.
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                            placeholder="Add a note..."
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                                        />
                                        <button 
                                            onClick={handleAddNote}
                                            disabled={!newNote.trim()}
                                            className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // ANALYSIS VIEW
                            <div className="space-y-6">
                                {/* Actions Toolbar */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <button 
                                        onClick={handleMarkExceptional}
                                        className="flex-1 bg-white border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl font-bold shadow-sm hover:bg-yellow-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Star size={18} className="fill-yellow-500 text-yellow-500" />
                                        Mark as Exceptional
                                    </button>
                                    <button 
                                        onClick={handleComposeEmail}
                                        className="flex-1 bg-white border border-brand-200 text-brand-600 px-4 py-3 rounded-xl font-bold shadow-sm hover:bg-brand-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Mail size={18} />
                                        Send Email
                                    </button>
                                    <button 
                                        onClick={handleReject}
                                        className="flex-1 bg-white border border-red-200 text-red-600 px-4 py-3 rounded-xl font-bold shadow-sm hover:bg-red-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Remove / Reject
                                    </button>
                                </div>

                                {/* Summary */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Sparkles size={16} className="text-brand-500" /> AI Executive Summary
                                    </h4>
                                    <p className="text-gray-600 leading-relaxed">
                                        {viewCandidate.analysis?.summary}
                                    </p>
                                </div>

                                {/* Pros & Cons Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                        <h4 className="text-sm font-bold text-green-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <ThumbsUp size={16} /> Key Strengths
                                        </h4>
                                        <ul className="space-y-3">
                                            {viewCandidate.analysis?.pros.map((pro, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                                                    <div className="mt-1 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <Check size={10} className="text-green-600" />
                                                    </div>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                        <h4 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <ThumbsDown size={16} /> Potential Gaps
                                        </h4>
                                        <ul className="space-y-3">
                                            {viewCandidate.analysis?.cons.map((con, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                                                    <div className="mt-1 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                        <X size={10} className="text-red-600" />
                                                    </div>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Technical Skills Analysis</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewCandidate.analysis?.skillsAnalysis.map((skill, i) => (
                                            <div key={i} className={`
                                                px-3 py-2 rounded-lg text-sm border flex items-center gap-2 font-medium
                                                ${skill.present 
                                                    ? 'bg-blue-50 border-blue-100 text-blue-700' 
                                                    : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'}
                                            `}>
                                                {skill.present ? <Check size={14} className="text-blue-500" /> : <AlertTriangle size={14} />}
                                                {skill.skill}
                                                {skill.present && <span className="text-xs font-normal opacity-70 ml-1">({skill.relevance})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
