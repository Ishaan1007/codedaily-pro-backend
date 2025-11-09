import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // ✅ works fine with ESM

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 CodeDaily Pro Backend (Gemini AI) is Live!");
});

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
                  text: `Explain the topic "${topic}" in clear simple steps with three key points, one code example, and one practice question.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Print the raw Gemini response in Render logs
    console.log("🔍 Full Gemini response:", JSON.stringify(data, null, 2));

    let resultText = "No response from Gemini.";

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      resultText = data.candidates[0].content.parts[0].text;
    } else if (data?.error) {
      resultText = `Error: ${data.error.message}`;
    }

    res.json({ result: resultText });
    console.log("✅ AI Response Generated");
  } catch (error) {
    console.error("❌ Error connecting to Gemini API:", error);
    res.json({ result: "Error connecting to Gemini API." });
  }
});
