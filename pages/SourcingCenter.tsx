
import React, { useState, useEffect } from 'react';
import { Search, Globe, Github, Linkedin, Twitter, Zap, Filter, CheckCircle2, AlertCircle, Loader2, ExternalLink, ArrowRight, Sparkles, Radar, UserCheck, Activity, Target } from 'lucide-react';
import { JobCriteria, SourcingProfile, Candidate, AnalysisStatus } from '../types';

interface SourcingCenterProps {
  jobs: JobCriteria[];
  onAddCandidate: (candidate: Candidate) => void;
}

const MOCK_SOURCING_PROFILES: SourcingProfile[] = [
  { id: 's1', name: 'Alex Rivera', headline: 'Senior React Architect | ex-Meta', location: 'San Francisco, CA', platform: 'LinkedIn', skills: ['React', 'Next.js', 'System Design'], isOpenToWork: true, profileUrl: 'https://linkedin.com/in/alex-r', lastUpdated: '2 days ago' },
  { id: 's2', name: 'Samantha Lee', headline: 'Fullstack Engineer | Open Source Contributor', location: 'London, UK', platform: 'GitHub', skills: ['TypeScript', 'Node.js', 'PostgreSQL'], isOpenToWork: true, profileUrl: 'https://github.com/slee-dev', lastUpdated: 'Today' },
  { id: 's3', name: 'Marcus Thorne', headline: 'Frontend Lead @ Fintech Innovations', location: 'New York, NY', platform: 'LinkedIn', skills: ['React', 'Redux', 'Tailwind'], isOpenToWork: false, profileUrl: 'https://linkedin.com/in/mthorne', lastUpdated: '1 week ago' },
  { id: 's4', name: 'Elena Petrova', headline: 'UI/UX Engineering Specialist', location: 'Berlin, DE', platform: 'Twitter', skills: ['Figma', 'React', 'Animation'], isOpenToWork: true, profileUrl: 'https://twitter.com/elena_ui', lastUpdated: '3h ago' },
];

export const SourcingCenter: React.FC<SourcingCenterProps> = ({ jobs, onAddCandidate }) => {
  const [selectedJobId, setSelectedJobId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<SourcingProfile[]>([]);

  const handleStartScan = () => {
    if (!selectedJobId) return;
    setIsScanning(true);
    setScanProgress(0);
    setResults([]);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResults(MOCK_SOURCING_PROFILES);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleImport = (profile: SourcingProfile) => {
    const newCand: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: profile.name,
      email: `${profile.name.toLowerCase().replace(' ', '.')}@sourced.com`,
      fileName: `Social Profile: ${profile.platform}`,
      resumeText: `Automatic Profile Extraction from ${profile.platform}. Headline: ${profile.headline}. Skills: ${profile.skills.join(', ')}.`,
      uploadDate: new Date().toISOString(),
      jobId: selectedJobId,
      status: AnalysisStatus.PENDING,
      source: 'SOURCING',
      profileUrl: profile.profileUrl,
      isOpenToWork: profile.isOpenToWork
    };
    onAddCandidate(newCand);
    alert(`${profile.name} imported to active analysis queue!`);
  };

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Talent Pulse Radar</h1>
          <p className="text-gray-500 mt-2">Autonomous scanning engine monitoring 50+ professional networks.</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Target size={150} className="text-brand-600" />
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-end relative z-10">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Sourcing Target Profile</label>
            <div className="relative">
                <select 
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-500 bg-white text-gray-900 font-bold appearance-none"
                >
                <option value="">Select a job profile to begin pulse scan...</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ArrowRight size={18} />
                </div>
            </div>
          </div>
          <button 
            onClick={handleStartScan}
            disabled={isScanning || !selectedJobId}
            className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-gray-400/20 active:scale-95"
          >
            {isScanning ? <Loader2 className="animate-spin" size={20} /> : <Radar size={20} />}
            {isScanning ? `Pulse Active... ${scanProgress}%` : 'Engage Global Pulse'}
          </button>
        </div>
      </div>

      {/* Sourcing Radar Visualization (If scanning) */}
      {isScanning && (
        <div className="bg-gray-900 rounded-[3rem] p-20 text-center overflow-hidden relative min-h-[500px] flex flex-col items-center justify-center border border-gray-800 shadow-2xl animate-fade-in">
            <div className="absolute inset-0">
                {/* Simulated Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] animate-pulse"></div>
            </div>
            <div className="relative z-10">
                <div className="relative mb-12">
                    <div className="w-32 h-32 border-4 border-brand-500/20 rounded-full flex items-center justify-center mx-auto animate-ping"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 border-4 border-brand-500 rounded-full flex items-center justify-center bg-gray-900 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                            <Activity size={48} className="text-brand-400" />
                         </div>
                    </div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4">Engaging Platform Spidering...</h3>
                <p className="text-brand-300 text-lg max-w-md mx-auto mb-10 leading-relaxed">Checking LinkedIn, GitHub, and Dribbble for live candidates matching your requirements.</p>
                <div className="w-80 bg-gray-800 h-3 rounded-full mx-auto overflow-hidden border border-gray-700 shadow-inner">
                    <div className="bg-brand-500 h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                </div>
            </div>
        </div>
      )}

      {/* Results Leaderboard */}
      {!isScanning && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          {results.map(profile => (
            <div key={profile.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${profile.platform === 'LinkedIn' ? 'bg-blue-50 text-blue-600' : profile.platform === 'GitHub' ? 'bg-gray-100 text-gray-900' : 'bg-brand-50 text-brand-600'}`}>
                    {profile.platform === 'LinkedIn' && <Linkedin size={24} />}
                    {profile.platform === 'GitHub' && <Github size={24} />}
                    {profile.platform === 'Twitter' && <Twitter size={24} />}
                    {profile.platform === 'Portfolio' && <Globe size={24} />}
                  </div>
                  {profile.isOpenToWork && (
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-green-200">
                      Open to Work
                    </span>
                  )}
                </div>
                <h3 className="font-black text-gray-900 text-xl group-hover:text-brand-600 transition-colors mb-2">{profile.name}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2 font-medium">{profile.headline}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.skills.map(s => (
                    <span key={s} className="bg-gray-50 text-gray-600 text-[10px] px-3 py-1 rounded-lg border border-gray-200 font-bold uppercase tracking-wider">{s}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest border-t border-gray-50 pt-6">
                   <span>{profile.lastUpdated}</span>
                   <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                   <span className="truncate">{profile.location}</span>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex gap-3">
                <a 
                  href={profile.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-xs font-black text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 text-center flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  Visit <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => handleImport(profile)}
                  className="flex-1 py-3 text-xs font-black text-white bg-gray-900 rounded-xl hover:bg-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-gray-400/20"
                >
                  <UserCheck size={14} /> Import
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results state - Expanded elaboration */}
      {!isScanning && results.length === 0 && (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-300">
                  <Search size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">Start a Pulse Scan</h3>
              <p className="text-gray-500 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                  Select an active job profile above to begin the autonomous sourcing process. Our AI will search across major professional platforms to find candidates who are not actively applying but are open to new opportunities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-8">
                  <SourceDetail icon={<Linkedin className="text-blue-600" />} title="Social Signals" desc="Scans profiles for 'Open to Work' markers and headline updates." />
                  <SourceDetail icon={<Github className="text-gray-900" />} title="Skill Pulse" desc="Monitors recent commits and library expertise on GitHub/StackOverflow." />
                  <SourceDetail icon={<Globe className="text-brand-600" />} title="Global Reach" desc="Includes personal portfolios, blogs, and secondary professional nodes." />
              </div>
          </div>
      )}
    </div>
  );
};

const SourceDetail = ({ icon, title, desc }: any) => (
    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">{icon}</div>
        <h4 className="font-black text-gray-900 text-sm mb-2">{title}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
);
