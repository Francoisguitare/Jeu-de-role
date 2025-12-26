import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateNpc = async (context: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère un PNJ (Personnage Non Joueur) pour un jeu de rôle médiéval fantastique. 
      Contexte optionnel: ${context}.
      Réponds UNIQUEMENT avec un objet JSON valide.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                maxPv: { type: Type.INTEGER },
                dex: { type: Type.INTEGER },
                iniBase: { type: Type.INTEGER }
              }
            },
            notes: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return null;
  }
};

export const generateScenarioHook = async (players: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Agis comme un Maître de Jeu expert. Donne une courte description d'ambiance (max 3 phrases) pour commencer une scène de combat ou d'exploration.
      Les personnages présents sont : ${players.join(', ')}.`,
      config: {
        maxOutputTokens: 150,
      }
    });
    return response.text || "Erreur de génération du scénario.";
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return "L'oracle est silencieux pour le moment.";
  }
};
