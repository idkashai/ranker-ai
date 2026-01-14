
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, Zap, Shield, Globe, Cpu, Menu, X, Coins, Clock, ArrowRight, 
  Star, ShieldCheck, Heart, Users, CheckCircle2, Minus, Info, Lock, CreditCard
} from 'lucide-react';

export const Pricing: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const plans = [
    {
      name: "Starter",
      price: 0,
      credits: 5,
      unitPrice: "Free",
      desc: "Perfect for testing the AI core.",
      features: ["5 Free Credits", "Manual Analysis Only", "Basic Score Reports", "Email Support"],
      featured: false
    },
    {
      name: "Pro Solo",
      price: 10,
      credits: 50,
      unitPrice: "$0.20",
      desc: "For independent recruiters.",
      features: ["50 Credits Pack", "Pulse Sourcing Radar", "AI Interview Room", "Standard API Access"],
      featured: true
    },
    {
      name: "Agency",
      price: 45,
      credits: 250,
      unitPrice: "$0.18",
      desc: "For growing hiring teams.",
      features: ["250 Credits Pack", "Multi-user Workspace", "Email Campaign Engine", "Custom Score Weights"],
      featured: false
    },
    {
      name: "Business",
      price: 150,
      credits: 1000,
      unitPrice: "$0.15",
      desc: "High-volume recruitment.",
      features: ["1,000 Credits Pack", "Full API Integration", "Dedicated Local Node", "Priority AI Processing"],
      featured: false
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col selection:bg-brand-100 selection:text-brand-900">
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
              <Link to="/pricing" className="text-sm font-bold text-brand-600 transition-colors">Pricing</Link>
              <Link to="/downloads" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-900 font-semibold text-sm hover:text-brand-600 transition-colors px-4">Sign In</Link>
              <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20">
                Start Free
              </Link>
            </div>

            <button className="md:hidden text-gray-600 p-2 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full animate-in slide-in-from-top-4 duration-200">
                <Link to="/how-it-works" className="block text-gray-600 font-medium">How it Works</Link>
                <Link to="/pricing" className="block text-brand-600 font-bold">Pricing</Link>
                <Link to="/downloads" className="block text-gray-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-gray-600 font-medium">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/login" className="block text-center text-gray-900 font-bold py-2 border border-gray-200 rounded-lg">Sign In</Link>
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      <div className="flex-1 py-20 px-4">
        {/* Cost Transparency Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Coins size={12} /> Pay-As-You-Analyze
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">Simple Credit Packs.</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium mb-12">No subscriptions. No recurring fees. Credits never expire.</p>
          
          <div className="flex flex-wrap justify-center gap-6 opacity-60">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <Lock size={14} className="text-green-500" /> Secure SSL Encryption
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <CreditCard size={14} className="text-blue-500" /> Powered by Stripe
             </div>
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                <ShieldCheck size={14} className="text-indigo-500" /> GDPR Compliant
             </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-32">
            {plans.map((plan, i) => (
                <PlanCard key={i} {...plan} />
            ))}
            
            {/* Custom/Enterprise Plan */}
            <div className="p-8 rounded-[2.5rem] flex flex-col bg-gray-50 border border-gray-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-lg">
                <h3 className="text-xl font-black mb-1">Ultimate</h3>
                <p className="text-gray-500 text-xs mb-8 font-medium">Enterprise scale.</p>
                <div className="mb-10 p-5 rounded-2xl bg-white border border-gray-100 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={20} className="text-brand-500" />
                        <span className="text-3xl font-black">Unlimited</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Custom Volume</p>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                    <li className="flex items-start gap-3 text-xs font-bold leading-relaxed text-gray-700">
                        <Check size={14} className="mt-0.5 text-brand-600" /> Dedicated local nodes
                    </li>
                    <li className="flex items-start gap-3 text-xs font-bold leading-relaxed text-gray-700">
                        <Check size={14} className="mt-0.5 text-brand-600" /> SSO / SAML Security
                    </li>
                    <li className="flex items-start gap-3 text-xs font-bold leading-relaxed text-gray-700">
                        <Check size={14} className="mt-0.5 text-brand-600" /> 24/7 Support Lead
                    </li>
                </ul>
                <Link to="/contact" className="w-full py-4 rounded-2xl font-black text-center text-sm transition-all bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200">Contact Sales</Link>
            </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto mb-32 bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden hidden md:block">
            <div className="p-10 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-2xl font-black text-gray-900">Compare Pack Capabilities</h3>
                <p className="text-sm text-gray-500 font-medium">Detailed breakdown of what your credits can do.</p>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <th className="px-10 py-6">Operational Feature</th>
                        <th className="px-6 py-6">Starter</th>
                        <th className="px-6 py-6 text-brand-600">Pro Solo</th>
                        <th className="px-6 py-6">Agency</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium">
                    <ComparisonRow label="Resume Analysis" s="1 per credit" p="1 per credit" a="1 per credit" />
                    <ComparisonRow label="Interview AI" s={<Minus size={14}/>} p="Included" a="Advanced" />
                    <ComparisonRow label="Platform Pulse" s="None" p="LinkedIn Only" a="50+ Networks" />
                    <ComparisonRow label="API Requests/Sec" s="None" p="5 rps" a="25 rps" />
                    <ComparisonRow label="Team Sync" s="1 Seat" p="1 Seat" a="Up to 10 Seats" />
                    <ComparisonRow label="Credit Life" s="None" p="Perpetual" a="Perpetual" />
                </tbody>
            </table>
        </div>

        {/* HR Testimonial */}
        <div className="max-w-4xl mx-auto mb-32">
            <div className="bg-brand-600 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Heart size={200} fill="white" />
                </div>
                <div className="relative z-10">
                    <div className="flex gap-1 mb-8">
                        {[1,2,3,4,5].map(s => <Star key={s} size={20} className="fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-2xl md:text-3xl font-black leading-tight mb-8">
                        "RecruitPro cut our initial screening time by 85%. Since it's credit-based, we only pay when we are actually hiring, saving us thousands annually."
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold">SM</div>
                        <div>
                            <p className="font-bold">Sarah Miller</p>
                            <p className="text-xs text-brand-200">Director of Talent Acquisition @ GlobalTech</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Trust Icons */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-20">
            <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck size={32} />
                </div>
                <h4 className="font-black text-gray-900">GDPR Compliant</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Candidate data is anonymized. We prioritize local processing for maximum privacy.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 size={32} />
                </div>
                <h4 className="font-black text-gray-900">No Hidden Fees</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Simple one-time payments. Start with 5 free credits instantly.</p>
            </div>
            <div className="space-y-4">
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Info size={32} />
                </div>
                <h4 className="font-black text-gray-900">Lifetime Credits</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">Credits never expire. Keep your balance for as long as you need.</p>
            </div>
        </div>
      </div>

      {/* Global Public Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
                  <div className="md:col-span-2">
                      <div className="flex items-center gap-2 font-bold text-2xl text-brand-600 mb-6">
                        <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-sm">RP</div>
                        AI RecruitPro
                      </div>
                      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
                          The world's first autonomous recruitment ecosystem. Empowering HR teams with real-time talent signals and native-speed resume intelligence.
                      </p>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">How it Works</Link></li>
                          <li><Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing Models</Link></li>
                          <li><Link to="/downloads" className="hover:text-brand-600 transition-colors">Desktop Tools</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/contact" className="hover:text-brand-600 transition-colors">Contact Us</Link></li>
                          <li><Link to="/signup" className="hover:text-brand-600 transition-colors">Get Started</Link></li>
                          <li><Link to="/login" className="hover:text-brand-600 transition-colors">Sign In</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Resources</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">Discovery Engine</Link></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Security Audit</a></li>
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

const PlanCard = ({ name, price, credits, desc, features, featured, unitPrice }: any) => (
    <div className={`relative p-8 rounded-[2.5rem] flex flex-col transition-all duration-500 hover:scale-[1.05] ${featured ? 'bg-gray-900 text-white shadow-2xl scale-105 z-10' : 'bg-white text-gray-900 border border-gray-100 shadow-xl'}`}>
        {featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">Most Popular</span>}
        <h3 className="text-xl font-black mb-1">{name}</h3>
        <p className={`${featured ? 'text-gray-400' : 'text-gray-500'} text-xs mb-8 font-medium`}>{desc}</p>
        
        <div className={`mb-10 p-5 rounded-2xl flex flex-col items-center text-center ${featured ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-1">
                <Coins size={20} className="text-brand-500" />
                <span className="text-4xl font-black">{credits}</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Analysis Credits</p>
            <div className="mt-4 flex flex-col items-center">
                <span className="text-2xl font-black">${price}</span>
                <span className={`text-[10px] font-bold ${featured ? 'text-brand-400' : 'text-brand-600'}`}>{unitPrice} / analysis</span>
            </div>
        </div>

        <ul className="space-y-4 mb-10 flex-1">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-xs font-bold leading-relaxed">
                    <Check size={14} className={`mt-0.5 ${featured ? 'text-brand-400' : 'text-brand-600'}`} />
                    <span className={featured ? 'text-gray-300' : 'text-gray-700'}>{f}</span>
                </li>
            ))}
        </ul>
        <Link 
            to="/signup" 
            className={`w-full py-4 rounded-2xl font-black text-center text-sm transition-all flex items-center justify-center gap-2 ${featured ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-xl shadow-brand-500/30' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
            Buy Pack <ArrowRight size={14} />
        </Link>
    </div>
);

const ComparisonRow = ({ label, s, p, a }: any) => (
    <tr className="hover:bg-gray-50/50 transition-colors">
        <td className="px-10 py-6 text-sm font-bold text-gray-700">{label}</td>
        <td className="px-6 py-6 text-xs font-medium text-gray-500">{s}</td>
        <td className="px-6 py-6 text-xs font-bold text-brand-600">{p}</td>
        <td className="px-6 py-6 text-xs font-medium text-gray-500">{a}</td>
    </tr>
);
