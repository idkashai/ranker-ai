
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, MessageSquare, 
  UploadCloud, Rocket, Menu, X, Mail, Radar, 
  Globe, Linkedin, Github, Twitter, Layers, ShieldCheck, 
  Cpu, Activity, Search, Brain, 
  ChevronLeft, ChevronRight, Play, Briefcase, Bot, Send, Trash2, ShieldAlert,
  Star, CheckCircle2, Terminal, Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const Landing: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoSlideRef = useRef<any>(null);
  const progressRef = useRef<any>(null);

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

  // Procedure Section Visibility State
  const [isProcedureVisible, setIsProcedureVisible] = useState(false);
  const procedureSectionRef = useRef<HTMLElement>(null);

  // Spotlight State for Pro Features
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);
  const [isSpotlightHovered, setIsSpotlightHovered] = useState(false);
  const spotlightSectionRef = useRef<HTMLElement>(null);
  const spotlightTimerRef = useRef<any>(null);

  // Floating Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>(() => {
    const saved = localStorage.getItem('recruitpro_landing_chat');
    return saved ? JSON.parse(saved) : [
      { role: 'bot', text: "Hello! I'm the RecruitPro Assistant. How can I help you explore our recruitment platform today?" }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('recruitpro_landing_chat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are the Official AI RecruitPro Landing Page Assistant.
        
        STRICT OPERATIONAL LIMITS:
        1. Only answer about AI RecruitPro (pricing, features like radar, bulk resume analysis, AI interviews, Lahore location, etc.).
        2. DO NOT write code, solve general technical problems, or provide generic AI tasks.
        3. If asked for code or non-site help, YOU MUST REFUSE with: "I apologize, but I am a specialized assistant for AI RecruitPro inquiries only. I am not authorized to perform general AI tasks. Please ask me about our recruitment platform!"
        
        RecruitPro Context:
        - Email: kashiflearnai@gmail.com
        - Office: Block C, Phase 1 Johar Town, Lahore, Pakistan
        - Core Services: Autonomous sourcing radar, AI-led interviews, native-speed resume scoring.
        - Pricing: Credit-based. 1 Credit = 20+ Analyses. $10 = 50 Credits. Starter is free (5 credits).
        
        User Inquiry: ${userMsg}`,
      });

      const botResponse = response.text || "I'm having trouble connecting. Feel free to reach out via our Contact page!";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again or visit our Contact page." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const procedureSteps = [
    {
      title: "Global Radar Scan",
      desc: "Our AI agents crawl 50+ professional networks including LinkedIn, Wellfound, Indeed, and GitHub for live hiring signals.",
      icon: <Radar size={28} />,
      color: "bg-blue-600",
      shadow: "shadow-blue-500/40",
      accent: "text-blue-600"
    },
    {
      title: "Neural Extraction",
      desc: "Raw profiles are converted into identity signatures, extracting verified skills and technical depth from commits and portfolios.",
      icon: <Cpu size={28} />,
      color: "bg-indigo-600",
      shadow: "shadow-indigo-500/40",
      accent: "text-indigo-600"
    },
    {
      title: "Gemini Analysis",
      desc: "Candidates are scored against multi-weighted job criteria using advanced Gemini 3 Pro reasoning models.",
      icon: <Brain size={28} />,
      color: "bg-purple-600",
      shadow: "shadow-purple-500/40",
      accent: "text-purple-600"
    },
    {
      title: "Autonomous Outreach",
      desc: "System triggers personalized engagement and schedules AI-conducted interviews with top 1% matches.",
      icon: <Rocket size={28} />,
      color: "bg-brand-600",
      shadow: "shadow-brand-500/40",
      accent: "text-brand-600"
    }
  ];

  const proFeatures = [
    {
      title: "0-Sec Analysis",
      subtitle: "NATIVE GPU CORE",
      desc: "Our local-processing engine analyzes 1,000+ resumes in seconds using native GPU acceleration. Zero-Cloud privacy, maximum throughput.",
      icon: <Zap size={48} className="text-yellow-400" />,
      stats: "1.2ms / page",
      pill: "High Performance",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      title: "AI Interview Room",
      subtitle: "REAL-TIME AGENTS",
      desc: "Candidates interact with a real-time AI interviewer. Results are transcribed, scored, and sentiments analyzed immediately in your dashboard.",
      icon: <MessageSquare size={48} className="text-brand-400" />,
      stats: "24/7 Availability",
      pill: "Autonomous HR",
      gradient: "from-brand-400 to-indigo-500"
    },
    {
      title: "Bulk Intelligence",
      subtitle: "LEGACY MIGRATION",
      desc: "Upload legacy resume databases and watch as AI organizes, scores, and updates every entry with fresh market signals.",
      icon: <UploadCloud size={48} className="text-purple-400" />,
      stats: "1M+ Profiles",
      pill: "Enterprise Scale",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % procedureSteps.length);
    setProgress(0);
  };

  const prevStep = () => {
    setActiveStep((prev) => (prev - 1 + procedureSteps.length) % procedureSteps.length);
    setProgress(0);
  };

  // PROCEDURE SECTION OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProcedureVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (procedureSectionRef.current) observer.observe(procedureSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Procedure Auto-Rotation Logic (3s speed, starts when visible, pauses on hover)
  useEffect(() => {
    if (!isPaused && isProcedureVisible) {
      autoSlideRef.current = setInterval(nextStep, 3000); 
      progressRef.current = setInterval(() => {
        setProgress(prev => {
           if(prev >= 100) return 0;
           return prev + 3.33; // 100 / 30 iterations (assuming 100ms interval)
        });
      }, 100);
    }
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, activeStep, isProcedureVisible]);

  // PRO FEATURES SPOTLIGHT OBSERVER
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSpotlightVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    if (spotlightSectionRef.current) observer.observe(spotlightSectionRef.current);
    return () => observer.disconnect();
  }, []);

  const resetSpotlightTimer = () => {
    if (spotlightTimerRef.current) clearInterval(spotlightTimerRef.current);
    if (isSpotlightVisible && !isSpotlightHovered) {
      spotlightTimerRef.current = setInterval(() => {
        setActiveSpotlight(prev => (prev + 1) % proFeatures.length);
      }, 3000); 
    }
  };

  useEffect(() => {
    resetSpotlightTimer();
    return () => {
      if (spotlightTimerRef.current) clearInterval(spotlightTimerRef.current);
    };
  }, [isSpotlightVisible, isSpotlightHovered]);

  const handleSpotlightClick = (index: number) => {
    setActiveSpotlight(index);
    resetSpotlightTimer();
  };

  const talentSources = [
    { name: "LinkedIn", icon: <Linkedin size={24} /> },
    { name: "GitHub", icon: <Github size={24} /> },
    { name: "Indeed", icon: <Briefcase size={24} /> },
    { name: "Wellfound", icon: <Globe size={24} /> },
    { name: "Dribbble", icon: <Layers size={24} /> },
    { name: "Behance", icon: <Search size={24} /> },
    { name: "StackOverflow", icon: <Activity size={24} /> },
    { name: "Twitter X", icon: <Twitter size={24} /> },
    { name: "Upwork", icon: <Mail size={24} /> },
    { name: "Glassdoor", icon: <ShieldCheck size={24} /> },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans overflow-x-hidden text-gray-900">
      {/* Global Public Navbar - Fixed with Smart Reveal Logic */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md transition-all duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 group">
              <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform ring-4 ring-brand-50">RP</div>
              <span className="tracking-tighter font-black text-gray-900">AI RecruitPro</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">How it Works</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
              <Link to="/downloads" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-900 font-semibold text-sm hover:text-brand-600 transition-colors px-4">Sign In</Link>
              <Link to="/signup" className="bg-brand-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95">
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
                <Link to="/how-it-works" className="block text-gray-600 font-medium">How it Works</Link>
                <Link to="/pricing" className="block text-gray-600 font-medium">Pricing</Link>
                <Link to="/downloads" className="block text-gray-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-gray-600 font-medium">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/login" className="block text-center text-gray-900 font-bold py-2 border border-gray-200 rounded-lg">Sign In</Link>
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section - Proper padding for fixed header */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-brand-100 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-widest">
            <Cpu size={14} className="animate-spin-slow" /> Autonomous Talent Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-none">
            Hire the Invisible <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Top 1% Talent.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            AI RecruitPro is the world's most advanced autonomous sourcing ecosystem. We map signals from <strong className="text-gray-900">#OpenToWork</strong> to <strong className="text-gray-900">isHireable</strong> across the web.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup"
              className="bg-brand-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-brand-500/30 hover:scale-105"
            >
              Launch Your Pilot <ArrowRight size={20} />
            </Link>
            <Link 
              to="/how-it-works"
              className="bg-white text-gray-700 border border-gray-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              View Engine Details <Play size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Logo Slider Section - Talent Sources */}
      <section className="py-16 border-y border-gray-100 bg-gray-50/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-10">
           <div className="flex flex-col items-center">
             <p className="text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Autonomous Talent Mapping Sources</p>
             <div className="h-1 w-12 bg-brand-200 rounded-full"></div>
           </div>
        </div>
        <div className="flex overflow-hidden whitespace-nowrap group">
          <div className="flex animate-scroll items-center py-4">
            {[...talentSources, ...talentSources].map((source, i) => (
              <div key={i} className="flex items-center gap-3 px-12 md:px-20 group/logo cursor-pointer opacity-40 hover:opacity-100 transition-all duration-300">
                 <div className="text-gray-900 group-hover/logo:text-brand-600 transition-colors transform group-hover/logo:scale-110 duration-500">
                    {source.icon}
                 </div>
                 <span className="text-2xl md:text-3xl font-black text-gray-900 hover:text-brand-600 transition-colors select-none tracking-tighter uppercase">{source.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* Global Talent Pulse Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="order-2 lg:order-1">
                      <div className="relative aspect-square max-w-md mx-auto">
                          <div className="absolute inset-0 rounded-full border border-brand-500/20 animate-ping"></div>
                          <div className="absolute inset-4 rounded-full border border-brand-500/30 animate-pulse"></div>
                          <div className="absolute inset-12 rounded-full border border-brand-500/40"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <Radar size={120} className="text-brand-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                          </div>
                          <TalentNode pos="top-10 left-1/2" icon={<Linkedin size={14}/>} name="#OpenToWork" delay="0s"/>
                          <TalentNode pos="bottom-20 left-10" icon={<Github size={14}/>} name="isHireable" delay="1s"/>
                          <TalentNode pos="top-1/2 right-0" icon={<Twitter size={14}/>} name="Passive-Open" delay="2s"/>
                          <TalentNode pos="bottom-10 right-20" icon={<Globe size={14}/>} name="Global Pulse" delay="1.5s"/>
                      </div>
                  </div>
                  <div className="order-1 lg:order-2 text-white">
                      <h2 className="text-brand-400 font-bold uppercase tracking-[0.2em] text-sm mb-4">The Global Talent Pulse</h2>
                      <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Proactive Talent <br/>Discovery Engine</h3>
                      <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                          Our proprietary AI "Pulse" monitors 50+ platforms. We map fragmented availability signals into standardized system statuses for your pipeline.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                          <SignalMapCard platform="LinkedIn" signal="#OpenToWork" status="Active" icon={<Linkedin size={16} />} />
                          <SignalMapCard platform="Wellfound" signal="Ready to Interview" status="Active" icon={<Briefcase size={16} />} />
                          <SignalMapCard platform="Indeed" signal="Immediate Start" status="Urgent" icon={<Mail size={16} />} />
                          <SignalMapCard platform="GitHub" signal="isHireable" status="Passive-Open" icon={<Github size={16} />} />
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <Link to="/how-it-works" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20">
                            Learn How It Works <ArrowRight size={18} />
                        </Link>
                        <Link to="/signup" className="border border-brand-500/50 text-brand-400 px-8 py-3 rounded-xl font-bold hover:bg-brand-500/10 transition-all">
                            Live Demo
                        </Link>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Interactive Procedure Slider - The Future of Recruitment is Autonomous */}
      <section ref={procedureSectionRef} id="features" className="pt-24 pb-8 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-brand-600 font-bold tracking-widest uppercase text-xs mb-3">Enterprise Capabilities</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">The Future of Recruitment is Autonomous.</h3>
              
              <div 
                className="mb-12 relative max-w-6xl mx-auto"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                  <div className="relative pt-12 pb-16">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 rounded-full overflow-hidden hidden md:block">
                        <div 
                          className="h-full bg-brand-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
                          style={{ width: `${((activeStep + 1) / procedureSteps.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {procedureSteps.map((step, idx) => (
                            <div 
                                key={idx}
                                onClick={() => { setActiveStep(idx); setProgress(0); }}
                                className={`
                                    relative p-10 rounded-[3rem] transition-all duration-500 cursor-pointer border-2 flex flex-col items-center text-center
                                    ${activeStep === idx 
                                        ? 'bg-white border-brand-500 shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] scale-105 z-20' 
                                        : 'bg-gray-50/50 border-transparent opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}
                                `}
                            >
                                <div className={`
                                    w-24 h-24 rounded-[2.2rem] flex items-center justify-center transition-all duration-700 mb-10
                                    ${activeStep === idx 
                                        ? `${step.color} text-white shadow-2xl ${step.shadow} rotate-0` 
                                        : 'bg-white border border-gray-200 text-gray-400 rotate-6'}
                                `}>
                                    {step.icon}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 transition-colors duration-500 ${activeStep === idx ? 'bg-brand-50 text-brand-600' : 'bg-gray-200 text-gray-500'}`}>
                                    Stage {idx + 1}
                                </div>
                                <h4 className={`text-xl font-black transition-colors duration-500 mb-4 ${activeStep === idx ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.title}
                                </h4>
                                <div className={`min-h-[80px] transition-all duration-500 overflow-hidden ${activeStep === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <p className="text-sm leading-relaxed text-gray-500 font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                                {activeStep === idx && isProcedureVisible && (
                                    <div className="mt-8 w-full">
                                        <div className="h-1 bg-gray-100 w-full rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-brand-600 transition-all duration-100" 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-4">
                      {procedureSteps.map((_, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => { setActiveStep(idx); setProgress(0); }}
                            className={`h-2 rounded-full transition-all duration-500 ${activeStep === idx ? 'w-16 bg-brand-600' : 'w-4 bg-gray-200 hover:bg-brand-200'}`}
                          />
                      ))}
                  </div>

                  <div className="mt-12 flex items-center justify-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.5em]">
                      {isPaused ? <div className="flex items-center gap-2"><X size={12} className="text-red-500" /> Manual Control</div> : <div className="flex items-center gap-2"><Activity size={12} className="text-brand-500 animate-pulse" /> Autonomous Cycle</div>}
                  </div>
              </div>
          </div>
      </section>

      {/* Discovery Link Section - Tightened spacing */}
      <section className="py-8 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex justify-center mb-16">
                <Link to="/how-it-works" className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-2xl shadow-gray-400/20 active:scale-95">
                    Explore Autonomous Workflow <ArrowRight size={20} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <FeatureDetail icon={<Sparkles className="text-brand-600" />} title="Neural Scoring" desc="Every profile is graded by Gemini 3 Pro's deep reasoning engine for 99% placement accuracy." />
                  <FeatureDetail icon={<Terminal className="text-purple-600" />} title="API Integration" desc="Seamlessly push sourcing signals to your existing ATS or internal hiring workflows." />
                  <FeatureDetail icon={<CheckCircle2 className="text-indigo-600" />} title="Verified Talent" desc="Our 'Commit Pulse' verifies technical claims against public code repositories automatically." />
              </div>
          </div>
      </section>

      {/* PRO FEATURES SPOTLIGHT - High-Velocity Recruitment */}
      <section 
        ref={spotlightSectionRef} 
        className="pt-8 pb-32 bg-gray-900 relative overflow-hidden"
        onMouseEnter={() => setIsSpotlightHovered(true)}
        onMouseLeave={() => setIsSpotlightHovered(false)}
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 bg-${activeSpotlight === 0 ? 'yellow' : activeSpotlight === 1 ? 'brand' : 'purple'}-500`}></div>
            <div className={`absolute bottom-1/4 -right-20 w-96 h-96 rounded-full blur-[120px] transition-colors duration-1000 bg-${activeSpotlight === 2 ? 'purple' : activeSpotlight === 1 ? 'indigo' : 'yellow'}-500`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                Pro Enterprise Ecosystem
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">High-Velocity <br/>Recruitment.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Nav & Controls */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {proFeatures.map((feat, i) => (
                <button 
                  key={i}
                  onClick={() => handleSpotlightClick(i)}
                  className={`group relative p-8 rounded-[2rem] border transition-all duration-500 text-left overflow-hidden ${activeSpotlight === i ? 'bg-white/10 border-white/20 shadow-2xl scale-105' : 'bg-transparent border-transparent opacity-40 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${activeSpotlight === i ? 'bg-white text-gray-900 shadow-lg' : 'bg-white/10 text-white'}`}>
                       {React.cloneElement(feat.icon as React.ReactElement, { size: 24, className: '' })}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg group-hover:text-brand-400 transition-colors">{feat.title}</h4>
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{feat.subtitle}</p>
                    </div>
                  </div>
                  {activeSpotlight === i && isSpotlightVisible && !isSpotlightHovered && (
                    <div className="absolute bottom-0 left-0 h-1 bg-brand-500 animate-progress-glow" style={{ width: '100%' }}></div>
                  )}
                  {activeSpotlight === i && isSpotlightHovered && (
                    <div className="absolute bottom-0 left-0 h-1 bg-gray-500/50" style={{ width: '100%' }}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Display Area */}
            <div className="lg:col-span-8">
              <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 backdrop-blur-xl relative overflow-hidden group min-h-[500px] flex flex-col justify-center shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                  {proFeatures[activeSpotlight].icon}
                </div>
                
                <div className="relative z-10 animate-in fade-in slide-in-from-right-10 duration-500" key={activeSpotlight}>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[10px] font-black uppercase tracking-widest mb-8">
                    {proFeatures[activeSpotlight].pill}
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
                    {proFeatures[activeSpotlight].title}
                  </h3>
                  <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl font-medium">
                    {proFeatures[activeSpotlight].desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Performance Bench</span>
                      <span className="text-3xl font-black text-white flex items-center gap-2">
                        {proFeatures[activeSpotlight].stats} <Activity size={20} className="text-brand-500" />
                      </span>
                    </div>
                    <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Trust Score</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-yellow-500 text-yellow-500" />)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 flex gap-4">
                    <Link to="/signup" className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-brand-50 transition-all flex items-center gap-2 shadow-xl active:scale-95">
                      Activate Feature <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
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
                          <SocialIcon icon={<Linkedin size={18}/>} href="https://linkedin.com" />
                          <SocialIcon icon={<Twitter size={18}/>} href="https://twitter.com" />
                          <SocialIcon icon={<Github size={18}/>} href="https://github.com" />
                          <SocialIcon icon={<Globe size={18}/>} href="https://recruitpro.ai" />
                      </div>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">How it Works</Link></li>
                          <li><Link to="/pricing" className="hover:text-brand-600">Pricing Models</Link></li>
                          <li><Link to="/downloads" className="hover:text-brand-600">Desktop Tools</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/contact" className="hover:text-brand-600">Contact Us</Link></li>
                          <li><Link to="/signup" className="hover:text-brand-600">Get Started</Link></li>
                          <li><Link to="/login" className="hover:text-brand-600">Sign In</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/how-it-works" className="hover:text-brand-600">Discovery Engine</Link></li>
                          <li><a href="#" className="hover:text-brand-600">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-brand-600">Security Audit</a></li>
                      </ul>
                  </div>
              </div>
              <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-gray-400 text-sm">© 2026 AI RecruitPro Inc. All rights reserved.</p>
                  <div className="flex gap-8 text-sm text-gray-400 font-medium">
                      <a href="#" className="hover:text-gray-900 transition-colors">System Status</a>
                      <a href="#" className="hover:text-gray-900 transition-colors">Global Support</a>
                  </div>
              </div>
          </div>
      </footer>

      {/* Floating Chat Assistant */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[380px] h-[550px] bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300 border-t-8 border-t-brand-600">
            <div className="p-6 bg-white border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">RecruitPro Assistant</h3>
                  <span className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => { if(confirm("Clear history?")) { setMessages([{ role: 'bot', text: "Chat history cleared. How can I help?" }]); localStorage.removeItem('recruitpro_landing_chat'); } }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="bg-amber-50 px-6 py-2 flex items-center gap-2 border-b border-amber-100">
              <ShieldAlert size={12} className="text-amber-600" />
              <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Site Restricted Mode</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm font-bold leading-relaxed ${m.role === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm flex items-center gap-1">
                    <div className="w-1 h-1 bg-brand-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-brand-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-brand-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a question..." 
                className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-bold text-sm transition-all"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="bg-brand-600 text-white p-3 rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 disabled:opacity-50"
              >
                <Send size={22} />
              </button>
            </form>
          </div>
        )}

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${isChatOpen ? 'bg-gray-900' : 'bg-brand-600'}`}
        >
          {isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
          )}
        </button>
      </div>
    </div>
  );
};

// Subcomponents
const SignalMapCard = ({ platform, signal, status, icon }: any) => (
    <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 text-brand-400 rounded-lg flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-xs font-bold text-white">{platform}</p>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">{signal}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <ArrowRight size={12} className="text-gray-600" />
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${status === 'Urgent' ? 'bg-red-500/10 text-red-400' : status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-blue-50/10 text-blue-400'}`}>
                {status}
            </span>
        </div>
    </div>
);

const TalentNode = ({ pos, icon, name, delay }: any) => (
    <div className={`absolute ${pos} flex flex-col items-center animate-bounce-slow`} style={{ animationDelay: delay }}>
        <div className="w-10 h-10 bg-gray-800 text-brand-500 rounded-full flex items-center justify-center border border-brand-500/50 shadow-2xl shadow-brand-500/20">
            {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-400 mt-2 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">{name}</span>
    </div>
);

const FeatureDetail = ({ icon, title, desc }: any) => (
    <div className="flex flex-col items-center group">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-50 transition-colors group-hover:scale-110 duration-500 shadow-sm border border-gray-100">
            {icon}
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-4">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">{desc}</p>
    </div>
);

const SocialIcon = ({ icon, href }: any) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-brand-600 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
    >
        {icon}
    </a>
);
