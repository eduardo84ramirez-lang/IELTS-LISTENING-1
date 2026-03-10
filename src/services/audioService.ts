import { GoogleGenAI } from "@google/genai";

/**
 * Converts raw PCM data (16-bit, mono, 24kHz) to a playable WAV Blob URL.
 */
function pcmToWav(pcmBase64: string, sampleRate: number = 24000): string {
  const binaryString = atob(pcmBase64);
  const pcmData = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    pcmData[i] = binaryString.charCodeAt(i);
  }

  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  // file length
  view.setUint32(4, 36 + pcmData.length, true);
  // RIFF type
  view.setUint32(8, 0x57415645, false); // "WAVE"
  // format chunk identifier
  view.setUint32(12, 0x666d7420, false); // "fmt "
  // format chunk length
  view.setUint16(16, 16, true); // Wait, this should be 16 for PCM
  view.setUint16(16, 16, true); // Corrected: view.setUint32(16, 16, true);
  
  // Actually, let's do it properly:
  // 12: "fmt "
  // 16: chunk size (16)
  view.setUint32(16, 16, true);
  // 20: audio format (1 for PCM)
  view.setUint16(20, 1, true);
  // 22: num channels (1 for mono)
  view.setUint16(22, 1, true);
  // 24: sample rate
  view.setUint32(24, sampleRate, true);
  // 28: byte rate (sampleRate * numChannels * bitsPerSample/8)
  view.setUint32(28, sampleRate * 1 * 2, true);
  // 32: block align (numChannels * bitsPerSample/8)
  view.setUint16(32, 2, true);
  // 34: bits per sample
  view.setUint16(34, 16, true);
  // 36: "data"
  view.setUint32(36, 0x64617461, false);
  // 40: data length
  view.setUint32(40, pcmData.length, true);

  // write PCM data
  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export async function generateIeltsAudio(script: string, isMultiSpeaker: boolean, speakers?: { name: string; voice: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please ensure it is set in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const config: any = {
    responseModalities: ['AUDIO'],
  };

  const getAudio = async (useMultiSpeaker: boolean) => {
    const currentConfig = { ...config };
    if (useMultiSpeaker && speakers) {
      currentConfig.speechConfig = {
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
      currentConfig.speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      };
    }

    const prompt = useMultiSpeaker 
      ? `TTS the following conversation between the speakers. Make sure to distinguish their voices clearly:\n${script}`
      : `TTS the following text clearly and at a moderate pace for an IELTS listening test. Use a professional, academic tone:\n${script}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: currentConfig,
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("The model did not return any audio data.");
    }
    return base64Audio;
  };

  // Retry logic with fallback
  let lastError: any = null;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // On first attempt, try multi-speaker if requested. 
      // On subsequent attempts or if it fails, we might try single speaker as fallback.
      const useMulti = attempt === 0 ? isMultiSpeaker : false;
      const base64Audio = await getAudio(useMulti);
      return pcmToWav(base64Audio, 24000);
    } catch (error: any) {
      lastError = error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      
      // If it's a 500 error, wait a bit before retrying
      if (error.message?.includes('500') || error.message?.includes('INTERNAL')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }

  console.error("Gemini TTS Final Error after retries:", lastError);
  throw new Error("The AI service is currently experiencing issues (500 Internal Error). Please try again in a few moments.");
}
