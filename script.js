// Toggle sidebar visibility
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("hidden");
});

// Module content definitions
const modules = {
  manager: `
    <h2>🤖 General Manager AI</h2>
    <p>This AI coordinates the sub-AIs and manages workflows.</p>
  `,
  legal: `
    <h2>📜 Legal Review</h2>
    <p>Scanning generated content for compliance...</p>
  `,
  script: `
    <h2>✍️ Script Writer AI</h2>
    <input id="script-input" type="text" placeholder="Enter video topic..." />
    <button id="generate-btn">Generate Script</button>
    <pre id="script-output">Your script will appear here.</pre>
  `,
  voiceover: `
    <h2>🎤 Voiceover</h2>
    <p>Coming soon: audio narration features.</p>
  `,
  upload: `
    <h2>📤 Upload Strategy</h2>
    <p>Tools for posting to YouTube, TikTok, and more.</p>
  `,
  output: `
    <h2>📺 Final Output</h2>
    <p>View or download generated videos here.</p>
  `,
  history: `
    <h2>🗂️ History</h2>
    <p>List of past video ideas, scripts, and uploads.</p>
  `,
  settings: `
    <h2>⚙️ Settings</h2>
    <p>Theme preferences and saved keys will go here.</p>
  `
};

// Sidebar button switching
document.querySelectorAll(".sidebar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Set active state
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Load content
    const module = btn.getAttribute("data-module");
    loadModule(module);
  });
});

// Initial load
loadModule("manager");

// Load module content into main panel
function loadModule(name) {
  const panel = document.getElementById("content-panel");
  panel.innerHTML = modules[name] || "<p>Module not found.</p>";

  // Attach Script Generator
  if (name === "script") {
    const generateBtn = document.getElementById("generate-btn");
    generateBtn?.addEventListener("click", async () => {
      const topic = document.getElementById("script-input").value;
      const apiKey = document.getElementById("api-key").value;
      const output = document.getElementById("script-output");

      if (!topic || !apiKey) {
        output.textContent = "❗ Please enter a topic and API key.";
        return;
      }

      output.textContent = "⏳ Generating script...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "user", content: `Write a short, engaging YouTube short script about: ${topic}` }
            ],
            temperature: 0.7
          })
        });

        const data = await response.json();
        output.textContent = data.choices?.[0]?.message?.content || "⚠️ No script returned.";
      } catch (err) {
        output.textContent = "❌ Error generating script.";
        console.error(err);
      }
    });
  }
}
