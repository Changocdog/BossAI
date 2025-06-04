const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Default homepage
app.get("/", (req, res) => {
  res.send("Boss AI server is running.");
});

// 🚀 POST /api/generate
app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003", // Use a model available to your key
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
    });

    const result = response.data.choices[0].text.trim();
    res.json({ output: result });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server is live on port ${PORT}`);
});
