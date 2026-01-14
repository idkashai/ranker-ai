
import React from 'react';
import { Radar, Database, Cpu, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface WorkflowSelectorProps {
  onSelect: (mode: 'pulsive' | 'manual' | 'hybrid') => void;
}

export const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-100 rounded-full blur-[100px] opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <Sparkles size={14} className="text-brand-600" />
           <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Your Intelligence Engine</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
          Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Workflow.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
          Ranker AI adapts to your hiring style. Select the engine that fits your current search priority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full relative z-10 px-4">
        <ModeCard 
          icon={<Radar size={40} className="text-blue-600" />}
          title="Pulsive Radar"
          desc="Autonomous mode. We monitor 50+ networks to find and rank passive candidates for you."
          details={["Zero uploads required", "Autonomous sourcing", "Global availability signals"]}
          color="border-blue-200 hover:border-blue-500"
          accent="bg-blue-50"
          onClick={() => onSelect('pulsive')}
        />
        <ModeCard 
          icon={<Database size={40} className="text-brand-600" />}
          title="Manual Pipeline"
          desc="The classic engine. Upload your own resume databases and let AI reasoning rank them."
          details={["Direct resume analysis", "Custom criteria weights", "ATS migration support"]}
          color="border-brand-200 hover:border-brand-500"
          accent="bg-brand-50"
          onClick={() => onSelect('manual')}
        />
        <ModeCard 
          icon={<Cpu size={40} className="text-purple-600" />}
          title="Hybrid Node"
          desc="Full enterprise access. Combined radar sourcing with high-volume local resume processing."
          details={["Complete feature set", "Local GPU acceleration", "Omni-channel talent flow"]}
          color="border-purple-200 hover:border-purple-500"
          accent="bg-purple-50"
          onClick={() => onSelect('hybrid')}
        />
      </div>

      <div className="mt-20 flex flex-wrap justify-center gap-10 opacity-40 grayscale pointer-events-none">
         <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500"><ShieldCheck size={16} /> Bank-grade Security</div>
         <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500"><Zap size={16} /> Native Processing</div>
         <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-500"><Sparkles size={16} /> 99% Accuracy</div>
      </div>
    </div>
  );
};

const ModeCard = ({ icon, title, desc, details, color, accent, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`bg-white p-10 rounded-[3rem] border-2 ${color} transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-2xl hover:-translate-y-2 flex flex-col`}
  >
    <div className={`w-20 h-20 ${accent} rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-gray-500 text-base leading-relaxed mb-10 font-medium">{desc}</p>
    
    <div className="space-y-3 mb-12 flex-1">
      {details.map((d: string, i: number) => (
        <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-700">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
           {d}
        </div>
      ))}
    </div>

    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
       <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Launch Engine</span>
       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
          <ArrowRight size={20} />
       </div>
    </div>
  </div>
);
