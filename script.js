const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("full");
});

const content = {
  manager: `<h2 style="color:#00bfff;">🤖 Manager AI</h2><p>This AI coordinates all tasks. Ready to execute.</p>`,
  legal: `<h2 style="color:#00bfff;">📜 Legal Review</h2><p>Checking content for compliance and copyright flags...</p>`,
  script: `
    <h2 style="color:#00bfff;">✍️ Script Writer AI</h2>
    <textarea id="script-input" placeholder="Enter your video idea..."></textarea>
    <div id="script-key-box"></div>
    <button class="generate-btn" onclick="generateScript()">Generate Script</button>
    <p id="script-output" style="margin-top:10px;"></p>
  `,
  voiceover: `
    <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
    <textarea id="voice-text" placeholder="Paste your script..."></textarea>
    <div id="key-entry"></div>
    <button class="generate-btn" onclick="generateVoice()">Generate Voiceover</button>
    <p id="voice-status" style="margin-top:10px;"></p>
  `,
  upload: `<h2 style="color:#00bfff;">📤 Upload Strategy</h2><textarea placeholder='Upload goals...'></textarea><br><button class="generate-btn">Optimize</button>`,
  output: `<h2 style="color:#00bfff;">📺 Final Output</h2><iframe width="100%" height="315" src="https://www.youtube.com/embed/fx1HgAG78qg" frameborder="0" allowfullscreen></iframe>`,
  history: `<h2 style="color:#00bfff;">🗂️ History</h2><ul><li>Script: “Passive Income”</li><li>Voiceover: “Crypto Tips”</li></ul>`,
  trends: `<h2 style="color:#00bfff;">📈 Trends AI</h2><ul class="trend-list"><li>#MakeMoneyOnline</li><li>#GPTBusiness</li><li>#BossAI</li></ul><button class="generate-btn" onclick="updateTrends()">🔄 Refresh</button>`,
  settings: `
    <h2 style="color:#00bfff;">⚙️ Settings</h2>
    <textarea placeholder="Preferences..."></textarea><br>
    <button class="generate-btn">Save</button>
    <br><br>
    <button class="generate-btn" onclick="logToSheet('Logger Test','Manual test','✅ Logged')">🧪 Run Logging Test</button>
  `
};

function updateTrends() {
  const list = document.querySelector(".trend-list");
  if (list) {
    list.innerHTML = `
      <li>#Crypto2025</li>
      <li>#ViralContent</li>
      <li>#OpenRouter</li>
    `;
  }
}

document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    const module = button.getAttribute("data-module");
    main.innerHTML = `<div style="max-width:800px;text-align:center">${content[module]}</div>`;

    if (module === "script") {
      const key = localStorage.getItem("openrouter_key");
      const box = document.getElementById("script-key-box");
      if (!key) {
        box.innerHTML = `
          <input id="script-key" type="password" placeholder="🔑 OpenRouter API Key"/>
          <button class="generate-btn" onclick="saveScriptKey()">Save Key</button>
        `;
      } else {
        box.innerHTML = `<p style="color: #0f0;">✅ Key saved. <button class="generate-btn" onclick="clearScriptKey()">Change</button></p>`;
      }
    }

    if (module === "voiceover") {
      const key = localStorage.getItem("elevenlabs_key");
      const box = document.getElementById("key-entry");
      if (!key) {
        box.innerHTML = `
          <input id="voice-key" type="password" placeholder="🔑 ElevenLabs Key"/>
          <button class="generate-btn" onclick="saveVoiceKey()">Save</button>
        `;
      } else {
        box.innerHTML = `<p style="color:#0f0;">✅ Key saved</p>`;
      }
    }
  });
});

function saveScriptKey() {
  const val = document.getElementById("script-key").value.trim();
  if (val.length > 10) {
    localStorage.setItem("openrouter_key", val);
    location.reload();
  }
}

function clearScriptKey() {
  localStorage.removeItem("openrouter_key");
  location.reload();
}

async function generateScript() {
  const key = localStorage.getItem("openrouter_key");
  const idea = document.getElementById("script-input").value.trim();
  const output = document.getElementById("script-output");
  if (!key || !idea) {
    output.innerHTML = `<span style="color:red;">❌ Missing input or key</span>`;
    return;
  }
  output.innerHTML = "🧠 Thinking...";
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You're a viral short-form script writer." },
          { role: "user", content: `Write a 30-second video script about: ${idea}` }
        ]
      })
    });
    const data = await res.json();
    if (!res.ok || !data.choices) throw new Error(data.error?.message || "OpenRouter error");
    const script = data.choices[0].message.content;
    output.innerHTML = script;

    logToSheet("Script", idea, script);
  } catch (err) {
    output.innerHTML = `<span style="color:red;">❌ ${err.message}</span>`;
  }
}

function saveVoiceKey() {
  const val = document.getElementById("voice-key").value.trim();
  if (val.length > 10) {
    localStorage.setItem("elevenlabs_key", val);
    location.reload();
  }
}

async function generateVoice() {
  const key = localStorage.getItem("elevenlabs_key");
  const text = document.getElementById("voice-text").value.trim();
  const status = document.getElementById("voice-status");
  if (!key || !text) {
    status.innerHTML = `<span style="color:red;">❌ Missing input or key</span>`;
    return;
  }
  status.innerHTML = "🔄 Generating voice...";
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB", {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: text })
    });
    if (!response.ok) throw new Error("API request failed");
    const blob = await response.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
    status.innerHTML = "✅ Voiceover playing";

    logToSheet("Voiceover", text, "Voiceover generated");
  } catch (err) {
    status.innerHTML = `<span style="color:red;">❌ ${err.message}</span>`;
  }
}

async function logToSheet(module, input, output) {
  try {
    await fetch("https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, input, output })
    });
    console.log("✅ Logged to Google Sheets");
  } catch (e) {
    console.error("❌ Logging failed:", e);
  }
}
