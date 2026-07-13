import DOMPurify from 'dompurify';

export interface ChatContext {
  role: 'fan' | 'volunteer' | 'organizer';
  location?: string;
  stadiumState?: any;
}

let lastCallTime = 0;
const API_COOLDOWN = 2000; // 2 seconds

// Fallback responses (Mock offline mode)
const fallbackResponses = {
  fan: ["Looks like the food stands are busy. Try the East concourse!", "Gate 2 is clear right now. Have a great match!", "You can find your seat in Sector B down this hallway."],
  volunteer: ["Please check Gate 3, crowd density is rising.", "Incident logged. Proceed to Sector A immediately.", "Medical team dispatched to your location."],
  organizer: ["Crowd flow is optimal. 85% capacity reached.", "Warning: Gate 4 wait times exceeding 15 mins.", "All systems normal. Revenue projection updated."]
};

export const generateAIResponse = async (prompt: string, context: ChatContext): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        context: context.stadiumState,
        mode: context.role
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return validateAIResponse(data.text || "I'm sorry, I couldn't process that.");
  } catch (error) {
    // Offline / Mock Fallback
    const mockArray = fallbackResponses[context.role] || fallbackResponses.fan;
    const randomMock = mockArray[Math.floor(Math.random() * mockArray.length)];
    return validateAIResponse(`[Offline Mode] ${randomMock}`);
  }
};

/**
 * Validates and sanitizes AI output before rendering
 */
export const validateAIResponse = (response: string): string => {
  if (!response || response.trim().length === 0) {
    return "I'm sorry, I didn't understand that.";
  }
  // Sanitize any potential HTML injection from the AI
  return DOMPurify.sanitize(response);
};
