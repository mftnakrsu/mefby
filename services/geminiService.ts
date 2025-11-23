import { GoogleGenAI, GenerateContentResponse } from "@google/genai/web";
import { PROFILE, SERVICES, EXPERIENCE, PROJECTS, SKILLS, CLIENTS } from '../constants';

let ai: GoogleGenAI | null = null;

// Vite uses import.meta.env for environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("GEMINI_API_KEY environment variable is missing. Gemini features will be disabled.");
}

// Construct a context string based on the constants
const buildContext = () => {
  return `
    You are the personal AI assistant for the brand "Mefby", founded by ${PROFILE.owner}.
    Meftun Akarsu is an experienced Engineer currently pursuing an M.Sc. in Autonomous Systems at TH Ingolstadt, Germany, and working as a Data Scientist at Bosch.
    
    Your Goal: Professionaly showcase Meftun's technical expertise, achievements, and the solutions Mefby offers to visitors.

    Key Achievements (Highlight these):
    - Reduced stock levels by 30% at Bosch by optimizing manufacturing throughput.
    - Saved €30K/year by reducing destructive testing using Computer Vision.
    - Conducted R&D on Digital Twins and Autonomous Systems at TAI (Turkish Aerospace).
    - Developed AI Agents and Booking systems as a freelancer.

    Profile:
    ${PROFILE.bio}
    Title: ${PROFILE.title}
    Location: ${PROFILE.location}
    Contact: ${PROFILE.email} (Direct job offers here).
    
    Services:
    ${SERVICES.map(s => `- ${s.title}: ${s.description}`).join("\n")}
    
    References/Companies:
    ${CLIENTS.map(c => `- ${c.name} (${c.industry})`).join("\n")}

    Experience:
    ${EXPERIENCE.map(e => `- ${e.role} @ ${e.company} (${e.period}): ${e.description}`).join("\n")}
    
    Projects:
    ${PROJECTS.map(p => `- ${p.title}: ${p.description} (Tech Stack: ${p.tags.join(', ')})`).join("\n")}
    
    Skills:
    ${SKILLS.map(s => `${s.subject} (${s.A}%)`).join(", ")}
    
    Behavioral Rules:
    1. Keep responses concise, professional, and engaging.
    2. Speak in English (unless the user speaks Turkish, then switch to Turkish).
    3. Know that Meftun has an Electronics Engineering background but works as an AI Engineer / Data Scientist.
    4. If asked about projects, demonstrate deep technical understanding (YOLO, RAG, LLM, ROS, etc.).
  `;
};

export const sendMessageToGemini = async (userMessage: string): Promise<string> => {
  if (!ai) {
    return "Sorry, AI services are currently unavailable (Missing API Key).";
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: buildContext(),
      }
    });

    return response.text || "An error occurred, please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I cannot respond right now. Please try again later.";
  }
};