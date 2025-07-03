// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to test connection
app.get('/', (req, res) => {
  res.send('✅ Boss AI backend is live and connected.');
});

// GitHub Commit Endpoint
app.post('/commit', (req, res) => {
  const { message, content, filepath } = req.body;
  if (!message || !content || !filepath) {
    return res.status(400).json({ error: 'Missing commit data.' });
  }

  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, filepath);

  // Write content to file
  fs.writeFileSync(filePath, content);

  // Commit & push changes
  exec(`git add ${filepath} && git commit -m "${message}" && git push`, (err, stdout, stderr) => {
    if (err) {
      console.error('Git Error:', stderr);
      return res.status(500).json({ error: 'Git commit failed', stderr });
    }
    res.json({ success: true, stdout });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Boss AI server running on http://localhost:${PORT}`);
});
