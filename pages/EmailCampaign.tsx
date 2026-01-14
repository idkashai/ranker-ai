
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Candidate, JobCriteria, AnalysisStatus, CampaignLog, InterviewQuestion, ActivityLog } from '../types';
import { Mail, Send, Users, CheckCircle2, History, MessageSquare, Rocket, Sparkles, Wand2, ArrowLeft, Link as LinkIcon, ExternalLink, Copy, Clipboard, Target, Plus, X, Trash2, Zap, Loader2 } from 'lucide-react';
import { generateEmailSubject, generateEmailBody, generateInterviewQuestions, generateInterviewFocusAreas, generateQuestionsByFocus } from '../services/gemini';

interface EmailCampaignProps {
  candidates: Candidate[];
  jobs: JobCriteria[];
  onUpdateJob?: (id: string, job: Partial<JobCriteria>) => void;
  onLogActivity?: (type: ActivityLog['type'], description: string) => void;
}

export const EmailCampaign: React.FC<EmailCampaignProps> = ({ candidates, jobs, onUpdateJob, onLogActivity }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'new' | 'history'>('dashboard');
  const [creationStep, setCreationStep] = useState<'selection' | 'configuration'>('selection');
  const [campaignType, setCampaignType] = useState<'auto' | 'individual' | 'interview' | 'public_link'>('auto');
  
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isGeneratingSubject, setIsGeneratingSubject] = useState(false);
  const [isGeneratingBody, setIsGeneratingBody] = useState(false);
  
  // Public Interview Config State
  const [publicLinkActive, setPublicLinkActive] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [isGeneratingFocus, setIsGeneratingFocus] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const [logs, setLogs] = useState<CampaignLog[]>([
      { id: '1', date: new Date().toISOString(), type: 'Bulk Email', recipientCount: 12, jobId: 'j1', jobTitle: 'Senior React Developer', status: 'Sent' }
  ]);

  useEffect(() => {
    const jobIdParam = searchParams.get('jobId');
    if (jobIdParam) {
        setSelectedJobId(jobIdParam);
        setActiveTab('new');
        setCreationStep('configuration');
    }
  }, [searchParams]);

  // Load default questions when job selected
  useEffect(() => {
    if (selectedJobId) {
        const job = jobs.find(j => j.id === selectedJobId);
        if (job?.interviewConfig?.questions) {
            setInterviewQuestions(job.interviewConfig.questions);
        } else {
            setInterviewQuestions([]);
        }
    }
  }, [selectedJobId, jobs]);

  const eligibleCandidates = candidates.filter(
    c => c.jobId === selectedJobId && c.status === AnalysisStatus.COMPLETED
  );

  const topCandidates = eligibleCandidates.filter(c => (c.analysis?.score || 0) > 70);
  
  const handleSelectType = (type: 'auto' | 'individual' | 'interview' | 'public_link') => {
      setCampaignType(type);
      setCreationStep('configuration');
      setPublicLinkActive(false);
  };

  const handleGenerateSubject = async () => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;
    setIsGeneratingSubject(true);
    const type = campaignType === 'interview' ? 'invite' : 'offer';
    const candName = candidates.find(c => c.id === selectedCandidateId)?.name || 'Candidate';
    const sub = await generateEmailSubject(type, job.title, candName);
    setSubject(sub);
    setIsGeneratingSubject(false);
  };

  const handleGenerateBody = async () => {
    const job = jobs.find(j => j.id === selectedJobId);
    if (!job) return;
    setIsGeneratingBody(true);
    const type = campaignType === 'interview' ? 'invite' : 'offer';
    const candName = candidates.find(c => c.id === selectedCandidateId)?.name || 'Candidate';
    const b = await generateEmailBody(type, job.title, candName);
    setBody(b);
    setIsGeneratingBody(false);
  };

  // --- Interview Question Logic for Public Link ---
  const handleGenerateFocusAreas = async () => {
      const job = jobs.find(j => j.id === selectedJobId);
      if (!job) return;
      setIsGeneratingFocus(true);
      const areas = await generateInterviewFocusAreas(job.title, job.description);
      setFocusAreas(areas);
      setIsGeneratingFocus(false);
  };

  const handleGenerateQuestionsByFocus = async (area: string) => {
      const job = jobs.find(j => j.id === selectedJobId);
      if (!job) return;
      setIsGeneratingQuestions(true);
      const newQs = await generateQuestionsByFocus(job.title, area);
      setInterviewQuestions([...interviewQuestions, ...newQs]);
      setIsGeneratingQuestions(false);
  };

  const handleGenerateQuestions = async () => {
      const job = jobs.find(j => j.id === selectedJobId);
      if (!job) return;
      setIsGeneratingQuestions(true);
      try {
          const generated = await generateInterviewQuestions(job.title, job.description);
          setInterviewQuestions(generated);
      } catch(e) { console.error(e); } finally { setIsGeneratingQuestions(false); }
  };

  const handleActivatePublicLink = () => {
      if (!selectedJobId || !onUpdateJob) return;
      
      // 1. Save Questions to Job
      onUpdateJob(selectedJobId, {
          interviewConfig: {
              questions: interviewQuestions,
              durationMinutes: 30
          }
      });

      // 2. Set State to Show Link
      setPublicLinkActive(true);

      // 3. Log
      const jobTitle = jobs.find(j => j.id === selectedJobId)?.title || 'Unknown';
      if(onLogActivity) onLogActivity('CAMPAIGN_LAUNCHED', `Activated Public Interview Link for ${jobTitle}`);

      // 4. Add to Campaign History
      const newLog: CampaignLog = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          type: 'Public Link',
          recipientCount: 0,
          jobId: selectedJobId,
          jobTitle: jobTitle,
          status: 'Active'
      };
      setLogs([newLog, ...logs]);
  };

  const handleSend = () => {
    let count = 0;
    let typeStr: any = 'Bulk Email';
    
    if (campaignType === 'individual') { count = 1; typeStr = 'Individual Email'; }
    else if (campaignType === 'auto') { count = topCandidates.length; typeStr = 'Bulk Email'; }
    else if (campaignType === 'interview') { count = 1; typeStr = 'Interview Invite'; }

    const jobTitle = jobs.find(j => j.id === selectedJobId)?.title || 'Unknown';
    const newLog: CampaignLog = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: typeStr,
        recipientCount: count,
        jobId: selectedJobId,
        jobTitle: jobTitle,
        status: 'Sent'
    };
    
    setLogs([newLog, ...logs]);
    setActiveTab('history');
    setCreationStep('selection');
    
    if(onLogActivity) onLogActivity('CAMPAIGN_LAUNCHED', `Sent ${typeStr} to ${count} candidate(s) for ${jobTitle}`);
    alert(`Campaign Sent Successfully!`);
  };

  const renderDashboard = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BriefcaseIcon />
              </div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <h3 className="text-3xl font-bold text-gray-900">{jobs.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Rocket />
              </div>
              <p className="text-gray-500 text-sm">Campaigns Launched</p>
              <h3 className="text-3xl font-bold text-gray-900">{logs.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare />
              </div>
              <p className="text-gray-500 text-sm">Interviews Conducted</p>
              <h3 className="text-3xl font-bold text-gray-900">0</h3>
          </div>
          
          <div className="md:col-span-3 bg-gradient-to-r from-brand-600 to-blue-700 rounded-2xl p-8 text-white flex justify-between items-center shadow-lg">
              <div>
                  <h2 className="text-2xl font-bold mb-2">Launch New Campaign</h2>
                  <p className="opacity-90 max-w-xl">Reach out to top talent, schedule interviews, or send status updates with AI-powered personalization.</p>
              </div>
              <button 
                onClick={() => { setActiveTab('new'); setCreationStep('selection'); }}
                className="bg-white text-brand-700 px-6 py-3 rounded-xl font-bold hover:bg-brand-50 transition-colors shadow-md"
              >
                  Start Campaign
              </button>
          </div>
      </div>
  );

  const renderSelection = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in py-8">
          <div 
            onClick={() => handleSelectType('auto')}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-brand-300 hover:shadow-md cursor-pointer transition-all group"
          >
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Rocket size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Auto-Blast</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  Send personalized emails to top-ranked candidates automatically.
              </p>
          </div>

          <div 
            onClick={() => handleSelectType('individual')}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-300 hover:shadow-md cursor-pointer transition-all group"
          >
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Individual Email</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  Craft a tailored message for a specific candidate.
              </p>
          </div>

          <div 
             onClick={() => handleSelectType('interview')}
             className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-green-300 hover:shadow-md cursor-pointer transition-all group"
          >
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Interview Invite</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  Send a unique link to candidates for an automated AI interview.
              </p>
          </div>
          
          <div 
             onClick={() => handleSelectType('public_link')}
             className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Public Interview Link</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                  Generate a shareable link for open applications. Customize questions first.
              </p>
          </div>
      </div>
  );

  const renderConfiguration = () => (
      <div className="animate-fade-in">
          <button 
            onClick={() => setCreationStep('selection')}
            className="mb-6 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors"
          >
             <ArrowLeft size={16} /> Back to Selection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                       {campaignType === 'auto' && <Rocket className="text-brand-600" />}
                       {campaignType === 'individual' && <Mail className="text-purple-600" />}
                       {campaignType === 'interview' && <MessageSquare className="text-green-600" />}
                       {campaignType === 'public_link' && <LinkIcon className="text-blue-600" />}
                       
                       {campaignType === 'auto' && 'Configure Auto-Blast Campaign'}
                       {campaignType === 'individual' && 'Compose Individual Email'}
                       {campaignType === 'interview' && 'Send Interview Invitation'}
                       {campaignType === 'public_link' && 'Generate Public Interview Link'}
                   </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Job Position</label>
                            <select 
                                value={selectedJobId}
                                onChange={(e) => { setSelectedJobId(e.target.value); setPublicLinkActive(false); }}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                            >
                                <option value="">Select a job...</option>
                                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                            </select>
                        </div>

                        {/* --- PUBLIC LINK WORKFLOW --- */}
                        {campaignType === 'public_link' ? (
                             <div className="mt-4">
                                 {!selectedJobId ? (
                                     <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">Select a job position to configure the interview.</p>
                                 ) : publicLinkActive ? (
                                     <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center animate-fade-in">
                                         <p className="text-blue-900 font-bold mb-4 flex items-center justify-center gap-2"><CheckCircle2 size={18} /> Link Activated</p>
                                         <div className="flex gap-2 items-center justify-center mb-4">
                                            <code className="bg-white px-4 py-3 rounded-lg border border-blue-200 text-blue-700 font-mono text-sm break-all">
                                                {window.location.origin}/#/interview/public/{selectedJobId}
                                            </code>
                                            <button 
                                                className="p-3 bg-white rounded-lg border border-blue-200 text-blue-600 hover:text-blue-800" 
                                                title="Copy Link"
                                                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/#/interview/public/${selectedJobId}`)}
                                            >
                                                <Copy size={16} />
                                            </button>
                                         </div>
                                         <p className="text-xs text-blue-600">Candidates who use this link will be automatically added to the dashboard upon completion.</p>
                                         <button 
                                            onClick={() => setPublicLinkActive(false)}
                                            className="text-xs text-blue-500 hover:text-blue-700 mt-4 underline"
                                         >
                                             Re-configure Questions
                                         </button>
                                     </div>
                                 ) : (
                                     <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                         <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><MessageSquare size={18} /> Configure Interview Questions</h3>
                                         <p className="text-sm text-blue-700 mb-6">Before activating the link, verify the questions that will be asked to candidates.</p>
                                         
                                         {/* AI Generators */}
                                         <div className="flex gap-2 mb-4">
                                             <button 
                                                 onClick={handleGenerateFocusAreas}
                                                 disabled={isGeneratingFocus}
                                                 className="bg-white text-blue-600 text-xs font-bold px-3 py-2 rounded-lg border border-blue-200 flex items-center gap-1 hover:bg-blue-50"
                                             >
                                                 {isGeneratingFocus ? <Loader2 size={12} className="animate-spin" /> : <Target size={12} />} Generate Topics
                                             </button>
                                             <button 
                                                 onClick={handleGenerateQuestions}
                                                 disabled={isGeneratingQuestions}
                                                 className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700"
                                             >
                                                 {isGeneratingQuestions ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} Auto-Generate All
                                             </button>
                                         </div>

                                         {/* Focus Areas Display */}
                                         {focusAreas.length > 0 && (
                                             <div className="flex flex-wrap gap-2 mb-4">
                                                 {focusAreas.map((area, i) => (
                                                     <div key={i} className="flex items-center gap-2 bg-white px-2 py-1 rounded text-xs border border-blue-200 text-blue-800">
                                                         {area}
                                                         <button onClick={() => handleGenerateQuestionsByFocus(area)} title="Generate for this topic" className="text-blue-400 hover:text-blue-600"><Zap size={10} /></button>
                                                     </div>
                                                 ))}
                                             </div>
                                         )}

                                         {/* Questions List */}
                                         <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                            {interviewQuestions.length > 0 ? interviewQuestions.map((q, i) => (
                                                <div key={q.id} className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-gray-700 flex gap-2 group hover:border-blue-300 transition-colors">
                                                    <span className="font-bold text-blue-500 mt-1">{i+1}.</span>
                                                    <textarea 
                                                        value={q.text}
                                                        onChange={(e) => {
                                                            const updated = [...interviewQuestions];
                                                            updated[i] = { ...updated[i], text: e.target.value };
                                                            setInterviewQuestions(updated);
                                                        }}
                                                        className="flex-1 text-sm border-transparent focus:border-blue-300 focus:ring-0 bg-transparent resize-none p-0 text-gray-700 min-h-[40px]"
                                                        rows={2}
                                                    />
                                                    <button onClick={() => setInterviewQuestions(interviewQuestions.filter(x => x.id !== q.id))} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 self-start p-1"><X size={14} /></button>
                                                </div>
                                            )) : <p className="text-sm text-gray-400 italic text-center py-4">No questions configured yet.</p>}
                                         </div>
                                         
                                         <button 
                                            onClick={() => setInterviewQuestions([...interviewQuestions, { id: Date.now().toString(), text: "New Question", type: 'general' }])}
                                            className="w-full py-2 mb-4 border border-dashed border-blue-300 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                                         >
                                             <Plus size={14} /> Add Custom Question
                                         </button>

                                         <button 
                                            onClick={handleActivatePublicLink}
                                            disabled={interviewQuestions.length === 0}
                                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                         >
                                             Activate Link
                                         </button>
                                     </div>
                                 )}
                             </div>
                        ) : (
                            // Standard Email Flows
                            <>
                                {(campaignType === 'individual' || campaignType === 'interview') && (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Select Candidate</label>
                                        <select 
                                            value={selectedCandidateId}
                                            onChange={(e) => setSelectedCandidateId(e.target.value)}
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                                            disabled={!selectedJobId}
                                        >
                                            <option value="">Select candidate...</option>
                                            {eligibleCandidates.map(c => <option key={c.id} value={c.id}>{c.name} ({c.analysis?.score}%)</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Email Subject</label>
                                        <button 
                                            onClick={handleGenerateSubject}
                                            disabled={isGeneratingSubject || !selectedJobId}
                                            className="text-xs text-brand-600 font-bold flex items-center gap-1 hover:text-brand-800 disabled:opacity-50"
                                        >
                                            {isGeneratingSubject ? <Wand2 size={12} className="animate-spin" /> : <Wand2 size={12} />} 
                                            Generate Subject
                                        </button>
                                    </div>
                                    <input 
                                        type="text" value={subject} onChange={e => setSubject(e.target.value)}
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 placeholder-gray-400"
                                        placeholder={campaignType === 'interview' ? "Interview Invitation..." : "Update on your application..."}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-semibold text-gray-700">Email Body</label>
                                        <button 
                                            onClick={handleGenerateBody}
                                            disabled={isGeneratingBody || !selectedJobId}
                                            className="text-xs text-brand-600 font-bold flex items-center gap-1 hover:text-brand-800 disabled:opacity-50"
                                        >
                                             {isGeneratingBody ? <Wand2 size={12} className="animate-spin" /> : <Wand2 size={12} />} 
                                             Generate Body
                                        </button>
                                    </div>
                                    <textarea 
                                        value={body} onChange={e => setBody(e.target.value)}
                                        className="w-full p-4 border border-gray-300 rounded-lg h-48 font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 placeholder-gray-400 leading-relaxed"
                                        placeholder="Write your message here..."
                                    />
                                    {campaignType === 'interview' && (
                                        <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded flex items-center gap-2">
                                            <Rocket size={12} /> The unique interview room link will be automatically appended to this email.
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleSend}
                                    disabled={!selectedJobId || (campaignType === 'auto' && topCandidates.length === 0)}
                                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 shadow-sm"
                                >
                                    <Send size={18} />
                                    {campaignType === 'auto' ? `Send to Top ${topCandidates.length} Candidates` : 'Send Email'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Right Sidebar - Info Panel */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users size={20} />
                        Target Audience
                    </h3>
                    {selectedJobId ? (
                        campaignType === 'public_link' ? (
                            <p className="text-sm text-gray-500">Anyone with the link can access the interview room.</p>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 mb-2">
                                    {campaignType === 'auto' ? 'Top performing candidates:' : 'Selected candidate:'}
                                </p>
                                {campaignType === 'auto' ? (
                                    topCandidates.length > 0 ? topCandidates.map(c => (
                                        <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="text-sm truncate">
                                                <p className="font-medium text-gray-900">{c.name}</p>
                                            </div>
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                {((c.analysis?.score || 0)/10).toFixed(1)}/10
                                            </span>
                                        </div>
                                    )) : <p className="text-sm text-gray-400 italic">No candidates match criteria ({'>'}70%)</p>
                                ) : (
                                selectedCandidateId ? (
                                    <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
                                        <p className="font-bold text-brand-800">{candidates.find(c => c.id === selectedCandidateId)?.name}</p>
                                        <p className="text-xs text-brand-600">{candidates.find(c => c.id === selectedCandidateId)?.email}</p>
                                    </div>
                                ) : <p className="text-sm text-gray-400">No candidate selected</p> 
                                )}
                            </div>
                        )
                    ) : (
                        <p className="text-sm text-gray-400">Select a job position to see eligible recipients.</p>
                    )}
                </div>
                
                {/* Embedded Interview Question Preview for Interview Campaign */}
                {campaignType === 'interview' && selectedJobId && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Included Questions
                        </h3>
                         <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {interviewQuestions.map((q, i) => (
                                <div key={q.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700">
                                    <span className="font-bold mr-2">{i+1}.</span> {q.text}
                                </div>
                            ))}
                         </div>
                         <p className="text-xs text-gray-400 mt-2 italic">To edit, please go to Job Criteria or use the Public Link flow.</p>
                    </div>
                )}
            </div>
          </div>
      </div>
  );

  const renderHistory = () => (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Campaign Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Job Profile</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Recipients</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{new Date(log.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{log.jobTitle}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{log.recipientCount}</td>
                          <td className="px-6 py-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {log.status}
                              </span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaign Manager</h1>
            <p className="text-gray-500">Manage outreach, automated emails, and interview invitations.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'dashboard' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              Overview
          </button>
          <button 
            onClick={() => { setActiveTab('new'); setCreationStep('selection'); }}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'new' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              New Campaign
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              History
          </button>
      </div>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'new' && (creationStep === 'selection' ? renderSelection() : renderConfiguration())}
      {activeTab === 'history' && renderHistory()}
    </div>
  );
};

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
