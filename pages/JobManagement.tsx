
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobCriteria, WeightedSkill, InterviewQuestion } from '../types';
import { Plus, Trash2, Wand2, X, MapPin, Briefcase, Loader2, BrainCircuit, Pencil, MessageSquare, Target, Zap } from 'lucide-react';
import { generateJobDescription, generateWeightedSkills, generateInterviewQuestions, generateInterviewFocusAreas, generateQuestionsByFocus } from '../services/gemini';

interface JobManagementProps {
  jobs: JobCriteria[];
  onAddJob: (job: JobCriteria) => void;
  onUpdateJob: (id: string, job: Partial<JobCriteria>) => void;
  onDeleteJob: (id: string) => void;
}

export const JobManagement: React.FC<JobManagementProps> = ({ jobs, onAddJob, onUpdateJob, onDeleteJob }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('Mid Level');
  
  // Skills State
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<WeightedSkill[]>([]);

  // Interview Questions State
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [newFocusArea, setNewFocusArea] = useState('');
  const [isGeneratingFocus, setIsGeneratingFocus] = useState(false);

  // Effect to handle URL params for deep linking to Edit
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
        const jobToEdit = jobs.find(j => j.id === editId);
        if (jobToEdit) {
            handleEditJob(jobToEdit);
        }
    }
  }, [searchParams, jobs]);

  const handleEditJob = (job: JobCriteria) => {
      setEditingId(job.id);
      setTitle(job.title);
      setDescription(job.description);
      setType(job.type || 'Full-time');
      setLocation(job.location || '');
      setExperience(job.experienceLevel || 'Mid Level');
      setSkills(job.weightedSkills || job.requiredSkills.map(s => ({ skill: s, weight: 10 })));
      setQuestions(job.interviewConfig?.questions || []);
      setIsCreating(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
      setIsCreating(false);
      setEditingId(null);
      resetForm();
      setSearchParams({}); // Clear URL params
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('Full-time');
    setLocation('');
    setExperience('Mid Level');
    setSkills([]);
    setQuestions([]);
    setFocusAreas([]);
    setCurrentSkill('');
  };

  const handleGenerateDescription = async () => {
    if (!title && skills.length === 0) return;
    setIsGeneratingDesc(true);
    const desc = await generateJobDescription(title, skills.map(s => s.skill));
    setDescription(desc);
    setIsGeneratingDesc(false);
  };

  const handleGenerateSkills = async () => {
      if (!title) {
          alert("Please enter a job title first.");
          return;
      }
      setIsGeneratingSkills(true);
      try {
          const generated = await generateWeightedSkills(title);
          const newSkills = [...skills];
          generated.forEach(g => {
              if (!newSkills.some(s => s.skill.toLowerCase() === g.skill.toLowerCase())) {
                  newSkills.push(g);
              }
          });
          setSkills(newSkills);
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingSkills(false);
      }
  };

  const handleGenerateFocusAreas = async () => {
    if (!description) return;
    setIsGeneratingFocus(true);
    const areas = await generateInterviewFocusAreas(title, description);
    setFocusAreas(areas);
    setIsGeneratingFocus(false);
  };

  const handleGenerateQuestionsByFocus = async (area: string) => {
    setIsGeneratingQuestions(true);
    const newQs = await generateQuestionsByFocus(title, area);
    setQuestions([...questions, ...newQs]);
    setIsGeneratingQuestions(false);
  };

  const handleGenerateQuestions = async () => {
      if (!title || !description) {
          alert("Please provide a Title and Description first.");
          return;
      }
      setIsGeneratingQuestions(true);
      try {
          const generated = await generateInterviewQuestions(title, description);
          setQuestions(generated);
      } catch(e) {
          console.error(e);
      } finally {
          setIsGeneratingQuestions(false);
      }
  };

  const handleAddSkill = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return;
    e?.preventDefault();
    
    const trimmed = currentSkill.trim();
    if (trimmed && !skills.some(s => s.skill.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { skill: trimmed, weight: 10 }]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s.skill !== skillToRemove));
  };

  const handleWeightChange = (skillName: string, newWeight: string) => {
      let weight = parseInt(newWeight);
      if (isNaN(weight)) weight = 0;
      if (weight > 10) weight = 10;
      if (weight < 1) weight = 1;

      setSkills(skills.map(s => 
          s.skill === skillName ? { ...s, weight: weight } : s
      ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jobData: Partial<JobCriteria> = {
      title,
      type,
      location,
      description,
      requiredSkills: skills.map(s => s.skill),
      weightedSkills: skills,
      experienceLevel: experience,
      interviewConfig: {
          questions,
          durationMinutes: 30
      }
    };

    if (editingId) {
        onUpdateJob(editingId, jobData);
    } else {
        const newJob: JobCriteria = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            ...jobData as any
        };
        onAddJob(newJob);
    }

    handleCancel();
  };

  const getWeightColor = (weight: number) => {
      if (weight >= 8) return 'text-green-600 bg-green-50 border-green-200 focus:ring-green-500';
      if (weight >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200 focus:ring-yellow-500';
      return 'text-red-600 bg-red-50 border-red-200 focus:ring-red-500';
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Criteria</h1>
          <p className="text-gray-500">Manage job listings and requirements for AI analysis.</p>
        </div>
        {!isCreating && (
            <button 
            onClick={() => { setIsCreating(true); resetForm(); setEditingId(null); setSearchParams({}); }}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
            >
            <Plus size={18} />
            Create New Job
            </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Job Criteria' : 'Create New Job Criteria'}</h2>
                <p className="text-sm text-gray-500">Define job requirements for AI-powered candidate matching</p>
            </div>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
              <input 
                type="text" required value={title} onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow bg-white text-gray-900 placeholder-gray-400"
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type (Optional)</label>
                    <div className="relative">
                        <select 
                            value={type} onChange={e => setType(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location (Optional)</label>
                    <div className="relative">
                        <input 
                            type="text" value={location} onChange={e => setLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 placeholder-gray-400"
                            placeholder="e.g. New York, Remote"
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level (Optional)</label>
                    <div className="relative">
                        <select 
                            value={experience} onChange={e => setExperience(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900"
                        >
                            <option value="Entry Level">Entry Level</option>
                            <option value="Junior">Junior</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                            <option value="Executive">Executive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BrainCircuit size={18} className="text-brand-600" />
                      System Generated Criteria & Skills
                  </label>
                  <button 
                    type="button"
                    onClick={handleGenerateSkills}
                    disabled={isGeneratingSkills || !title}
                    className="text-brand-600 text-sm font-medium flex items-center gap-1.5 hover:text-brand-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white px-3 py-1.5 rounded-lg shadow-sm border border-brand-200 hover:shadow transition-all"
                  >
                    {isGeneratingSkills ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    {isGeneratingSkills ? 'Generating...' : 'Generate Criteria'}
                  </button>
              </div>

              <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={currentSkill} 
                    onChange={e => setCurrentSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Add a specific skill manually (Defaults to weight 10)..."
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-sm"
                  >
                    Add
                  </button>
              </div>
              
              {skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {skills.map((item, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-brand-300 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-gray-800 text-sm">{item.skill}</span>
                                  <button type="button" onClick={() => removeSkill(item.skill)} className="text-gray-400 hover:text-red-500 p-1">
                                      <X size={14} />
                                  </button>
                              </div>
                              <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                      <input 
                                        type="range" 
                                        min="1" 
                                        max="10" 
                                        value={item.weight} 
                                        onChange={(e) => handleWeightChange(item.skill, e.target.value)}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                      />
                                  </div>
                                  <input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    value={item.weight} 
                                    onChange={(e) => handleWeightChange(item.skill, e.target.value)}
                                    className={`w-12 h-9 text-center border rounded-lg font-bold text-sm focus:ring-2 outline-none transition-colors ${getWeightColor(item.weight)}`}
                                  />
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-6 text-gray-400 text-sm italic">
                      No criteria added. Click "Generate Criteria" or add skills manually.
                  </div>
              )}
            </div>

            {/* Description */}
            <div>
               <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Description (Optional)</label>
                <button 
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDesc || (!title && skills.length === 0)}
                  className="text-brand-600 text-sm font-medium flex items-center gap-1.5 hover:text-brand-800 disabled:opacity-50 disabled:cursor-not-allowed bg-brand-50 px-3 py-1 rounded-full transition-colors border border-brand-100"
                >
                  {isGeneratingDesc ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  {isGeneratingDesc ? 'Generating...' : 'Generate with AI'}
                </button>
               </div>
               <textarea 
                 value={description} onChange={e => setDescription(e.target.value)}
                 className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 leading-relaxed resize-y bg-white text-gray-900 placeholder-gray-400"
                 placeholder="Brief job description..."
               />
            </div>
            
            {/* AI Interview Settings */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <label className="block text-sm font-bold text-blue-900 flex items-center gap-2">
                            <MessageSquare size={18} className="text-blue-600" />
                            AI Interview Configuration
                        </label>
                        <p className="text-xs text-blue-600 mt-1">Configure focus areas and questions for the automated Interview Room</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={handleGenerateFocusAreas}
                            disabled={isGeneratingFocus || !description}
                            className="text-blue-600 text-xs font-bold flex items-center gap-1.5 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm"
                        >
                            {isGeneratingFocus ? <Loader2 size={12} className="animate-spin" /> : <Target size={12} />}
                            Generate Focus Areas
                        </button>
                        <button 
                            type="button"
                            onClick={handleGenerateQuestions}
                            disabled={isGeneratingQuestions || !description}
                            className="text-white text-xs font-bold flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                        >
                            {isGeneratingQuestions ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                            Quick Generate
                        </button>
                    </div>
                </div>

                {/* Focus Areas */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 block">Focus Areas (Question Types)</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {focusAreas.map((area, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-blue-800 text-sm font-medium shadow-sm group">
                                {area}
                                <button type="button" onClick={() => handleGenerateQuestionsByFocus(area)} title="Generate questions for this area" className="text-blue-400 hover:text-blue-600">
                                    <Zap size={12} />
                                </button>
                                <button type="button" onClick={() => setFocusAreas(focusAreas.filter(f => f !== area))} className="text-gray-300 hover:text-red-400">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-blue-200">
                            <input 
                                className="text-sm border-none focus:ring-0 w-24 p-0 text-gray-900 bg-transparent" 
                                placeholder="Add Type..." 
                                value={newFocusArea}
                                onChange={e => setNewFocusArea(e.target.value)}
                                onKeyDown={e => {
                                    if(e.key === 'Enter' && newFocusArea.trim()) {
                                        e.preventDefault();
                                        setFocusAreas([...focusAreas, newFocusArea.trim()]);
                                        setNewFocusArea('');
                                    }
                                }}
                            />
                            <button type="button" onClick={() => {if(newFocusArea.trim()) { setFocusAreas([...focusAreas, newFocusArea.trim()]); setNewFocusArea(''); }}} className="text-blue-600">
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Questions List */}
                <div className="space-y-3">
                    {questions.map((q, i) => (
                        <div key={q.id} className="bg-white p-3 rounded-lg border border-blue-100 flex gap-3 items-start shadow-sm group hover:border-blue-300 transition-colors">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5">{i + 1}</span>
                            <div className="flex-1">
                                <textarea
                                    value={q.text}
                                    onChange={(e) => {
                                        const newQ = [...questions];
                                        newQ[i].text = e.target.value;
                                        setQuestions(newQ);
                                    }}
                                    className="w-full text-sm border border-gray-100 focus:border-blue-300 focus:ring-1 focus:ring-blue-200 p-2 rounded-md resize-none text-gray-900 bg-white placeholder-gray-400 transition-all"
                                    rows={2}
                                    placeholder="Enter interview question..."
                                />
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">{q.type}</span>
                                    {q.focusArea && <span className="text-[10px] bg-purple-50 text-purple-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">{q.focusArea}</span>}
                                </div>
                            </div>
                            <button type="button" onClick={() => setQuestions(questions.filter(qi => qi.id !== q.id))} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        type="button"
                        onClick={() => setQuestions([...questions, { id: Date.now().toString(), text: "New Question", type: 'general' }])}
                        className="w-full py-2.5 border border-dashed border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Custom Question
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button 
                type="button" onClick={handleCancel}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all hover:shadow active:transform active:scale-95"
              >
                {editingId ? 'Update Job Criteria' : 'Create Job Criteria'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-brand-200 transition-colors">
            <div className="flex-1">
              <div className="flex items-start justify-between md:justify-start md:items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                <div className="flex gap-2">
                    {job.type && <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{job.type}</span>}
                    {job.experienceLevel && <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-medium">{job.experienceLevel}</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                 {job.department && <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>}
                 {job.location && <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>}
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {(job.weightedSkills || job.requiredSkills.map(s => ({skill: s, weight: 10}))).slice(0, 5).map((ws, i) => (
                  <span key={i} className={`text-xs px-2.5 py-1 rounded-md font-medium border ${getWeightColor(ws.weight)}`}>
                    {ws.skill} <span className="opacity-60 ml-0.5">({ws.weight})</span>
                  </span>
                ))}
                {(job.weightedSkills?.length || job.requiredSkills.length) > 5 && (
                   <span className="text-xs text-gray-500 px-1 self-center">+{(job.weightedSkills?.length || job.requiredSkills.length) - 5} more</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button 
                onClick={() => handleEditJob(job)}
                className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Edit Job"
              >
                <Pencil size={20} />
              </button>
              <button 
                onClick={() => onDeleteJob(job.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Job"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
