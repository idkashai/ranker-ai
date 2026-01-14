
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { Candidate, JobCriteria } from '../types';

// Handle ESM default export wrapping for PDF.js
const pdfjs = pdfjsLib.default || pdfjsLib;

// --- FILE EXTRACTION UTILS ---

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPDF(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else {
      return `[Format not supported for full text extraction: ${fileType}. Filename: ${fileName}]`;
    }
  } catch (error) {
    console.error("Error extraction text:", error);
    return `[Error extracting text from file: ${error}]`;
  }
};

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Use the unwrapped pdfjs object
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // @ts-ignore
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

// --- CSV DOWNLOAD UTILS ---

export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Build CSV string
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => headers.map(fieldName => {
      let val = row[fieldName] !== undefined ? row[fieldName] : '';
      // Escape quotes and wrap in quotes if contains comma or newline
      val = String(val).replace(/"/g, '""'); 
      if (val.search(/("|,|\n)/g) >= 0) {
        val = `"${val}"`;
      }
      return val;
    }).join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportRawDataToCSV = (candidates: Candidate[], jobs: JobCriteria[]) => {
    const data = candidates.map(c => {
        const job = jobs.find(j => j.id === c.jobId);
        return {
            'ID': c.id,
            'Name': c.name,
            'Email': c.email,
            'Filename': c.fileName,
            'Job Profile': c.jobId === 'general' ? 'General Pool' : (job?.title || 'Unknown'),
            'Upload Date': new Date(c.uploadDate).toLocaleDateString(),
            'Status': c.status,
            'Raw Extracted Text': c.resumeText.substring(0, 3000) // Limit length for CSV sanity
        };
    });
    downloadCSV(data, `resume_uploads_raw_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportAnalysisToCSV = (candidates: Candidate[], jobs: JobCriteria[]) => {
    const analyzedCandidates = candidates.filter(c => c.analysis); // Only export analyzed
    
    const data = analyzedCandidates.map(c => {
        const job = jobs.find(j => j.id === c.jobId);
        return {
            'Rank Score': ((c.analysis?.score || 0) / 10).toFixed(1),
            'Candidate Name': c.name,
            'Job Profile': job?.title || 'General',
            'Email': c.analysis?.contactDetails?.email || c.email,
            'Phone': c.analysis?.contactDetails?.phone || '',
            'Location': c.analysis?.contactDetails?.location || '',
            'Selection Status': c.selectionStatus || 'Pending',
            'Experience Rating': c.analysis?.experienceRating || 'N/A',
            'AI Summary': c.analysis?.summary || '',
            'Strengths': c.analysis?.pros?.join('; ') || '',
            'Weaknesses': c.analysis?.cons?.join('; ') || '',
            'Matched Skills': c.analysis?.skillsAnalysis?.filter((s: any) => s.present).map((s: any) => s.skill).join(', ') || '',
            'Recommended Action': c.analysis?.recommendedAction || ''
        };
    });
    downloadCSV(data, `analysis_report_${new Date().toISOString().split('T')[0]}.csv`);
}
