// script.js

document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar button");
  const main = document.getElementById("main");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  });

  sidebarButtons.forEach(button => {
    button.addEventListener("click", () => {
      sidebarButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const module = button.dataset.module;
      renderModule(module);
    });
  });

  function renderModule(module) {
    main.innerHTML = "";

    if (module === "manager") {
      main.innerHTML = `
        <h2>🤖 Manager AI</h2>
        <textarea id="manager-input" placeholder="What do you want to generate today?"></textarea>
        <button class="generate-btn" onclick="runManager()">Run Manager AI</button>
        <div id="manager-output" style="margin-top:20px;"></div>
      `;
    }

    if (module === "script") {
      main.innerHTML = `
        <h2>✍️ Script Writer AI</h2>
        <textarea id="script-input" placeholder="Describe your video topic..."></textarea>
        <button class="generate-btn" onclick="runScript()">Generate Script</button>
        <div id="script-output" style="margin-top:20px;"></div>
      `;
    }

    if (module === "voiceover") {
      main.innerHTML = `
        <h2>🎤 Voiceover Generator</h2>
        <textarea id="voiceover-input" placeholder="Paste your script here..."></textarea>
        <button class="generate-btn" onclick="runVoiceover()">Generate Voiceover</button>
        <div id="voiceover-output" style="margin-top:20px;"></div>
      `;
    }

    if (module === "upload") {
      main.innerHTML = `
        <h2>📤 Upload Strategy AI</h2>
        <textarea id="upload-input" placeholder="Describe your content or title..."></textarea>
        <button class="generate-btn" onclick="runUpload()">Generate Upload Strategy</button>
        <div id="upload-output" style="margin-top:20px;"></div>
      `;
    }

    if (module === "legal") {
      main.innerHTML = `
        <h2>📜 Legal Review AI</h2>
        <textarea id="legal-input" placeholder="Paste content here for review..."></textarea>
        <button class="generate-btn" onclick="runLegal()">Run Legal Check</button>
        <div id="legal-output" style="margin-top:20px;"></div>
      `;
    }

    if (module === "output") {
      main.innerHTML = `
        <h2>📺 Final Output</h2>
        <p>Generated scripts, voiceovers, and strategies will appear here once complete.</p>
      `;
    }

    if (module === "history") {
      main.innerHTML = `
        <h2>🗂️ History</h2>
        <p>View your previously generated content here (coming soon).</p>
      `;
    }

    if (module === "trends") {
      main.innerHTML = `
        <h2>📈 Trends AI</h2>
        <p>Top trending video ideas (mocked):</p>
        <ul class="trend-list">
          <li>🔥 3 Habits That Made Me a Millionaire (In My 20s)</li>
          <li>🎯 AI Tools That Save You 10+ Hours a Week</li>
          <li>💡 2024 Passive Income Ideas You Haven’t Heard Of</li>
        </ul>
      `;
    }

    if (module === "settings") {
      main.innerHTML = `
        <h2>⚙️ Settings</h2>
        <p>Adjust preferences and API keys (coming soon).</p>
      `;
    }

    if (module === "sheets") {
      main.innerHTML = `
        <h2>📊 Sheets Log</h2>
        <p>Google Sheets logging currently inactive.</p>
      `;
    }
  }

  renderModule("manager"); // default load
});

// --- Module Logic ---
async function runManager() {
  const input = document.getElementById("manager-input").value;
  const output = document.getElementById("manager-output");
  output.innerHTML = "🧠 Thinking...";

  const reply = `🧠 Manager AI suggests: Let's generate a short video, then run a voiceover and upload strategy. Input was: "${input}"`;
  setTimeout(() => output.innerHTML = reply, 1000);
}

async function runScript() {
  const input = document.getElementById("script-input").value;
  const output = document.getElementById("script-output");
  output.innerHTML = "✍️ Generating script...";

  const reply = `Here's a short-form video script for: "${input}"\n\n[Intro Music]\nHook: Are you making this common mistake?\n[Scene cut to tip/explanation]\n[Outro call to action]`;
  setTimeout(() => output.innerHTML = reply, 1000);
}

async function runVoiceover() {
  const input = document.getElementById("voiceover-input").value;
  const output = document.getElementById("voiceover-output");
  output.innerHTML = "🎤 Generating voiceover...";

  setTimeout(() => output.innerHTML = `🎧 Voiceover generated (mock): "${input}"`, 1000);
}

async function runUpload() {
  const input = document.getElementById("upload-input").value;
  const output = document.getElementById("upload-output");
  output.innerHTML = "📤 Analyzing upload strategy...";

  const reply = `
    ✅ Platform: YouTube Shorts + TikTok  
    ⏰ Best Time: 6–9 PM (PST)  
    🔖 Hashtags: #motivation #success #bossAI  
    💬 Caption: “Start now, not later.”  
  `;
  setTimeout(() => output.innerHTML = reply, 1000);
}

async function runLegal() {
  const input = document.getElementById("legal-input").value;
  const output = document.getElementById("legal-output");
  output.innerHTML = "🔍 Scanning for issues...";

  const reply = `✅ No legal flags detected in content. Your input looks clear and compliant.`;
  setTimeout(() => output.innerHTML = reply, 1000);
}
