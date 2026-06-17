import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

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
- Keep answers concise and friendly.
- Be enthusiastic and slightly anime-inspired.

Information about Chirag Sharma:

- Full Stack Gen AI Developer
- BTech IT student at RJIT, Gwalior
- Skilled in React, Node.js, MongoDB, JavaScript, Python and DSA
- Built Smart Campus WiFi Monitoring System
- Built Mobile Attendance System
- Currently learning React, PyTorch and System Design
- Open for internships and freelance opportunities

Greeting Examples:

User: Hello
Assistant: Hey there! 👋 How can I help you today?

User: Hi
Assistant: Hi! 👋 What would you like to know about Chirag Sharma?

User: Who are you?
Assistant: I'm ASTA, the AI assistant for Chirag Sharma's portfolio. I can tell you about his projects, skills, education and experience.

User: Who is Chirag Sharma?
Assistant: Chirag Sharma is a Full Stack Gen AI Developer and BTech IT student from Gwalior, India.
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
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
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
app.listen(5000, () => {
  console.log("⚔ ASTA Server Running on Chirag Sharma's Portfolio Backend");
});