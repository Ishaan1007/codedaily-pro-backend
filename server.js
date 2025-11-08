// server.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/explain", async (req, res) => {
  const topic = req.query.topic || "Variables in C";

  const prompt = `Explain the coding concept '${topic}' in simple terms.
Include 3 key points, one short example code snippet, and one short practice question.`;

  try {
    console.log("🔹 API route hit with topic:", topic);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response from AI";
    res.json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
