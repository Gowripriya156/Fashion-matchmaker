
import { GoogleGenAI, Type } from "@google/genai";
import { Suggestion } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL like "data:image/jpeg;base64,..."
      // we only want the base64 part
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getFashionMatches = async (file: File, userPrompt: string, occasion: string): Promise<Suggestion[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const base64Data = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    };

    const occasionInstruction = (occasion && occasion.toLowerCase() !== 'any')
        ? ` The suggestions should be specifically tailored for a "${occasion}" occasion.`
        : '';

    const systemPrompt = `You are a world-class fashion stylist. Your task is to analyze the user-provided image of a dress and suggest matching items based on their request. 
    For each suggestion, provide a concise name for the item, a detailed description, and a compelling reason why it's a perfect match with the dress in the image. 
    Focus on color theory, style harmony, occasion appropriateness, and current trends.${occasionInstruction}`;

    const userContent = {
        parts: [
            imagePart,
            { text: `Please suggest matches for the following: ${userPrompt}` }
        ]
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [ {role: 'user', parts: userContent.parts}],
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                description: "A list of fashion suggestions.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: 'The name of the suggested item (e.g., "Classic Gold Hoops").',
                    },
                    description: {
                      type: Type.STRING,
                      description: 'A detailed description of the suggested item.',
                    },
                    reasoning: {
                      type: Type.STRING,
                      description: 'A compelling reason why this item matches the dress.',
                    },
                  },
                  required: ["name", "description", "reasoning"],
                },
            },
        },
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }
    try {
        return JSON.parse(responseText.trim()) as Suggestion[];
    } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("The response from the AI was not in the expected format. Please try again.");
    }
};

export const visualizeOutfit = async (file: File, suggestions: Suggestion[]): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const base64Data = await fileToBase64(file);
    const imagePart = {
      inlineData: {
        mimeType: file.type,
        data: base64Data,
      },
    };

    const accessoriesText = suggestions.map(s => s.name).join(', ');
    const textPrompt = `Based on the provided dress image, generate a new image showcasing a complete outfit. The outfit should include the dress from the image, accessorized with: ${accessoriesText}. Present this as a "shop the look" or "style board" image, clean and visually appealing.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: textPrompt },
            ],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageString: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageString}`;
        }
    }
    
    throw new Error("Could not find an image in the AI's response.");
};
