const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt missing' });

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ result: completion.data.choices[0].message.content });
  } catch (err) {
    console.error('Error:', err.message || err);
    res.status(500).json({ error: 'OpenAI API call failed' });
  }
});

app.get('/', (req, res) => {
  res.send('Boss AI server is running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
