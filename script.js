// Sidebar panel switching
document.querySelectorAll('.sidebar button').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Load corresponding module content
    const module = button.dataset.module;
    loadModule(module);
  });
});

// Sidebar toggle
document.getElementById('toggle-btn').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('hidden');
});

// Module templates
const modules = {
  manager: `
    <h2>🤖 General Manager AI</h2>
    <p>This AI coordinates all tools and oversees automation.</p>
  `,
  legal: `
    <h2>📜 Legal Review</h2>
    <p>Reviewing content for compliance...</p>
  `,
  script: `
    <h2>✍️ Script Writer</h2>
    <input id="script-input" type="text" placeholder="Enter video topic..." />
    <button id="generate-btn">Generate Video</button>
    <pre id="script-output">Awaiting input...</pre>
  `,
  voiceover: `
    <h2>🎤 Voiceover AI</h2>
    <button>Simulate Voiceover</button>
  `,
  upload: `
    <h2>📤 Upload Strategy</h2>
    <p>Auto-schedule and optimize video posts (coming soon).</p>
  `,
  output: `
    <h2>📺 Final Output</h2>
    <p>Final generated videos will appear here.</p>
  `,
  history: `
    <h2>🗂️ History</h2>
    <p>Past scripts and output logs will be listed here.</p>
  `,
  settings: `
    <h2>⚙️ Settings</h2>
    <p>Theme, preferences, and user configurations go here.</p>
  `
};

// Load initial module
loadModule("manager");

// Load and render a module into the panel
function loadModule(name) {
  const panel = document.getElementById('content-panel');
  panel.innerHTML = modules[name] || "<p>Module not found.</p>";

  // Re-bind script button logic if needed
  if (name === "script") {
    const keyInput = document.getElementById('api-key');
    document.getElementById('generate-btn').addEventListener('click', async () => {
      const topic = document.getElementById('script-input').value;
      const output = document.getElementById('script-output');
      const apiKey = keyInput.value;

      if (!topic || !apiKey) {
        output.textContent = "❗ Enter topic and API key.";
        return;
      }

      output.textContent = "⏳ Generating...";

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Write a short-form video script about: ${topic}` }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        const script = data.choices?.[0]?.message?.content || "⚠️ No response.";
        output.textContent = script;
      } catch (error) {
        output.textContent = "❌ Error generating script.";
        console.error(error);
      }
    });
  }
}
