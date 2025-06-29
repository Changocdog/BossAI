// server.js
const express = require("express");
const { commitToGitHub } = require("./github-commit");

const app = express();
app.use(express.json());

// GitHub Commit Endpoint
app.post("/commit", async (req, res) => {
  const { filePath, content, message } = req.body;

  if (!filePath || !content || !message) {
    return res.status(400).json({ error: "Missing filePath, content, or message" });
  }

  try {
    const result = await commitToGitHub({ filePath, content, message });
    res.json({ success: true, url: result.commit?.html_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root Test Endpoint
app.get("/", (req, res) => {
  res.send("✅ Boss AI Manager backend is running");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});