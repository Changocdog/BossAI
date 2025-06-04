const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  // Placeholder logic (we'll add OpenAI later)
  const fakeOutput = `🤖 AI generated response for: "${prompt}"`;

  res.json({ output: fakeOutput });
});

app.listen(PORT, () => {
  console.log(`Boss AI backend running on port ${PORT}`);
});
