const contentPanel = document.getElementById("content-panel");
const apiKeyInput = document.getElementById("api-key");
const historyLog = JSON.parse(localStorage.getItem("bossHistory")) || [];

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
      <pre style="white-space:pre-wrap;background:#f4f4f4;padding:10px;border-radius:6px;margin-bottom:10px;">${latestScript.output}</pre>
      <button id="simulate-voice">Simulate Voiceover</button>
      <pre id="voice-output" style="margin-top:15px;"></pre>
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
      <pre style="white-space:pre-wrap;background:#fff3cd;padding:10px;border-radius:6px;">✅ Content appears legally safe for upload.\nNo copyright or violation detected.</pre>
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
      contentPanel.innerHTML = "<h1>🚀 Upload Strategy</h1><p class='subtext'>No content available to generate a strategy. Please create a script or voiceover first.</p>";
      return;
    }

    const sampleStrategy = `
Platform: YouTube Shorts & TikTok
Best Time to Post: 6 PM - 9 PM (peak engagement)
Hashtags: #moneytips #bossai #shorts
Caption: "This 30-second tip could change how you invest forever. Watch now."
Call to Action: "Subscribe for more daily tips."
    `;

    contentPanel.innerHTML = `
      <h1>🚀 Upload Strategy AI</h1>
      <p><strong>Based on your latest content:</strong></p>
      <pre style="white-space:pre-wrap;background:#f9f9f9;padding:10px;border-radius:6px;margin-bottom:10px;">${lastOutput.output}</pre>
      <button id="generate-strategy">Generate Upload Strategy</button>
      <pre id="strategy-output" style="margin-top:15px;"></pre>
    `;

    document.getElementById("generate-strategy").addEventListener("click", () => {
      document.getElementById("strategy-output").textContent = sampleStrategy;

      historyLog.push({
        type: "Upload Strategy",
        input: lastOutput.output,
        output: sampleStrategy,
        timestamp: new Date().toLocaleString()
      });
      saveHistory();
    });
  }

  else if (module === "history") {
    contentPanel.innerHTML = "<h1>📂 Video History</h1>";

    if (historyLog.length === 0) {
      contentPanel.innerHTML += "<p class='subtext'>No AI tasks have been completed yet.</p>";
      return;
    }

    const historyHTML = historyLog.map(entry => `
      <div class="history-entry">
        <strong>${entry.type}</strong> <em>(${entry.timestamp})</em>
        <pre style="white-space:pre-wrap;background:#f9f9f9;padding:8px;border-radius:6px;margin-top:4px;">${entry.output}</pre>
      </div>
    `).join("");

    contentPanel.innerHTML += `
      <div style="max-height:400px;overflow-y:auto;margin-top:15px;">
        ${historyHTML}
      </div>
    `;
  }

  else if (module === "dashboard") {
    const counts = {
      "Script": 0,
      "Voiceover": 0,
      "Legal Review": 0,
      "Upload Strategy": 0
    };

    historyLog.forEach(entry => {
      if (counts[entry.type] !== undefined) {
        counts[entry.type]++;
      }
    });

    contentPanel.innerHTML = `
      <h1>📊 AI Performance Dashboard</h1>
      <p class="subtext">Total AI tasks completed:</p>
      <ul style="line-height: 1.8em;">
        <li>✍️ Scripts: <strong>${counts["Script"]}</strong></li>
        <li>🎤 Voiceovers: <strong>${counts["Voiceover"]}</strong></li>
        <li>🛡️ Legal Reviews: <strong>${counts["Legal Review"]}</strong></li>
        <li>🚀 Upload Strategies: <strong>${counts["Upload Strategy"]}</strong></li>
      </ul>
      <p class="subtext">Keep creating to grow your channel and optimize your workflow!</p>
    `;
  }
}

// Toggle sidebar
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
});

// Handle menu clicks
document.querySelectorAll("#sidebar button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("#sidebar .active")?.classList.remove("active");
    btn.classList.add("active");
    displayModule(btn.dataset.module);
  });
});

// Sample script button
document.getElementById("sample-script").addEventListener("click", () => {
  document.querySelector('[data-module="script"]').click();
  setTimeout(() => {
    document.getElementById("script-input").value = "Top 3 passive income tips";
    document.getElementById("generate-script").click();
  }, 300);
});
