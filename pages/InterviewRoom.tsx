
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Candidate, JobCriteria, InterviewQuestion } from '../types';
import { Mic, Send, Play, CheckCircle, Clock, Download, Briefcase, User, Mail, ShieldCheck, Square } from 'lucide-react';
import { downloadCSV } from '../services/utils';

interface InterviewRoomProps {
    candidates?: Candidate[]; // Optional for public flow
    jobs: JobCriteria[];
    onComplete: (candidateId: string, answers: Record<string, string>, newCandidate?: Partial<Candidate>) => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({ candidates, jobs, onComplete }) => {
    // We can have either candidateId (Private) OR jobId (Public)
    const { candidateId, jobId } = useParams(); 
    const isPublic = !!jobId;

    const navigate = useNavigate();
    
    // Intake State (Public Only)
    const [intakeStep, setIntakeStep] = useState<'form' | 'briefing' | 'consent' | 'interview'>('form');
    const [publicName, setPublicName] = useState('');
    const [publicEmail, setPublicEmail] = useState('');

    // Interview State
    const [started, setStarted] = useState(false);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [finished, setFinished] = useState(false);
    
    // Voice State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Resolve Job & Candidate
    let job: JobCriteria | undefined;
    let candidateName = '';

    if (isPublic) {
        job = jobs.find(j => j.id === jobId);
    } else {
        const candidate = candidates?.find(c => c.id === candidateId);
        job = candidate ? jobs.find(j => j.id === candidate.jobId) : undefined;
        candidateName = candidate?.name || '';
    }

    // Default questions
    const questions: InterviewQuestion[] = job?.interviewConfig?.questions || [
        { id: '1', text: "Tell us about yourself and your background.", type: 'general' },
        { id: '2', text: "What interests you about this role?", type: 'general' }
    ];

    useEffect(() => {
        // If private, skip intake
        if (!isPublic && candidateName) {
            setIntakeStep('interview');
        }
        
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window) {
            // @ts-ignore
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            
            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                if (finalTranscript) {
                    setCurrentAnswer(prev => prev + ' ' + finalTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
            
            recognition.onend = () => {
                setIsListening(false);
            }

            recognitionRef.current = recognition;
        }
    }, [isPublic, candidateName]);

    if (!job) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Invalid Interview Link</div>;
    }
    
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser. Please use Chrome.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleIntakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(publicName && publicEmail) setIntakeStep('briefing');
    }

    const handleNext = () => {
        if (!currentAnswer.trim()) return;
        
        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        const q = questions[currentQIndex];
        const newAnswers = { ...answers, [q.id]: currentAnswer };
        setAnswers(newAnswers);
        setCurrentAnswer('');
        
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            setFinished(true);
            
            if (isPublic) {
                // Pass new candidate data up
                onComplete('new_public', newAnswers, {
                    name: publicName,
                    email: publicEmail,
                    jobId: job!.id,
                });
            } else {
                onComplete(candidateId!, newAnswers);
            }
        }
    };

    const handleDownload = () => {
        const data = questions.map(q => ({
            'Question ID': q.id,
            'Question': q.text,
            'Type': q.type,
            'Candidate Answer': answers[q.id] || ''
        }));
        downloadCSV(data, `${isPublic ? publicName : candidateName}_interview_transcript.csv`);
    };

    if (finished) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Completed!</h2>
                    <p className="text-gray-500 mb-8">Thank you, {isPublic ? publicName : candidateName}. Your responses have been recorded and sent to the recruitment team.</p>
                    
                    <button 
                        onClick={handleDownload}
                        className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 flex items-center justify-center gap-2 w-full shadow-lg shadow-brand-200"
                    >
                        <Download size={20} /> Download Transcript
                    </button>
                    <p className="text-xs text-gray-400 mt-4">You may close this window now.</p>
                </div>
            </div>
        );
    }

    // --- PUBLIC INTAKE FLOW ---
    if (isPublic && intakeStep === 'form') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">AI</div>
                        <h1 className="text-2xl font-bold text-gray-900">Ranker AI Interview</h1>
                        <p className="text-gray-500">Please enter your details to proceed.</p>
                    </div>
                    <form onSubmit={handleIntakeSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="text" 
                                    value={publicName} 
                                    onChange={e => setPublicName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                                    placeholder="Jane Doe"
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="email" 
                                    value={publicEmail} 
                                    onChange={e => setPublicEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                                    placeholder="jane@example.com"
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 mt-2">
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isPublic && intakeStep === 'briefing') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h2>
                    <div className="flex gap-2 mb-6">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{job.type}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{job.location}</span>
                    </div>
                    
                    <div className="prose prose-sm text-gray-600 mb-8 max-h-60 overflow-y-auto">
                        <p>{job.description}</p>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button onClick={() => setIntakeStep('form')} className="text-gray-500 font-medium">Back</button>
                        <button onClick={() => setIntakeStep('consent')} className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold">
                            I Understand, Proceed
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isPublic && intakeStep === 'consent') {
         return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to start?</h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        By clicking continue, you agree to have your answers recorded and analyzed by our AI recruitment system for the purpose of this application.
                    </p>
                    <button 
                        onClick={() => setIntakeStep('interview')} 
                        className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700"
                    >
                        I Consent, Start Interview
                    </button>
                </div>
            </div>
        );
    }

    // --- MAIN INTERVIEW INTERFACE ---
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-xl text-brand-600">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center text-sm">AI</div>
                    Ranker AI <span className="text-gray-400 font-normal">| Interview Room</span>
                </div>
                {started && (
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        <Clock size={14} /> Question {currentQIndex + 1} of {questions.length}
                    </div>
                )}
            </header>

            <main className="max-w-3xl mx-auto p-6 md:p-12">
                {!started ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 text-center animate-fade-in">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {isPublic ? publicName : candidateName}</h1>
                        <p className="text-lg text-gray-500 mb-8">
                            You are about to start a preliminary AI-assisted interview for the position of <strong className="text-gray-900">{job.title}</strong>.
                        </p>
                        
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 text-left">
                            <h3 className="font-bold text-blue-900 mb-2">Instructions:</h3>
                            <ul className="list-disc list-inside text-blue-800 space-y-1">
                                <li>This session consists of {questions.length} questions.</li>
                                <li>Take your time to answer each question thoroughly.</li>
                                <li>You can type your answers or use voice dictation.</li>
                            </ul>
                        </div>

                        <button 
                            onClick={() => setStarted(true)}
                            className="bg-brand-600 text-white text-lg font-bold px-10 py-4 rounded-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center gap-3 mx-auto"
                        >
                            Start Interview <Play size={24} fill="currentColor" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 animate-fade-in">
                        {/* AI Interviwer Bubble */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                                AI
                            </div>
                            <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm max-w-2xl">
                                <p className="text-gray-900 text-lg font-medium leading-relaxed">
                                    {questions[currentQIndex].text}
                                </p>
                            </div>
                        </div>

                        {/* User Input Area */}
                        <div className="flex gap-4 justify-end mt-4">
                            <div className="flex-1 max-w-2xl">
                                <div className={`bg-white p-4 rounded-2xl border transition-shadow shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 ${isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300'}`}>
                                    <textarea 
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder={isListening ? "Listening..." : "Type your answer here..."}
                                        className="w-full h-32 resize-none border-none focus:ring-0 text-gray-800 text-base"
                                    />
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <button 
                                            onClick={toggleListening}
                                            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-50 text-red-600 animate-pulse' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`} 
                                            title="Voice Input"
                                        >
                                            {isListening ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
                                        </button>
                                        <button 
                                            onClick={handleNext}
                                            disabled={!currentAnswer.trim()}
                                            className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                                        >
                                            {currentQIndex === questions.length - 1 ? 'Finish' : 'Next Question'} <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-right text-xs text-gray-400 mt-2">Press Enter for new line. Click mic to speak.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0 mt-1 font-bold">
                                {(isPublic ? publicName : candidateName).charAt(0)}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
