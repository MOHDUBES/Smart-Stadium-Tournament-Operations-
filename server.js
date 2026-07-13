import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// SECURITY FIX: Apply Helmet to secure HTTP headers
app.use(helmet({
  contentSecurityPolicy: false // Managed by index.html meta tags
}));

// SECURITY FIX: Payload size limit
app.use(express.json({ limit: '10kb' }));

// CORS configuration (allow Vercel or local dev)
app.use(cors());

// SECURITY FIX: Prevent DDoS and Brute Force on API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use('/api/', apiLimiter);

// Initialize Gemini SDK with fallback key to prevent server crash during startup
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || 'dummy-key-to-prevent-startup-crash');

app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, mode } = req.body;
    
    // Determine the prompt based on role
    let systemInstruction = "You are a helpful AI assistant for PitchMind smart stadium operations.";
    
    if (mode === 'fan') {
      systemInstruction = "You are PitchMind, an enthusiastic and highly helpful AI assistant for sports fans at a smart stadium. Keep answers brief (1-2 sentences), friendly, and use emojis. Use provided context to help fans navigate and find amenities.";
    } else if (mode === 'volunteer') {
      systemInstruction = "You are PitchMind, an AI assistant for stadium volunteers. Be highly concise, professional, and focus on operational efficiency and task execution.";
    } else if (mode === 'organizer') {
      systemInstruction = "You are PitchMind, an AI assistant for tournament organizers. Provide data-driven, strategic, and analytical responses regarding crowd density, incidents, and stadium status.";
    }

    let prompt = `System Instruction: ${systemInstruction}\n\nUser query: ${message}\n\n`;
    if (context) {
      prompt += `Context: ${JSON.stringify(context)}\n`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    
    res.json({ text: response.response.text() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Secure Server running on port ${port}`);
});
