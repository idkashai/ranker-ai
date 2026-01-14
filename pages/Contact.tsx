
import { CheckCircle, Copy, Github, Globe, Linkedin, Mail, Map as MapIcon, MapPin, Menu, MessageSquare, Minus, Phone, Plus, Send, Sparkles, Twitter, X, ArrowRight, Bot, User, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

export const Contact: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>(() => {
    const saved = localStorage.getItem('recruitpro_chat');
    return saved ? JSON.parse(saved) : [
      { role: 'bot', text: "Hi! I'm the RecruitPro AI Assistant. I'm here to help with any questions about our platform, pricing, or services. How can I assist you today?" }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('recruitpro_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setMessages([
        { role: 'bot', text: "Hi! I'm the RecruitPro AI Assistant. I'm here to help with any questions about our platform, pricing, or services. How can I assist you today?" }
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful customer support agent for AI RecruitPro. 
        
        STRICT RULES:
        1. Only answer questions related to AI RecruitPro, its recruitment services, pricing, features, and contact information.
        2. If the user asks for something unrelated (e.g., writing code, solving math, writing Python, general knowledge questions), you must politely decline.
        3. Example response for unrelated tasks: "I apologize, but I am specifically trained to assist with AI RecruitPro inquiries only. I cannot write code or perform unrelated tasks. Please let me know if you have any questions about our recruitment platform!"
        
        Company Details:
        - Email: kashiflearnai@gmail.com
        - Phone: +92 348 7195961
        - Office: Block C, Phase 1 Johar Town, Lahore, 54770, Pakistan
        - Service: Autonomous recruitment, AI resume screening, talent pulse radar, and automated interview rooms.
        
        User Question: ${userMessage}`,
      });

      const botResponse = response.text || "I'm sorry, I'm having trouble connecting right now. Please try emailing kashiflearnai@gmail.com.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Error connecting to AI. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const faqs = [
    { q: "How fast can AI RecruitPro analyze resumes?", a: "Our native engine can process up to 1,000 pages per minute using GPU acceleration. Cloud-based analysis typically takes 3-5 seconds per resume for deep reasoning." },
    { q: "Which professional networks does the Pulse Radar scan?", a: "Currently, we scan LinkedIn, GitHub, Wellfound, Indeed, and Twitter (X), plus another 45+ secondary professional networks and niche job boards." },
    { q: "Is candidate data kept private?", a: "Yes. For Enterprise clients, we offer a Zero-Cloud model where PII never leaves your local hardware. Standard plans use encrypted E2E tunnels for all AI processing." },
    { q: "Can I integrate this with my current ATS?", a: "We provide a robust REST API and pre-built hooks for Lever, Greenhouse, and Workday. Contact our enterprise team for custom integration support." }
  ];

  return (
    <div className="bg-white min-h-screen font-sans flex flex-col selection:bg-brand-100 selection:text-brand-900">
      {/* Global Public Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 group">
              <div className="w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform">RP</div>
              <span className="tracking-tight">AI RecruitPro</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">How it Works</Link>
              <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
              <Link to="/downloads" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Desktop Tools</Link>
              <Link to="/contact" className="text-sm font-bold text-brand-600 transition-colors">Contact</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-900 font-semibold text-sm hover:text-brand-600 transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95">
                Start Free
              </Link>
            </div>

            <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg absolute w-full animate-in slide-in-from-top-4 duration-200">
                <Link to="/how-it-works" className="block text-gray-600 font-medium">How it Works</Link>
                <Link to="/pricing" className="block text-gray-600 font-medium">Pricing</Link>
                <Link to="/downloads" className="block text-gray-600 font-medium">Downloads</Link>
                <Link to="/contact" className="block text-brand-600 font-bold">Contact</Link>
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <Link to="/login" className="block text-center text-gray-900 font-bold py-2 border border-gray-200 rounded-lg">Sign In</Link>
                    <Link to="/signup" className="block text-center bg-brand-600 text-white font-bold py-2 rounded-lg">Get Started</Link>
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 border-b border-gray-100 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-24 opacity-[0.03] pointer-events-none">
              <Sparkles size={400} className="text-brand-600" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                 <Globe size={12} className="animate-pulse" /> Support Hub
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">Touch.</span></h1>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">Reach out via our contact form, direct channels, or talk to our site-trained AI assistant below.</p>
          </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* LEFT: Contact Information (4 cols) */}
                  <div className="lg:col-span-4 space-y-8">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                          <h2 className="text-2xl font-black text-gray-900 mb-6">Contact Details</h2>
                          <div className="space-y-6">
                              <InteractiveContactCard 
                                icon={<Mail size={20}/>} 
                                label="Email" 
                                value="kashiflearnai@gmail.com" 
                                onCopy={() => handleCopy("kashiflearnai@gmail.com", "Email")} 
                                isCopied={copiedText === "Email"}
                              />
                              <InteractiveContactCard 
                                icon={<Phone size={20}/>} 
                                label="Phone" 
                                value="+92 348 7195961" 
                                onCopy={() => handleCopy("+923487195961", "Phone")} 
                                isCopied={copiedText === "Phone"}
                              />
                              <InteractiveContactCard 
                                icon={<MapPin size={20}/>} 
                                label="HQ Address" 
                                value="Block C, Phase 1 Johar Town" 
                                secondaryValue="Lahore, 54770, Pakistan"
                                onCopy={() => handleCopy("Block C, Phase 1 Johar Town, Lahore, 54770, Pakistan", "Address")} 
                                isCopied={copiedText === "Address"}
                              />
                          </div>
                      </div>

                      <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                          <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                             <MapIcon size={160} />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                          <p className="text-gray-400 text-sm mb-6 leading-relaxed">Located in the heart of Lahore's tech district. We're always open for a coffee and a discussion about your hiring roadmap.</p>
                          <div className="flex gap-4">
                              <SocialIcon icon={<Linkedin size={18} />} href="#" />
                              <SocialIcon icon={<Twitter size={18} />} href="#" />
                              <SocialIcon icon={<Github size={18} />} href="#" />
                          </div>
                      </div>
                  </div>

                  {/* CENTER: Contact Form (4 cols) */}
                  <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                          <MessageSquare size={150} />
                      </div>
                      
                      {formSubmitted ? (
                          <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in zoom-in-95 duration-500">
                              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner border border-green-100">
                                  <CheckCircle size={40} />
                              </div>
                              <h2 className="text-3xl font-black text-gray-900 mb-3">Message Sent!</h2>
                              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                  Our team has received your message and will get back to you within 2 business hours.
                              </p>
                              <button onClick={() => setFormSubmitted(false)} className="text-brand-600 font-black text-xs uppercase tracking-widest hover:underline">Send Another</button>
                          </div>
                      ) : (
                          <>
                              <h2 className="text-2xl font-black text-gray-900 mb-2">Send a Message</h2>
                              <p className="text-sm text-gray-500 mb-8">Prefer email? Fill out the form below.</p>
                              <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="space-y-5">
                                  <div>
                                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Name</label>
                                      <input required type="text" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold text-gray-900 transition-all" placeholder="Jane Doe" />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                                      <input required type="email" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold text-gray-900 transition-all" placeholder="jane@company.com" />
                                  </div>
                                  <div>
                                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Message</label>
                                      <textarea required rows={4} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none font-bold text-gray-900 transition-all resize-none" placeholder="Tell us about your hiring needs..."></textarea>
                                  </div>
                                  <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95 flex items-center justify-center gap-2 group">
                                      Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                  </button>
                              </form>
                          </>
                      )}
                  </div>

                  {/* RIGHT: Restricted Chat Assistant (4 cols) */}
                  <div className="lg:col-span-4 bg-white border border-gray-100 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col h-[600px] relative group">
                    <div className="bg-brand-600 p-6 text-white flex justify-between items-center shadow-lg relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Site Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] uppercase font-black opacity-80 tracking-widest">Restricted Mode</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={clearChat}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                            title="Clear Chat History"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    
                    <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 border-b border-amber-100">
                        <ShieldAlert size={12} className="text-amber-600" />
                        <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest">Only Site-Related Inquiries Accepted</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 custom-scrollbar">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></div>
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
                            placeholder="Ask about AI RecruitPro..." 
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 font-medium text-xs transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!chatInput.trim() || isTyping}
                            className="bg-brand-600 text-white p-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                  </div>

              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-4xl font-black text-gray-900 text-center mb-16">Common Inquiries</h2>
              <div className="space-y-4">
                  {faqs.map((faq, i) => (
                      <div key={i} className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <button 
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            className="w-full px-10 py-8 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors"
                          >
                              <span className="font-black text-gray-900 text-lg">{faq.q}</span>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openFaq === i ? 'bg-brand-600 text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                                  {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                              </div>
                          </button>
                          {openFaq === i && (
                              <div className="px-10 pb-10 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-4 duration-500 font-medium">
                                  {faq.a}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Global Public Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
                  <div className="md:col-span-2">
                      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-brand-600 mb-6">
                        <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-sm shadow-lg shadow-brand-500/20">RP</div>
                        AI RecruitPro
                      </Link>
                      <p className="text-gray-500 max-w-sm mb-8 leading-relaxed font-medium">
                          The world's first autonomous recruitment ecosystem. Empowering HR teams with real-time talent signals and native-speed resume intelligence.
                      </p>
                      <div className="flex gap-4">
                          <SocialIcon icon={<Linkedin size={18}/>} href="#" />
                          <SocialIcon icon={<Twitter size={18}/>} href="#" />
                          <SocialIcon icon={<Github size={18}/>} href="#" />
                          <SocialIcon icon={<Globe size={18}/>} href="#" />
                      </div>
                  </div>
                  <div>
                      <h4 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Platform</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-bold">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">How it Works</Link></li>
                          <li><Link to="/pricing" className="hover:text-brand-600 transition-colors">Pricing Models</Link></li>
                          <li><Link to="/downloads" className="hover:text-brand-600 transition-colors">Desktop Tools</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-bold">
                          <li><Link to="/contact" className="hover:text-brand-600 transition-colors">Contact Us</Link></li>
                          <li><Link to="/signup" className="hover:text-brand-600 transition-colors">Get Started</Link></li>
                          <li><Link to="/login" className="hover:text-brand-600 transition-colors">Sign In</Link></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="font-black text-gray-900 mb-6 uppercase tracking-[0.2em] text-[10px]">Resources</h4>
                      <ul className="space-y-4 text-sm text-gray-500 font-bold">
                          <li><Link to="/how-it-works" className="hover:text-brand-600 transition-colors">Discovery Engine</Link></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-brand-600 transition-colors">Security Audit</a></li>
                      </ul>
                  </div>
              </div>
              <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 AI RecruitPro Inc. All rights reserved.</p>
                  <div className="flex gap-8 text-xs text-gray-400 font-black uppercase tracking-widest">
                      <a href="#" className="hover:text-gray-900 transition-colors">System Status</a>
                      <a href="#" className="hover:text-gray-900 transition-colors">Global Support</a>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

const InteractiveContactCard = ({ icon, label, value, secondaryValue, onCopy, isCopied }: any) => (
    <div className="flex items-center gap-4 group bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-brand-100 hover:bg-white transition-all duration-300 relative overflow-hidden">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isCopied ? 'bg-green-600 text-white' : 'bg-white text-brand-600 border border-gray-100 group-hover:bg-brand-600 group-hover:text-white shadow-sm'}`}>
            {isCopied ? <CheckCircle size={18} /> : icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
            <div className="flex flex-col">
                <p className="text-sm font-black text-gray-900 leading-tight truncate">{value}</p>
                {secondaryValue && <p className="text-[11px] font-bold text-gray-500">{secondaryValue}</p>}
            </div>
        </div>
        <button 
          onClick={onCopy}
          className={`p-2 rounded-lg transition-all ${isCopied ? 'bg-green-50 text-green-600' : 'text-gray-300 hover:text-brand-600'}`}
          title="Copy"
        >
            <Copy size={14} />
        </button>
    </div>
);

const SocialIcon = ({ icon, href }: any) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/50 border border-white/10 hover:bg-brand-600 hover:text-white hover:border-brand-600 hover:scale-110 transition-all cursor-pointer shadow-sm active:scale-95"
    >
        {icon}
    </a>
);
