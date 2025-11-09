import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 CodeDaily Pro Backend (Gemini AI) is Live!");
});

// ✅ Main AI route
app.get("/api/explain", async (req, res) => {
  const topic = req.query.topic || "Variables in C";
  console.log(`🧠 API route hit with topic: ${topic}`);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Explain the topic "${topic}" in simple terms.
                  Format your answer as:
                  1. 🪄 Three key points.
                  2. 💻 One short beginner-friendly code example.
                  3. ❓ One practice question.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // 🧠 NEW: Add this log to see what Gemini sends back
    console.log("🔍 Gemini raw response:", JSON.stringify(data, null, 2));

    const resultText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    console.log("✅ AI Response Generated");
    res.json({ result: resultText });
  } catch (error) {
    console.error("❌ Error connecting to Gemini API:", error);
    res.json({ result: "Error connecting to Gemini API." });
  }
});
