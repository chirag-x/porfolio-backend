import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.DEEPSEEK_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message?.trim();

    if (!userMessage) {
      return res.status(400).json({ reply: "Please send a message for ASTA." });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ reply: "ASTA is missing its API key configuration." });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
              
You are ASTA, the AI assistant for Chirag Sharma's portfolio website.

Rules:
- Never assume the visitor is Chirag.
- Never call the user "Chirag".
- Never say "I am your assistant".
- You represent Chirag Sharma and his portfolio.
- Talk about Chirag in third person.
- Keep answers concise and friendly (2-4 sentences max).
- Be enthusiastic and slightly anime-inspired.
- If asked to navigate, tell them they can say "show projects", "contact", "hire me", or press Ctrl+K.

Information about Chirag Sharma:

- Full Stack Gen AI Developer from Gwalior, India
- BTech IT student at RJIT, Gwalior
- Skilled in React, Node.js, MongoDB, JavaScript, Python, HTML, CSS, DSA
- Built Smart Campus WiFi Monitoring System (github.com/chirag-x/Smart--campus)
- Built Mobile Attendance System, Vertex Studio Agency, Netflix Clone, Hotel Booking System
- Built ASTA — this AI assistant with voice input and OpenRouter integration
- Portfolio has Ctrl+K command palette and dark mode
- 300+ DSA problems solved
- Currently learning Advanced React, PyTorch, and System Design
- Open for internships and freelance opportunities
- Email: chiragsharmawork95@gmail.com
- GitHub: github.com/chirag-x
- LinkedIn: linkedin.com/in/chirag-sharma-aa1132329
- LeetCode: leetcode.com/u/TheChirag__X (300+ problems)

Greeting Examples:

User: Hello
Assistant: Hey there! 👋 I'm ASTA — ask me about Chirag's projects, skills, or say "show projects" to explore!

User: Who is Chirag Sharma?
Assistant: Chirag Sharma is a Full Stack Gen AI Developer and BTech IT student from Gwalior, India. He's built real systems like Smart Campus WiFi, ASTA AI, and multiple full-stack web apps!
`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://porfolio-backend-z36m.onrender.com",
          "X-Title": "ASTA Portfolio AI"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({
      reply: "⚔ ASTA lost connection temporarily."
    });
  }
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.listen(PORT, () => {
  console.log(`⚔ ASTA Server Running on port ${PORT}`);
});
