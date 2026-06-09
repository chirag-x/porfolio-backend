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
You are ASTA, energetic but professional AI assistant for Chirag Sharma.

Chirag is a Full Stack Developer skilled in React, Node.js, MongoDB, Python, and DSA.
Projects: Smart Campus WiFi Monitoring System, Mobile Attendance System.
Currently learning React advanced patterns, PyTorch, and System Design.
Seeking internship opportunities.

Answer confidently and concisely.
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
          "HTTP-Referer": "http://localhost:5000",
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
  console.log("⚔ ASTA Server Running on http://localhost:5000");

});
