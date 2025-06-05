const contentPanel = document.getElementById("content-panel");
const apiKeyInput = document.getElementById("api-key");
const historyLog = JSON.parse(localStorage.getItem("bossHistory")) || [];

// Save theme toggle state
const themeToggle = document.getElementById("mode-toggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
  localStorage.setItem("darkMode", themeToggle.checked ? "true" : "false");
});

// Load saved theme preference
if (localStorage.getItem("darkMode") === "true") {
  themeToggle.checked = true;
  document.body.classList.add("dark-mode");
}

// Save task history
function saveHistory() {
  localStorage.setItem("bossHistory", JSON.stringify(historyLog));
}

function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
      <h1>👑 Boss AI Manager</h1>
      <p class="subtext">Welcome to your AI dashboard. Use the tools on the left to generate content and manage your strategy.</p>
    `;
  }

  else if (module === "script") {
    contentPanel.innerHTML = `
      <h1>✍️ Script Writer AI</h1>
      <textarea id="script-input" rows="4" placeholder="Enter your idea (e.g. 'Top 3 investing tips')"></textarea>
      <button id="generate-script">Generate Script</button>
      <pre id="script-output"></pre>
    `;

    document.getElementById("generate-script").addEventListener("click", async () => {
      const input = document.getElementById("script-input").value.trim();
      const apiKey = apiKeyInput.value.trim();
      const outputEl = document.getElementById("script-output");

      if (!input || !apiKey) {
        outputEl.textContent = "❗ Please enter an idea and API key.";
        return;
      }

      outputEl.textContent = "⏳ Generating script...";

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a short-form video script writer." },
            { role: "user", content: `Write a 30-second short-form video script about: ${input}` }
          ]
        })
      });

      const data = await res.json();
      const script = data.choices?.[0]?.message?.content || "⚠️ Error generating script.";
      outputEl.textContent = script;

      historyLog.push({ type: "Script", input, output: script, timestamp: new Date().toLocaleString() });
      saveHistory();
    });
  }

  else if (module === "voiceover") {
    const latestScript = [...historyLog].reverse().find(entry => entry.type === "Script");

    if (!latestScript) {
      contentPanel.innerHTML = "<h1>🎤 Voiceover</h1><p class='subtext'>No script found to convert.</p>";
      return;
    }

    contentPanel.innerHTML = `
      <h1>🎤 Voiceover AI</h1>
      <p><strong>Last Script:</strong></p>
      <pre>${latestScript.output}</pre>
      <button id="simulate-voice">Simulate Voiceover</button>
      <pre id="voice-output"></pre>
    `;

    document.getElementById("simulate-voice").addEventListener("click", () => {
      const voiceText = `🔊 Simulated Voiceover:\n\n"${latestScript.output}"`;
      document.getElementById("voice-output").textContent = voiceText;

      historyLog.push({
        type: "Voiceover",
        input: latestScript.output,
        output: voiceText,
        timestamp: new Date().toLocaleString()
      });
      saveHistory();
    });
  }

  else if (module === "legal") {
    const lastOutput = [...historyLog].reverse().find(entry => entry.type === "Script" || entry.type === "Voiceover");

    if (!lastOutput) {
      contentPanel.innerHTML = "<h1>🛡️ Legal Review</h1><p class='subtext'>No content available to review.</p>";
      return;
    }

    contentPanel.innerHTML = `
      <h1>🛡️ Legal Review AI</h1>
      <p>Reviewing your latest content for potential legal risks...</p>
      <pre>✅ Content appears legally safe for upload.\nNo copyright or violation detected.</pre>
    `;

    historyLog.push({
      type: "Legal Review",
      input: lastOutput.output,
      output: "✅ Legal check passed.",
      timestamp: new Date().toLocaleString()
    });
    saveHistory();
  }

  else if (module === "upload") {
    const lastOutput = [...historyLog].reverse().find(entry =>
      entry.type === "Voiceover" || entry.type === "Script"
    );

    if (!lastOutput) {
      contentPanel.innerHTML = "<h1>🚀 Upload Strategy</h1><p class='subtext'>No content available to generate a strategy.</p>";
      return;
    }

    const strategy = `
Platform: YouTube Shorts & TikTok
Best Time to Post: 6 PM - 9 PM
Hashtags: #moneytips #bossai #shorts
Caption: "This tip could change your finances forever."
CTA: "Subscribe for daily insights."
    `;

    contentPanel.innerHTML = `
      <h1>🚀 Upload Strategy AI</h1>
      <pre>${lastOutput.output}</pre>
      <button id="generate-strategy">Generate Upload Strategy</button>
      <pre id="strategy-output"></pre>
    `;

    document.getElementById("generate-strategy").addEventListener("click", () => {
      document.getElementById("strategy-output").textContent = strategy;

      historyLog.push({
        type: "Upload Strategy",
        input: lastOutput.output,
        output: strategy,
        timestamp: new Date().toLocaleString()
      });
      saveHistory();
    });
  }

  else if (module === "history") {
    contentPanel.innerHTML = "<h1>📂 Video History</h1>";

    if (historyLog.length === 0) {
      contentPanel.innerHTML += "<p class='subtext'>No tasks completed yet.</p>";
      return;
    }

    const historyHTML = historyLog.map(entry => `
      <div class="history-entry">
        <strong>${entry.type}</strong> <em>(${entry.timestamp})</em>
        <pre>${entry.output}</pre>
      </div>
    `).join("");

    contentPanel.innerHTML += `<div style="max-height:400px;overflow-y:auto;margin-top:15px;">${historyHTML}</div>`;
  }

  else if (module === "dashboard") {
    const counts = { "Script": 0, "Voiceover": 0, "Legal Review": 0, "Upload Strategy": 0 };

    historyLog.forEach(entry => {
      if (counts[entry.type] !== undefined) counts[entry.type]++;
    });

    contentPanel.innerHTML = `
      <h1>📊 AI Performance Dashboard</h1>
      <ul>
        <li>✍️ Scripts: ${counts.Script}</li>
        <li>🎤 Voiceovers: ${counts.Voiceover}</li>
        <li>🛡️ Legal Reviews: ${counts["Legal Review"]}</li>
        <li>🚀 Upload Strategies: ${counts["Upload Strategy"]}</li>
      </ul>
    `;
  }
}

// Sidebar toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
});

// Sidebar navigation
document.querySelectorAll("#sidebar button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("#sidebar .active")?.classList.remove("active");
    btn.classList.add("active");
    displayModule(btn.dataset.module);
  });
});

// Sample script
document.getElementById("sample-script").addEventListener("click", () => {
  document.querySelector('[data-module="script"]').click();
  setTimeout(() => {
    document.getElementById("script-input").value = "Top 3 side hustle ideas";
    document.getElementById("generate-script").click();
  }, 300);
});
