
import React, { useState, useRef } from 'react';
import { Candidate, JobCriteria, AnalysisStatus } from '../types';
import { UploadCloud, FileText, X, Search, Filter, FolderUp, FileUp, Trash2, AlertCircle, Briefcase, Download, Loader2 } from 'lucide-react';
import { extractTextFromFile, exportRawDataToCSV, fileToBase64 } from '../services/utils';

interface ResumeProcessingProps {
  jobs: JobCriteria[];
  candidates: Candidate[];
  onUpload: (files: File[], jobId: string, texts: string[], fileDataList?: {data: string | null, type: string}[]) => void;
  onDeleteCandidate: (id: string) => void;
}

export const ResumeProcessing: React.FC<ResumeProcessingProps> = ({ jobs, candidates, onUpload, onDeleteCandidate }) => {
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    if (!selectedJobId) {
      alert("Please select a job profile or General Pool first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    const fileArray = Array.from(files);
    const extractedTexts: string[] = [];
    const fileDataList: {data: string | null, type: string}[] = [];

    try {
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            
            // Extract text regardless of size
            const text = await extractTextFromFile(file);
            extractedTexts.push(text);
            
            // Handle File Storage (Max 400KB)
            if (file.size <= 400 * 1024) {
                try {
                    const base64 = await fileToBase64(file);
                    fileDataList.push({ data: base64, type: file.type });
                } catch (e) {
                    console.warn(`Failed to convert file ${file.name} to Base64`);
                    fileDataList.push({ data: null, type: file.type });
                }
            } else {
                // File too large, store null
                fileDataList.push({ data: null, type: file.type });
            }

            setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
        }

        onUpload(fileArray, selectedJobId, extractedTexts, fileDataList);
    } catch (error) {
        console.error("Upload processing error:", error);
        alert("Some files could not be processed. Please try again.");
    } finally {
        setIsUploading(false);
        setDragActive(false);
        setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!selectedJobId) {
        alert("Please select a job profile or General Pool first.");
        return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleDownloadCSV = () => {
      exportRawDataToCSV(candidates, jobs);
  }

  // Filter Logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesJob = !selectedJobId || selectedJobId === 'general' ? true : c.jobId === selectedJobId;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Resume Upload & Management</h1>
            <p className="text-gray-500">Upload and manage candidate resumes. Data is extracted automatically.</p>
        </div>
        {candidates.length > 0 && (
            <button 
                onClick={handleDownloadCSV}
                className="text-brand-600 hover:text-brand-800 text-sm font-bold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
            >
                <Download size={18} />
                Download CSV Data
            </button>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Bulk Resume Upload</h2>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                    Upload multiple resumes. Supports PDF, DOCX, and TXT. 
                    Text is extracted locally in your browser.
                </p>
            </div>
            
            <div className="w-full md:w-72">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Assign to Job Profile
                </label>
                <div className="relative">
                    <select 
                        value={selectedJobId} 
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className={`
                            w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all appearance-none font-medium
                            ${!selectedJobId ? 'border-red-300 text-gray-500' : 'border-gray-200 text-gray-900'}
                        `}
                    >
                        <option value="" disabled>Select a job...</option>
                        <option value="general" className="font-semibold text-brand-600 bg-brand-50">General Pool (Unassigned)</option>
                        <option disabled className="text-gray-300">──────────</option>
                        {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
        </div>

        <div 
            className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out group
                ${dragActive 
                    ? 'border-brand-500 bg-brand-50/50 scale-[1.01]' 
                    : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50/30'}
                ${!selectedJobId ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => selectedJobId && !isUploading && fileInputRef.current?.click()}
        >
            <div className="flex flex-col items-center pointer-events-none">
                <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
                    ${dragActive ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-500'}
                `}>
                    {isUploading ? <Loader2 size={32} className="animate-spin text-brand-600" /> : <UploadCloud size={32} />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isUploading ? `Processing Files... ${uploadProgress}%` : 'Drop your resume files here'}
                </h3>
                <p className="text-gray-500 mb-6">
                    {isUploading ? 'Extracting text for analysis' : 'or click to browse and select files'}
                </p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Supports PDF, DOCX, TXT files
                </p>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
             <button 
                onClick={() => selectedJobId && fileInputRef.current?.click()}
                disabled={!selectedJobId || isUploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-95"
             >
                <FileUp size={18} /> 
                Select Files
             </button>
             <button 
                onClick={() => selectedJobId && folderInputRef.current?.click()}
                disabled={!selectedJobId || isUploading}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
             >
                <FolderUp size={18} /> 
                Select Folder
             </button>
        </div>
        
        {/* Hidden Inputs */}
        <input 
            ref={fileInputRef} 
            type="file" 
            multiple 
            className="hidden" 
            onChange={handleChange} 
            accept=".pdf,.docx,.doc,.txt"
        />
        <input 
            ref={folderInputRef} 
            type="file" 
            // @ts-ignore
            webkitdirectory="" 
            // @ts-ignore
            directory="" 
            multiple 
            className="hidden" 
            onChange={handleChange} 
        />
      </div>

      {/* Recent Uploads Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Recent Uploads</h2>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {filteredCandidates.length}
                </span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search candidates..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none placeholder-gray-400"
                    />
                </div>
                <div className="relative">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-auto pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none text-gray-700 cursor-pointer"
                     >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ANALYZING">Analyzing</option>
                        <option value="COMPLETED">Completed</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
              {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                      <div key={candidate.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                                  <FileText size={20} />
                              </div>
                              <div>
                                  <h4 className="text-sm font-semibold text-gray-900">{candidate.name}</h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <span className="max-w-[150px] truncate" title={candidate.fileName}>{candidate.fileName}</span>
                                    <span>•</span>
                                    {candidate.jobId === 'general' ? (
                                        <span className="text-gray-500 font-medium italic bg-gray-100 px-1.5 rounded">General Pool</span>
                                    ) : (
                                        <span className="text-brand-600 font-medium">{jobs.find(j => j.id === candidate.jobId)?.title}</span>
                                    )}
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                              <span className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${candidate.status === AnalysisStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 
                                  candidate.status === AnalysisStatus.ANALYZING ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                                  'bg-gray-100 text-gray-600 border-gray-200'}
                              `}>
                                  {candidate.status === AnalysisStatus.COMPLETED && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>}
                                  {candidate.status === AnalysisStatus.ANALYZING && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
                                  {candidate.status}
                              </span>
                              
                              <button 
                                onClick={() => onDeleteCandidate(candidate.id)} 
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove Candidate"
                              >
                                  <Trash2 size={18} />
                              </button>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="py-16 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="text-gray-300" size={32} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Resumes Found</h3>
                      <p className="text-gray-500 max-w-sm mx-auto">
                        {searchQuery || filterStatus !== 'ALL' 
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Upload your first resume above to get started with AI-powered analysis."}
                      </p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
