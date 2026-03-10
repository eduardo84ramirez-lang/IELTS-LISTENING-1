import { GoogleGenAI, Modality } from "@google/genai";

export async function generateIeltsAudio(script: string, isMultiSpeaker: boolean, speakers?: { name: string; voice: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const config: any = {
    responseModalities: [Modality.AUDIO],
  };

  if (isMultiSpeaker && speakers) {
    config.speechConfig = {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: speakers.map(s => ({
          speaker: s.name,
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: s.voice }
          }
        }))
      }
    };
  } else {
    config.speechConfig = {
      voiceConfig: {
        prebuiltVoiceConfig: { voiceName: 'Zephyr' },
      },
    };
  }

  const prompt = isMultiSpeaker 
    ? `TTS the following conversation:\n${script}`
    : `TTS the following text clearly and at a moderate pace for an IELTS listening test:\n${script}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: config,
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Failed to generate audio");
  }

  return `data:audio/mp3;base64,${base64Audio}`;
}
