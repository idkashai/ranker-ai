
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Menu, X, Linkedin, Github, Twitter } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
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
              <Link to="/downloads" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                Get Started Free
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
                <Link to="/downloads" className="block text-gray-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-gray-600 font-medium">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      <div className="flex-1 flex flex-col justify-center py-20 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <h2 className="text-center text-4xl font-black text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-500">Start your free trial</Link>
            </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
            <div className="bg-white py-10 px-4 shadow-2xl border border-gray-100 sm:rounded-[2rem] sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Work Email</label>
                  <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        placeholder="you@company.ai"
                      />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                        placeholder="••••••••"
                      />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500" />
                    <label className="text-sm text-gray-600 font-medium">Remember me</label>
                  </div>
                  <a href="#" className="text-sm font-bold text-brand-600 hover:text-brand-500">Forgot password?</a>
                </div>

                <button
                    type="submit" disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 font-medium uppercase tracking-widest text-[10px]">Or continue with</span>
                </div>
            </div>

            <div className="mt-6">
                <button 
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-2xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>
            </div>
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
                      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
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

const SocialIcon = ({ icon }: any) => (
    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-brand-600 hover:text-white transition-all cursor-pointer">
        {icon}
    </div>
);
