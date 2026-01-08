
import { GoogleGenAI } from "@google/genai";
import { Mode } from "../types";

export const generateImage = async (prompt: string, mode: Mode): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let finalPrompt = "";
  if (mode === Mode.CITY_MAP) {
    // 简化 Prompt，侧重于视觉呈现，避免模型陷入纯文本回复
    finalPrompt = `Create a high-quality, professional hand-drawn style travel map of ${prompt}, China. 
    The illustration should include:
    1. Iconic landmarks of ${prompt} rendered in a warm, artistic sketch style.
    2. Small icons representing famous local foods and cultural items.
    3. A decorative traditional Chinese border with cloud patterns.
    4. Artistic handwritten Chinese titles for "${prompt} 旅游地图".
    5. Soft, vibrant watercolor color palette matching the city's character.
    The overall look should be like a premium printed souvenir map, 3:4 aspect ratio, clear and elegant.`;
  } else {
    finalPrompt = `A professional artistic process diagram of Chinese specialty: ${prompt}. 
    Rendered in traditional Chinese "Gongbi" and watercolor style. 
    The layout should show 5 key steps in an 'S' curve, each step with a small hand-drawn illustration and a short label.
    Include traditional patterns and city-specific architectural motifs in the border.
    3:4 aspect ratio, high resolution, museum quality.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: mode === Mode.CITY_MAP ? "3:4" : "1:1",
          imageSize: "1K"
        },
        // 仅在 Pro 模型中使用搜索工具增强准确性
        tools: [{ googleSearch: {} }]
      }
    });

    // 安全检查响应
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("模型未提供任何建议内容");
    }

    const parts = response.candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // 如果没有找到图像数据，但有文本数据，说明模型可能产生了误解
    const textResponse = parts.find(p => p.text)?.text;
    if (textResponse) {
      console.warn("Model returned text instead of image:", textResponse);
      throw new Error("画师未能完成绘图，仅提供了文字描述。请尝试简化您的输入。");
    }

    throw new Error("No image data found in response");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes("Requested entity was not found")) {
      throw new Error("KEY_RESET_REQUIRED");
    }
    console.error("Gemini Error:", error);
    throw error;
  }
};
