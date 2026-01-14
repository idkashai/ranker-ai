
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  BarChart3, 
  Mail, 
  LogOut, 
  Menu,
  X,
  UserCircle,
  Settings,
  ChevronDown,
  Radar,
  CreditCard,
  Check,
  Star,
  Zap,
  RotateCw,
  Cpu,
  ShieldCheck,
  History,
  TrendingUp,
  Wallet,
  Activity,
  CpuIcon
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  currentMode: 'pulsive' | 'manual' | 'hybrid';
  onLogout: () => void;
  onSwitchMode: () => void;
  onUpdateUser?: (updatedUser: Partial<User>) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, currentMode, onLogout, onSwitchMode, onUpdateUser }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'billing'>('profile');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editCompany, setEditCompany] = useState(user?.company || '');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY < 64) setShowHeader(true);
      else if (currentScrollY > lastScrollY.current && currentScrollY > 64) setShowHeader(false);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSettings = (tab: 'profile' | 'billing' = 'profile') => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setEditCompany(user.company);
    }
    setActiveSettingsTab(tab);
    setIsProfileMenuOpen(false);
    setIsSettingsOpen(true);
  };

  const allNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, modes: ['pulsive', 'manual', 'hybrid'] },
    { label: 'Job Criteria', path: '/jobs', icon: <Briefcase size={20} />, modes: ['pulsive', 'manual', 'hybrid'] },
    { label: 'Talent Pulse', path: '/sourcing', icon: <Radar size={20} />, modes: ['pulsive', 'hybrid'] },
    { label: 'Resumes', path: '/resumes', icon: <FileText size={20} />, modes: ['manual', 'hybrid'] },
    { label: 'Analysis', path: '/analysis', icon: <BarChart3 size={20} />, modes: ['pulsive', 'manual', 'hybrid'] },
    { label: 'Campaigns', path: '/campaigns', icon: <Mail size={20} />, modes: ['pulsive', 'manual', 'hybrid'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.modes.includes(currentMode));

  if (!user) return <div className="w-full h-full">{children}</div>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold text-xl">
            <div className="w-9 h-9 bg-brand-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg">RP</div>
            RecruitPro
          </Link>
          <button className="ml-auto lg:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
        </div>

        <div className="p-4 space-y-1">
          <div className="px-4 py-2 mb-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Active Engine</span>
             <div className="flex items-center justify-between text-brand-600 font-bold text-xs bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-100">
                <div className="flex items-center gap-2">
                    {currentMode === 'pulsive' ? <Radar size={14} /> : currentMode === 'manual' ? <Database size={14} /> : <Cpu size={14} />}
                    <span className="capitalize">{currentMode}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse"></div>
             </div>
          </div>
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button 
            onClick={onSwitchMode}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 mb-2 transition-all"
          >
            <RotateCw size={18} /> Switch Mode
          </button>
          <div className="flex items-center justify-between px-2 group cursor-pointer" onClick={() => openSettings('profile')}>
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">{user.name.charAt(0)}</div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">{user.plan || 'Business Pro'}</p>
                </div>
            </div>
            <Settings size={14} className="text-gray-300 group-hover:text-brand-600 transition-colors" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className={`bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-30 fixed top-0 right-0 left-0 lg:left-64 transition-all duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full opacity-0'}`}>
          <button className="lg:hidden text-gray-500 p-2 -ml-2" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          
          <div className="flex-1 flex items-center gap-6 px-4 overflow-hidden">
             <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                 <Zap size={14} className="text-brand-600" />
                 <span className="text-xs font-black text-gray-700 tracking-tight">42.0 <span className="text-gray-400">Credits</span></span>
             </div>
             <div className="hidden lg:flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Neural Link: Active</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4" ref={profileMenuRef}>
            <div className="relative">
                <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                >
                    <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center"><UserCircle size={20} /></div>
                    <span className="text-sm font-medium text-gray-700 hidden md:block">{user.name}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                </button>

                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="px-5 py-3 border-b border-gray-50 mb-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Logged in as</p>
                            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                        </div>
                        <div className="px-5 py-2">
                             <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center justify-between border border-gray-100">
                                 <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase">Credits</p>
                                     <p className="text-lg font-black text-gray-900">42.0</p>
                                 </div>
                                 <Zap size={20} className="text-brand-600" />
                             </div>
                        </div>
                        <button onClick={() => openSettings('profile')} className="w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Settings size={16} /> Account Settings</button>
                        <button onClick={() => openSettings('billing')} className="w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><CreditCard size={16} /> Wallet & Credits</button>
                        <button onClick={onSwitchMode} className="w-full text-left px-5 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><RotateCw size={16} /> Switch Mode</button>
                        <div className="border-t border-gray-50 my-2"></div>
                        <button onClick={onLogout} className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold"><LogOut size={16} /> Sign Out</button>
                    </div>
                )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto pt-16">
          <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
              <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-8 space-y-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">User Portal</h3>
                  <button onClick={() => setActiveSettingsTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${activeSettingsTab === 'profile' ? 'bg-white text-brand-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200'}`}>
                      <UserCircle size={18} /> My Profile
                  </button>
                  <button onClick={() => setActiveSettingsTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${activeSettingsTab === 'billing' ? 'bg-white text-brand-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-gray-200'}`}>
                      <Wallet size={18} /> Wallet & Credits
                  </button>
              </div>

              <div className="flex-1 flex flex-col min-h-0 bg-white">
                  <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                      <h2 className="text-3xl font-black text-gray-900">{activeSettingsTab === 'profile' ? 'Profile Details' : 'Neural Wallet'}</h2>
                      <button onClick={() => setIsSettingsOpen(false)} className="p-3 text-gray-300 hover:text-gray-900 bg-gray-50 rounded-full transition-all"><X size={24} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                      {activeSettingsTab === 'profile' ? (
                        <div className="space-y-10">
                             <div className="flex items-center gap-8">
                                 <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-inner border-4 border-white">
                                    {user.name.charAt(0)}
                                 </div>
                                 <div>
                                     <h4 className="text-2xl font-black text-gray-900">{user.name}</h4>
                                     <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{user.role} • Enterprise Member</p>
                                 </div>
                             </div>
                             <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Company Entity</label><input type="text" value={editCompany} onChange={e => setEditCompany(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-brand-500/10 outline-none" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Terminal</label><input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:ring-4 focus:ring-brand-500/10 outline-none" /></div>
                                <div className="md:col-span-2 pt-6 flex justify-end">
                                    <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-black shadow-xl transition-all active:scale-95">Update Identity</button>
                                </div>
                             </form>
                        </div>
                      ) : (
                        <div className="space-y-10">
                            <div className="bg-gradient-to-br from-gray-900 via-brand-900 to-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-12 opacity-10">
                                    <CpuIcon size={140} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <span className="bg-brand-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Active Node</span>
                                        <h4 className="text-3xl font-black italic">{user.plan || 'Business Pro'}</h4>
                                    </div>
                                    <div className="flex items-end gap-3 mb-10">
                                        <p className="text-7xl font-black tracking-tighter leading-none">42.0</p>
                                        <div className="pb-2">
                                            <p className="text-brand-400 font-black text-xs uppercase tracking-widest">Available</p>
                                            <p className="text-gray-500 font-bold text-[10px] uppercase">Neural Credits</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                        <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Refill Status</p><p className="text-sm font-bold text-gray-300">Auto-Refill: 12 Days</p></div>
                                        <div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Usage Cap</p><p className="text-sm font-bold text-gray-300">500 Credits / Mo</p></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <History size={16} className="text-brand-600" /> Transaction Ledger
                                </h4>
                                <div className="bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-100/50">
                                            <tr className="text-gray-400 font-black uppercase tracking-widest border-b border-gray-100">
                                                <th className="px-8 py-5">Operation</th>
                                                <th className="px-8 py-5">Impact</th>
                                                <th className="px-8 py-5 text-right">Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                                            <tr className="hover:bg-white transition-colors"><td className="px-8 py-5">Batch Reason: Sr. Designer</td><td className="px-8 py-5 text-red-500">-5.0 Credits</td><td className="px-8 py-5 text-right opacity-50">Just Now</td></tr>
                                            <tr className="hover:bg-white transition-colors"><td className="px-8 py-5">Pulse Intercept: Global</td><td className="px-8 py-5 text-red-500">-2.0 Credits</td><td className="px-8 py-5 text-right opacity-50">2h ago</td></tr>
                                            <tr className="hover:bg-white transition-colors"><td className="px-8 py-5">Enterprise Pack Top-up</td><td className="px-8 py-5 text-green-500">+50.0 Credits</td><td className="px-8 py-5 text-right opacity-50">Yesterday</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-brand-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-brand-500/30 active:scale-95 transition-all">Buy Credit Pack</button>
                                <button className="flex-1 bg-white border-2 border-gray-100 text-gray-900 py-5 rounded-2xl font-black hover:bg-gray-50 transition-all">Upgrade Plan</button>
                            </div>
                        </div>
                      )}
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Database = ({ size, className }: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>;
