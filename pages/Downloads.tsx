
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, Apple, ShieldCheck, Zap, Download, WifiOff, Globe, Play, Cpu, ShieldAlert, Layers, Activity, Menu, X, Linkedin, Github, Twitter } from 'lucide-react';

export const Downloads: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Global Public Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600">
              <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg">RP</div>
              AI RecruitPro
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">How it Works</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
              <Link to="/downloads" className="text-sm font-bold text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-900 font-semibold text-sm hover:text-brand-600 transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                Start Free
              </Link>
            </div>

            <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full">
                <Link to="/how-it-works" className="block text-gray-600 font-medium">How it Works</Link>
                <Link to="/pricing" className="block text-gray-600 font-medium">Pricing</Link>
                <Link to="/downloads" className="block text-brand-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-gray-600 font-medium">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/login" className="block text-center text-gray-900 font-bold py-2 border border-gray-200 rounded-lg">Sign In</Link>
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      <div className="space-y-24 py-24 animate-fade-in px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">Native Architecture</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Unleash the full power of your hardware. AI RecruitPro native apps offer unprecedented speed and security for enterprise HR teams.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <OSCard 
            icon={<Apple size={32} />}
            title="macOS Enterprise"
            version="v4.2.0 (Native Apple Silicon)"
            color="bg-gray-900"
            btnText="Install for Mac"
          />
          <OSCard 
            icon={<Monitor size={32} />}
            title="Windows Pro"
            version="v4.2.0 (DirectX Accelerated)"
            color="bg-brand-600"
            btnText="Install for Windows"
          />
          <OSCard 
            icon={<Globe size={32} />}
            title="Linux Binary"
            version="v4.2.0 (.AppImage & Snap)"
            color="bg-orange-600"
            btnText="Download for Linux"
          />
        </div>

        <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Cpu size={400} />
            </div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                    <h2 className="text-brand-400 font-bold uppercase tracking-widest text-xs mb-4">Architecture & Privacy</h2>
                    <h3 className="text-4xl font-black mb-8 leading-tight">Zero-Cloud <br/>Sourcing Model</h3>
                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                        Our desktop tools operate on a "Local-First" principle. While the AI sourcing pulse uses cloud APIs for platform scanning, all resume processing and sensitive candidate scoring happens <strong>on your local GPU</strong>. This ensures military-grade privacy where PII never leaves your corporate perimeter.
                    </p>
                    <div className="space-y-8">
                        <InfoPoint icon={<WifiOff className="text-brand-500" />} title="Offline Indexing" text="Index and search your entire candidate database without an internet connection." />
                        <InfoPoint icon={<ShieldAlert className="text-brand-500" />} title="PII Scrubbing" text="Automatic data anonymization before any cloud communication." />
                        <InfoPoint icon={<Layers className="text-brand-500" />} title="Batch Processing" text="Process 5,000+ resumes in a single session with local hardware acceleration." />
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="text-brand-400" size={18}/> Performance Benchmark
                        </h4>
                        <div className="space-y-6">
                            <BenchmarkRow label="Web Browser" value={20} total={100} unit="r/m" />
                            <BenchmarkRow label="Native App (Standard)" value={85} total={100} unit="r/m" />
                            <BenchmarkRow label="Native App (GPU Accelerated)" value={100} total={100} unit="r/m" color="bg-brand-500" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-8 text-center uppercase tracking-widest">Resumes processed per minute (Based on M2 Max / RTX 4090)</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 flex gap-8 items-start">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                    <ShieldCheck className="text-green-600" size={24}/>
                </div>
                <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4">Security First</h4>
                    <p className="text-gray-500 leading-relaxed">
                        Data is encrypted at rest using AES-256. The native app communicates via an end-to-end encrypted bridge with the Sourcing Command Center.
                    </p>
                </div>
            </div>
            <div className="p-12 bg-gray-50 rounded-[3rem] border border-gray-100 flex gap-8 items-start">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Zap className="text-yellow-600" size={24}/>
                </div>
                <div>
                    <h4 className="text-2xl font-black text-gray-900 mb-4">Global Sync</h4>
                    <p className="text-gray-500 leading-relaxed">
                        Collaborate with your team seamlessly. Sourcing signals found on the desktop are instantly synced to your team's cloud dashboard.
                    </p>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto bg-brand-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
            <div className="max-w-xl">
                <h2 className="text-4xl font-black mb-6 leading-tight">Sourcing Pulse <br/>on your Mobile.</h2>
                <p className="text-brand-100 text-lg mb-8">Receive instant "Open to Work" notifications from the Global Pulse engine directly on your phone.</p>
                <div className="flex gap-4">
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-xl">
                        <Smartphone size={20} /> App Store
                    </button>
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-gray-100 transition-all shadow-xl">
                        <Play size={20} fill="currentColor" /> Play Store
                    </button>
                </div>
            </div>
            <div className="w-64 h-[400px] bg-gray-900 rounded-[2.5rem] border-4 border-white/20 shadow-2xl relative overflow-hidden p-6">
                <div className="w-full h-4 bg-gray-800 rounded-full mb-8"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-brand-500/20 rounded-2xl border border-brand-500/30 p-3 flex flex-col justify-center">
                        <div className="w-8 h-2 bg-brand-500/40 rounded-full mb-2"></div>
                        <div className="w-full h-3 bg-brand-500/60 rounded-full"></div>
                    </div>
                    <div className="h-20 bg-gray-800 rounded-2xl p-3 flex flex-col justify-center">
                         <div className="w-8 h-2 bg-gray-700 rounded-full mb-2"></div>
                         <div className="w-full h-3 bg-gray-700 rounded-full"></div>
                    </div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
            </div>
        </div>
      </div>

      {/* Global Public Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
                  <div className="md:col-span-2">
                      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 mb-6">
                        <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-sm">RP</div>
                        AI RecruitPro
                      </Link>
                      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                          The world's first autonomous recruitment ecosystem. Empowering HR teams with real-time talent signals and native-speed resume intelligence.
                      </p>
                      <div className="flex gap-4">
                          <SocialIcon icon={<Linkedin size={18}/>} />
                          <SocialIcon icon={<Twitter size={18}/>} />
                          <SocialIcon icon={<Github size={18}/>} />
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
    </div>
  );
};

const OSCard = ({ icon, title, version, color, btnText }: any) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center text-center">
        <div className={`w-20 h-20 ${color} text-white rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-10">{version}</p>
        <button className={`w-full py-5 rounded-2xl font-black text-white ${color} shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2`}>
            <Download size={20} /> {btnText}
        </button>
    </div>
);

const InfoPoint = ({ icon, title, text }: any) => (
    <div className="flex gap-4">
        <div className="mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-white mb-1">{title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
        </div>
    </div>
);

const BenchmarkRow = ({ label, value, total, unit, color = "bg-gray-700" }: any) => (
    <div>
        <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">
            <span>{label}</span>
            <span>{value} {unit}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${(value / total) * 100}%` }}></div>
        </div>
    </div>
);

const SocialIcon = ({ icon }: any) => (
    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-brand-600 hover:text-white transition-all cursor-pointer">
        {icon}
    </div>
);
