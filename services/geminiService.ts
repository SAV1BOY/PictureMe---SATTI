
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getBase64Data = (base64StringWithPrefix: string): string => {
    return base64StringWithPrefix.split(',')[1];
}

export const generateImage = async (prompt: string, baseImage: string | null): Promise<string> => {
    try {
        const parts: any[] = [{ text: prompt }];
        if (baseImage) {
            parts.push({
                inlineData: {
                    mimeType: "image/png",
                    data: getBase64Data(baseImage)
                }
            });
        }
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: [{ parts }],
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }

        const safetyFeedback = response.promptFeedback;
        if (safetyFeedback?.blockReason) {
             throw new Error(`A geração de imagem foi bloqueada por razões de segurança: ${safetyFeedback.blockReason}. Tente um prompt diferente.`);
        }
        
        // If no image, check if there's a text response which might explain why.
        if (response.text) {
            // Sometimes the model provides a reason for not generating an image.
            throw new Error(`A API não retornou uma imagem. Resposta recebida: ${response.text}`);
        }

        throw new Error("A API não retornou uma imagem válida. Por favor, tente novamente.");

    } catch (error) {
        console.error("Error generating image with Gemini:", error);
        // Re-throw the error to be caught by the caller
        throw error;
    }
};

export const editImage = async (prompt: string, baseImage: string, maskImage: string): Promise<string> => {
    try {
        const parts = [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: getBase64Data(baseImage)
                }
            },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: getBase64Data(maskImage)
                }
            }
        ];

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: [{ parts }],
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }
        
        const safetyFeedback = response.promptFeedback;
        if (safetyFeedback?.blockReason) {
             throw new Error(`Edição de imagem bloqueada por razões de segurança: ${safetyFeedback.blockReason}. Tente um prompt diferente.`);
        }

        // If no image, check if there's a text response which might explain why.
        if (response.text) {
            throw new Error(`A API não retornou uma imagem editada. Resposta recebida: ${response.text}`);
        }

        throw new Error("A API não retornou uma imagem válida. Tente novamente.");

    } catch (error) {
        console.error("Error editing image with Gemini:", error);
        throw error;
    }
};


export const generateAlbumStyle = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        if (response.text) {
            return response.text;
        }

        throw new Error("Failed to generate a dynamic prompt style.");

    } catch (error) {
        console.error("Error generating album style with Gemini:", error);
        // Fallback style
        return "A retro 80s studio background with laser beams, neon geometric shapes, fog, and dramatic backlighting.";
    }
};
