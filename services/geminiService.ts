import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const polishContent = async (text: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert copy editor. Please proofread, format, and improve the flow of the following text for a professional product or blog post. Keep the HTML/Markdown structure minimal but effective. Text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};

export const generateReportInsight = async (reportName: string, data: any): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate insights.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following JSON data for a "${reportName}" and provide a brief, 2-sentence executive summary of the key trend or insight. Data: ${JSON.stringify(data)}`,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate insight due to an error.";
  }
};