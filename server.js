const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize with OpenAI v4 style
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🌐 Default route
app.get("/", (req, res) => {
  res.send("Boss AI server is running.");
});

// 🚀 /api/generate
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const output = chatResponse.choices[0].message.content.trim();
    res.json({ output });
  } catch (err) {
    console.error("❌ OpenAI Error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
