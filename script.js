// Sidebar switching
document.querySelectorAll('.sidebar button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const module = button.getAttribute('data-module');
    renderModuleContent(module);
  });
});

// Toggle sidebar visibility
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("full");
});

// Module renderer
function renderModuleContent(module) {
  const output = document.getElementById("main");
  const apiKeyInput = document.getElementById("api-key")?.value || "";

  const contentMap = {
    manager: `
      <h2 style="color:#00bfff;">🤖 Manager AI</h2>
      <p>This AI coordinates the sub-AIs and manages workflows.</p>
    `,
    legal: `
      <h2 style="color:#00bfff;">📜 Legal Review</h2>
      <p>Reviewing content for compliance...</p>
    `,
    script: `
      <h2 style="color:#00bfff;">✍️ Script Writer</h2>
      <input id="script-input" type="text" placeholder="Enter video topic..." style="margin: 10px 0; width: 100%; max-width: 400px; padding: 10px;"/>
      <button onclick="generateScript()">Generate Script</button>
      <pre id="script-output" style="margin-top: 20px;"></pre>
    `,
    voiceover: `
      <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
      <input id="voiceover-key" type="password" value="${apiKeyInput}" placeholder="Enter ElevenLabs API Key" style="margin: 10px 0; width: 100%; max-width: 400px; padding: 10px;"/>
      <button onclick="generateVoiceover()">Generate Voiceover</button>
      <pre id="voiceover-output" style="margin-top: 20px;">Voiceover generation in progress... (simulated)</pre>
    `,
    upload: `
      <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
      <p>Auto-schedule and optimize video posts.</p>
    `,
    output: `
      <h2 style="color:#00bfff;">📺 Final Output</h2>
      <p>Your rendered content will appear here.</p>
    `,
    history: `
      <h2 style="color:#00bfff;">🗂️ History</h2>
      <p>Review past scripts and outputs.</p>
    `,
    settings: `
      <h2 style="color:#00bfff;">⚙️ Settings</h2>
      <p>Configure preferences and integrations.</p>
    `
  };

  output.innerHTML = `
    <div style="max-width: 800px; text-align: center;">
      ${contentMap[module] || ""}
    </div>
  `;
}

// Script Generator
async function generateScript() {
  const input = document.getElementById('script-input').value;
  const key = document.getElementById('api-key').value;
  const output = document.getElementById('script-output');

  if (!input || !key) {
    output.textContent = '⚠️ Please enter a topic and your OpenAI API key.';
    return;
  }

  output.textContent = 'Generating script...';

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a short viral YouTube script about: ${input}` }],
        max_tokens: 300
      })
    });

    const data = await response.json();
    output.textContent = data.choices[0].message.content.trim();
  } catch (err) {
    output.textContent = "⚠️ Error: " + err.message;
  }
}

// Voiceover Generator
async function generateVoiceover() {
  const key = document.getElementById('voiceover-key').value;
  const output = document.getElementById('voiceover-output');
  const sample = "This is your Boss AI voiceover test script.";

  if (!key) {
    output.textContent = "⚠️ Please enter your ElevenLabs API key.";
    return;
  }

  output.textContent = "🎧 Generating voiceover...";

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/exAVnOWVOZtPPpB6CEQj", {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: sample,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    const audio = new Audio(audioURL);
    audio.play();
    output.textContent = "✅ Voiceover played successfully.";
  } catch (err) {
    output.textContent = "❌ Error: " + err.message;
  }
}
