
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, InterviewQuestion, Candidate } from '../types';

// Properly initialize the Google GenAI client using process.env.API_KEY
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeResumeWithGemini = async (
  resumeText: string,
  jobDescription: string
): Promise<AIAnalysisResult> => {
  if (!ai) {
    return {
      score: 50,
      summary: "AI analysis not available - API key not configured",
      contactDetails: { name: "", email: "", phone: "", location: "", linkedin: "" },
      pros: [],
      cons: [],
      experienceRating: "Unknown",
      skillsAnalysis: [],
      recommendedAction: "Keep on File"
    };
  }
  // Use gemini-1.5-flash for complex reasoning tasks like candidate matching
  const prompt = `
    You are an expert Technical Recruiter and HR Specialist.
    Analyze the following resume text against the provided job description.
    
    TASKS:
    1. Extract the candidate's contact information (Name, Email, Phone, Location, LinkedIn) from the resume text accurately.
    2. Analyze the fit for the job description.
    3. Score the candidate from 0 to 100.
    
    Note: The resume text is raw extraction. Ignore artifacts/whitespace.

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME TEXT:
    ${resumeText}

    Provide a strict JSON response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "A score from 0 to 100 indicating fit." },
            summary: { type: Type.STRING, description: "A brief summary of the candidate's suitability." },
            contactDetails: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING }
              }
            },
            pros: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of key strengths." 
            },
            cons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of potential weaknesses or gaps." 
          },
          experienceRating: { 
            type: Type.STRING, 
            description: "Assessed level: Junior, Mid, Senior, or Expert." 
          },
          skillsAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                present: { type: Type.BOOLEAN },
                relevance: { type: Type.STRING }
              }
            }
          },
          recommendedAction: {
            type: Type.STRING,
            enum: ["Interview", "Keep on File", "Reject"]
          }
        }
      }
    }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      score: 0,
      summary: "Analysis failed or API key missing. Please check configuration.",
      pros: [],
      cons: ["System error during analysis"],
      experienceRating: "Unknown",
      skillsAnalysis: [],
      recommendedAction: "Keep on File"
    };
  }
};

export const generateJobDescription = async (title: string, keywords: string[]): Promise<string> => {
  if (!ai) return "AI generation not available - API key not configured";
    try {
        // Simple text generation task using gemini-1.5-flash
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: `Write a professional job description for a "${title}". Include these keywords: ${keywords.join(', ')}. Keep it under 200 words.`
        });
        return response.text || "Could not generate description.";
    } catch (e) {
        console.error(e);
        return "Error generating description.";
    }
}

export const generateWeightedSkills = async (title: string): Promise<{ skill: string; weight: number }[]> => {
  if (!ai) return [];
  const prompt = `
    Generate a list of 6-10 key technical and soft skills for a "${title}" role.
    Assign a relevance weight from 1 to 10 for each skill (10 being mandatory/critical, 1 being nice-to-have).
    Return a strict JSON array of objects with "skill" (string) and "weight" (number) properties.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skill: { type: Type.STRING },
              weight: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    const text = response.text;
    if(!text) return [];
    return JSON.parse(text) as { skill: string; weight: number }[];
  } catch (e) {
    console.error("Error generating skills:", e);
    return [];
  }
};

export const generateInterviewFocusAreas = async (jobTitle: string, description: string): Promise<string[]> => {
  if (!ai) return ["Technical Skills", "Experience", "Cultural Fit"];
    const prompt = `
        Identify 3-5 key focus areas or question categories for interviewing a ${jobTitle}.
        Examples: "System Design", "Cultural Fit", "React Proficiency", "Problem Solving".
        Job Description Context: ${description.substring(0, 300)}...
        Return a strict JSON array of strings.
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return ["General", "Technical", "Behavioral"];
    }
}

export const generateQuestionsByFocus = async (jobTitle: string, focusArea: string): Promise<InterviewQuestion[]> => {
  if (!ai) return [{ id: "1", question: `Tell us about your experience with ${focusArea}.`, category: "Technical", difficulty: "Medium" }];
    const prompt = `
        Generate 2 specific interview questions for a ${jobTitle} related to the focus area: "${focusArea}".
        Return JSON array of objects with 'id' (random string), 'text', 'type' (use 'technical' or 'behavioral'), and 'focusArea' ("${focusArea}").
    `;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            type: { type: Type.STRING },
                            focusArea: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "[]");
    } catch (e) {
        return [];
    }
}

export const generateInterviewQuestions = async (jobTitle: string, description: string): Promise<InterviewQuestion[]> => {
  if (!ai) return [{ id: "1", question: "Tell us about yourself.", category: "Behavioral", difficulty: "Easy" }];
    const prompt = `
      Create 5 interview questions for a ${jobTitle} role.
      Job Description: ${description.substring(0, 500)}...
      
      Include a mix of Technical and Behavioral questions.
      Return strictly a JSON array of objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['technical', 'behavioral', 'general'] }
                        }
                    }
                }
            }
        });
        const text = response.text;
        if (!text) return [];
        return JSON.parse(text) as InterviewQuestion[];
    } catch (e) {
        console.error("Error generating interview questions", e);
        return [
            { id: '1', text: "Tell us about yourself.", type: 'general' },
            { id: '2', text: "Why do you want this job?", type: 'general' }
        ];
    }
}

export const generateEmailSubject = async (type: string, jobTitle: string, candidateName: string): Promise<string> => {
  if (!ai) return `Update regarding ${jobTitle}`;
    const prompt = `Generate a professional email subject line for a ${type} email to candidate ${candidateName} for the role of ${jobTitle}. Return just the string.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
             config: { responseMimeType: "text/plain" }
        });
        return response.text?.trim() || `Update regarding ${jobTitle}`;
    } catch (e) {
        return `Update regarding ${jobTitle}`;
    }
}

export const generateEmailBody = async (type: string, jobTitle: string, candidateName: string): Promise<string> => {
  if (!ai) return "Please contact us for an update.";
    const prompt = `Write a professional email body for a ${type} email to candidate ${candidateName} for the role of ${jobTitle}. Keep it concise and polite. Return just the string.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: { responseMimeType: "text/plain" }
        });
        return response.text?.trim() || "Please contact us for an update.";
    } catch (e) {
        return "Please contact us for an update.";
    }
}

export const generateEmailContent = async (type: 'invite' | 'reject' | 'offer', jobTitle: string, candidateName: string): Promise<{subject: string, body: string}> => {
    // Wrapper for backward compatibility or bulk generation
    const subject = await generateEmailSubject(type, jobTitle, candidateName);
    const body = await generateEmailBody(type, jobTitle, candidateName);
    return { subject, body };
}

export const compareCandidates = async (candidates: Candidate[], jobTitle: string): Promise<string> => {
  if (!ai) return "AI comparison not available - API key not configured";
    const candidatesData = candidates.map(c => `
      Candidate: ${c.name}
      Score: ${c.analysis?.score || 0}/100
      Summary: ${c.analysis?.summary}
      Strengths: ${c.analysis?.pros.join(', ')}
      Weaknesses: ${c.analysis?.cons.join(', ')}
    `).join('\n\n');

    const prompt = `
        Compare the following candidates for the role of ${jobTitle}.
        Provide a side-by-side analysis, highlighting who is better suited for specific aspects of the role.
        Conclude with a final recommendation.
        Use Markdown formatting.

        ${candidatesData}
    `;

    try {
        // Using gemini-1.5-flash for advanced reasoning and comparative analysis
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: prompt,
            config: { responseMimeType: "text/plain" }
        });
        return response.text || "Comparison unavailable.";
    } catch (e) {
        return "Error comparing candidates.";
    }
}
