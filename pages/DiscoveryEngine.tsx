
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radar, Linkedin, Github, Globe, 
  ArrowRight, Activity, Cpu, 
  Brain, Briefcase, Mail, Menu, X, Twitter,
  Zap, Layers, MessageSquare, Target, CheckCircle2,
  Rocket, Search, ShieldCheck, Sparkles, Terminal,
  BarChart3, Users, ChevronRight, Play
} from 'lucide-react';

export const DiscoveryEngine: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Smart Header Scroll Logic
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle the interaction logic for "Hybrid Architecture" section
  useEffect(() => {
    if (isHovered) {
      // Start the rotation timer (5 seconds per tab)
      timerRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % 3);
        setProgress(0); // Reset progress on tab change
      }, 5000);

      // Visual progress bar update
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 2; // ~50 steps for 5 seconds (100ms interval)
        });
      }, 100);
    } else {
      // Stop everything when mouse leaves
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setActiveTab(0); // "if mouse slide there it from start there"
    setProgress(0);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      {/* Global Public Navbar - Fixed with Smart Reveal Logic */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md transition-all duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 group">
              <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:rotate-12 transition-transform">RP</div>
              <span className="tracking-tighter font-black text-gray-900">AI RecruitPro</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/how-it-works" className="text-sm font-black text-brand-600 transition-colors">How it Works</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
              <Link to="/downloads" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-900 font-semibold text-sm hover:text-brand-600 transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95">
                Start Trial
              </Link>
            </div>

            <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full animate-in slide-in-from-top-2">
                <Link to="/how-it-works" className="block text-brand-600 font-bold">How it Works</Link>
                <Link to="/pricing" className="block text-gray-600 font-medium">Pricing</Link>
                <Link to="/downloads" className="block text-gray-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-gray-600 font-medium">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/login" className="block text-center text-gray-900 font-bold py-2 border border-gray-200 rounded-lg">Sign In</Link>
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg shadow-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section - Proper padding for fixed header */}
      <header className="relative pt-48 pb-24 lg:py-32 lg:pt-56 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 animate-fade-in">
                <Radar size={14} className="animate-pulse" /> The Autonomous Intelligence Engine
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tight">
                Recruitment, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">on Autopilot.</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mb-10 font-medium">
                Traditional recruiting is reactive and manual. RecruitPro is a proactive ecosystem that monitors the web, extracts talent signatures, and conducts interviews autonomously.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                 <Link to="/signup" className="bg-brand-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-brand-700 transition-all shadow-2xl shadow-brand-500/30 hover:scale-105 active:scale-95">
                    Launch Your Pilot <ArrowRight size={20} />
                 </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-lg relative animate-float">
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Cpu size={180} className="text-brand-400 group-hover:rotate-45 transition-transform duration-1000" />
                    </div>
                    <h3 className="font-black text-2xl text-white mb-8 border-b border-white/10 pb-4">Live Discovery Engine</h3>
                    <div className="space-y-6">
                        <LiveNode site="LinkedIn" signal="#OpenToWork" status="Processing" progress={85} />
                        <LiveNode site="GitHub" signal="Native-isHireable" status="Active" progress={40} />
                        <LiveNode site="Wellfound" signal="Market Ready" status="Waiting" progress={10} />
                    </div>
                    <div className="mt-12 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-1"><Activity size={12} className="text-brand-400" /> System: Stable</span>
                        <span>v4.2 Enterprise Core</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workflow Journey */}
      <section id="workflow" className="py-32 relative bg-white">
        {/* Background Vertical Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-100 to-transparent hidden lg:block"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-32 relative">
             <span className="text-brand-600 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">The 5-Phase Lifecycle</span>
             <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">The Journey from <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Signal to Hire.</span></h2>
          </div>

          <div className="space-y-32">
            {/* Phase 1 */}
            <WorkflowPhase 
                number="01"
                title="Deep Pulse Sourcing"
                subtitle="THE GLOBAL RADAR"
                desc="Our autonomous agents don't just 'search'; they listen. We monitor 50+ platforms for availability markers, headline updates, and 'is-hireable' signals that standard search tools miss."
                icon={<Radar className="text-brand-600" size={32} />}
                direction="left"
                stats={{ label: "Sourcing Depth", value: "50+ Networks" }}
            />

            {/* Phase 2 */}
            <WorkflowPhase 
                number="02"
                title="Neural Signature Extraction"
                subtitle="DATA NORMALIZATION"
                desc="Messy profiles are converted into standardized Neural Signatures. We extract verified skills, technical depth from code commits, and project impact into a high-fidelity data block."
                icon={<Layers className="text-purple-600" size={32} />}
                direction="right"
                stats={{ label: "Processing Speed", value: "1.2ms/page" }}
            />

            {/* Phase 3 */}
            <WorkflowPhase 
                number="03"
                title="Gemini Reasoning Scoring"
                subtitle="ADVANCED RANKING"
                desc="Candidates are scored using the Gemini 3 Pro engine. We apply your custom importance weights to evaluate depth, cultural fit, and potential—moving beyond simple keyword matching."
                icon={<Brain className="text-indigo-600" size={32} />}
                direction="left"
                stats={{ label: "Scoring Accuracy", value: "99.2%" }}
            />

            {/* Phase 4 */}
            <WorkflowPhase 
                number="04"
                title="Autonomous AI Interview"
                subtitle="SCALABLE SCREENING"
                desc="Top matches are invited to a real-time AI Interview Room. Our bot conducts voice/text sessions, transcribes answers, and detects sentiment to provide a full behavioral assessment."
                icon={<MessageSquare className="text-orange-600" size={32} />}
                direction="right"
                stats={{ label: "Time Saved", value: "85% / hire" }}
            />

            {/* Phase 5 */}
            <WorkflowPhase 
                number="05"
                title="Collaborative Placement"
                subtitle="HUMAN FINAL DECISION"
                desc="The results are delivered to your dashboard in a clean ranking. Review the AI transcripts, comparison charts, and contact details to make the final hire with 100% confidence."
                icon={<CheckCircle2 className="text-green-600" size={32} />}
                direction="left"
                stats={{ label: "Retention Rate", value: "4.2x Industry Avg" }}
            />
          </div>
        </div>
      </section>

      {/* Performance Technical Section - Interactive Hover Logic */}
      <section 
        className="py-32 bg-gray-50 border-y border-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xs font-black text-brand-600 uppercase tracking-widest">Under the Hood</h2>
                        {isHovered ? (
                             <span className="flex items-center gap-1.5 bg-brand-100 text-brand-700 px-2 py-0.5 rounded text-[9px] font-black uppercase animate-pulse">
                                <Activity size={10} /> Auto-Scan Active
                             </span>
                        ) : (
                             <span className="flex items-center gap-1.5 bg-gray-200 text-gray-500 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                                <Activity size={10} /> Hover to Explore
                             </span>
                        )}
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 mb-8 leading-tight">Hybrid Architecture: <br/>Local Power, Cloud Brain.</h3>
                    
                    <div className="space-y-2">
                        <TechnicalTab 
                            active={activeTab === 0} 
                            progress={activeTab === 0 ? progress : 0}
                            title="Native GPU Core" 
                            desc="The RecruitPro Desktop bridge uses your local hardware to scan 5,000+ resumes locally, ensuring total PII privacy."
                            onClick={() => { setActiveTab(0); setProgress(0); }}
                        />
                        <TechnicalTab 
                            active={activeTab === 1} 
                            progress={activeTab === 1 ? progress : 0}
                            title="Gemini 3 Pro Pipeline" 
                            desc="We leverage the latest 1M+ context window to analyze complete professional histories against 200-page job specs."
                            onClick={() => { setActiveTab(1); setProgress(0); }}
                        />
                        <TechnicalTab 
                            active={activeTab === 2} 
                            progress={activeTab === 2 ? progress : 0}
                            title="Real-time Webhook Sync" 
                            desc="Instantly push sourcing signals to Lever, Greenhouse, or Workday via our low-latency API infrastructure."
                            onClick={() => { setActiveTab(2); setProgress(0); }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[400px] flex flex-col justify-center animate-fade-in" key={activeTab}>
                        {activeTab === 0 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"><Cpu size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900">Zero-Cloud Privacy</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">By processing PII locally, we bypass the need for GDPR-heavy cloud storage of sensitive candidate documents. Only anonymized ranking data ever touches our servers.</p>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Local Latency</p>
                                        <p className="text-xl font-black text-gray-900">~1.2ms</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Encryption</p>
                                        <p className="text-xl font-black text-gray-900">AES-256</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"><Brain size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900">Reasoning-Based Fit</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">Traditional parsers miss nuance. Gemini 3 Pro understands 'Leadership' isn't just a word, but a pattern of ownership, team growth, and project delivery found across a decade of experience.</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-brand-500 text-white rounded-lg text-xs font-bold uppercase tracking-widest">99% Placement Match</span>
                                </div>
                            </div>
                        )}
                        {activeTab === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600"><Terminal size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900">API First Ecosystem</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">RecruitPro fits into your existing stack. Use our 'Campaign API' to trigger outreach from your internal tools or custom hiring platforms.</p>
                                <div className="bg-gray-900 p-4 rounded-xl font-mono text-[10px] text-brand-400 border border-gray-800">
                                    <code>POST /v1/source/trigger_pulse</code><br/>
                                    <code>{'{'} "jobId": "sr_eng_01", "pool": "global" {'}'}</code>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Global Public Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
                  <div className="md:col-span-2">
                      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 mb-6 group">
                        <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:rotate-12 transition-transform">RP</div>
                        <span className="font-black text-gray-900">AI RecruitPro</span>
                      </Link>
                      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
                          The world's first autonomous recruitment ecosystem. Empowering HR teams with real-time talent signals and native-speed resume intelligence.
                      </p>
                      <div className="flex gap-4">
                          <SocialIcon icon={<Linkedin size={18}/>} />
                          <SocialIcon icon={<Twitter size={18}/>} />
                          <SocialIcon icon={<Github size={18}/>} />
                          <SocialIcon icon={<Globe size={18}/>} />
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">How it Works</Link></li>
                          <li><Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing Models</Link></li>
                          <li><Link to="/downloads" className="hover:text-brand-600 transition-colors">Desktop Tools</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><Link to="/contact" className="hover:text-brand-600 transition-colors">Contact Us</Link></li>
                          <li><Link to="/signup" className="hover:text-brand-600 transition-colors">Get Started</Link></li>
                          <li><Link to="/login" className="hover:text-brand-600 transition-colors">Sign In</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-medium">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">Discovery Engine</Link></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Security Audit</a></li>
                      </ul>
                  </div>
              </div>
              <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-gray-400 text-sm font-medium">© 2026 AI RecruitPro Inc. All rights reserved.</p>
                  <div className="flex gap-8 text-sm text-gray-400 font-medium">
                      <a href="#" className="hover:text-gray-900 transition-colors">System Status</a>
                      <a href="#" className="hover:text-gray-900 transition-colors">Global Support</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

// Sub-components for better organization

const LiveNode = ({ site, signal, status, progress }: any) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
                {site === 'LinkedIn' && <Linkedin size={14} className="text-blue-400" />}
                {site === 'GitHub' && <Github size={14} className="text-gray-400" />}
                {site === 'Wellfound' && <Globe size={14} className="text-green-400" />}
                <span className="text-white">{site}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-tighter ${status === 'Processing' ? 'bg-brand-500/20 text-brand-400 animate-pulse' : 'bg-white/5 text-gray-400'}`}>
                {status}
            </span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500/60 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{signal}</p>
    </div>
);

const WorkflowPhase = ({ number, title, subtitle, desc, icon, direction, stats }: any) => (
    <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${direction === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        <div className="flex-1 space-y-6 text-center lg:text-left animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="inline-flex flex-col">
                <span className="text-brand-600 font-black text-6xl opacity-10 mb-[-2rem] select-none">{number}</span>
                <span className="text-brand-600 font-black text-[10px] uppercase tracking-[0.3em] pl-4">{subtitle}</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900">{title}</h3>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">{desc}</p>
            
            <div className="inline-block p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stats.label}</p>
                <p className="text-2xl font-black text-gray-900">{stats.value}</p>
            </div>
        </div>
        
        <div className="flex-shrink-0 relative group">
            <div className="w-32 h-32 lg:w-48 lg:h-48 bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] flex items-center justify-center relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-brand-200">
                {icon}
            </div>
            <div className="absolute inset-0 bg-brand-100 rounded-[2.5rem] blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity"></div>
            {/* Connector dots */}
            <div className="hidden lg:block absolute top-1/2 left-full w-20 h-px border-t border-dashed border-gray-300 -translate-y-1/2 group-hover:border-brand-400 transition-colors"></div>
        </div>
        
        <div className="flex-1 hidden lg:block"></div>
    </div>
);

const TechnicalTab = ({ active, progress, title, desc, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${active ? 'bg-white border-brand-200 shadow-xl scale-[1.02]' : 'bg-transparent border-transparent opacity-60 hover:opacity-100'}`}
    >
        <div className="relative z-10">
            <h4 className={`font-black text-lg mb-2 ${active ? 'text-brand-600' : 'text-gray-900'}`}>{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-2">{desc}</p>
        </div>
        {active && (
            <div className="absolute bottom-0 left-0 h-1 bg-brand-500 transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
        )}
    </button>
);

const SocialIcon = ({ icon }: any) => (
    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-brand-600 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95">
        {icon}
    </div>
);
