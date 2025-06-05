const contentPanel = document.getElementById("content-panel");
const buttons = document.querySelectorAll("#sidebar button");
let historyLog = JSON.parse(localStorage.getItem("bossAIHistory") || "[]");

function saveHistory() {
  localStorage.setItem("bossAIHistory", JSON.stringify(historyLog));
}

// Handle module switching
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const module = btn.getAttribute("data-module");
    displayModule(module);
  });
});

function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
      <h1>Welcome to Boss AI</h1>
      <p class="subtext">Choose a module from the menu to get started.</p>
      <button id="sample-script" style="margin-top: 10px;">🎬 Try Sample Script</button>
    `;

    document.getElementById("sample-script").addEventListener("click", () => {
      document.querySelector('[data-module="script"]').click();
      setTimeout(() => {
        document.getElementById("script-input").value = "How to save money fast in your 20s";
        document.getElementById("generate-script").click();
      }, 300);
    });
  }

  else if (module === "script") {
    contentPanel.innerHTML = `
      <h1>✍️ Script Writer AI</h1>
      <textarea id="script-input" rows="4" placeholder="Enter your video topic or prompt..."></textarea>
      <button id="generate-script">Generate Script</button>
      <pre id="script-output"></pre>
    `;

    document.getElementById("generate-script").addEventListener("click", async () => {
      const prompt = document.getElementById("script-input").value;
      const apiKey = document.getElementById("api-key").value;
      const output = document.getElementById("script-output");

      if (!prompt || !apiKey) return alert("Please provide both a prompt and your API key.");

      output.textContent = "🧠 Generating script...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Write a short, viral video script for: ${prompt}` }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        const script = data.choices?.[0]?.message?.content || "⚠️ No script returned.";
        output.textContent = script;

        historyLog.push({
          type: "Script",
          input: prompt,
          output: script,
          timestamp: new Date().toLocaleString()
        });
        saveHistory();
      } catch (err) {
        output.textContent = "❌ Error generating script.";
      }
    });
  }

  else if (module === "history") {
    let content = "<h1>📂 Video History Log</h1>";
    if (historyLog.length === 0) {
      content += "<p class='subtext'>No content generated yet.</p>";
    } else {
      content += historyLog.slice().reverse().map(entry => `
        <div style="border:1px solid #ddd;padding:16px;margin-bottom:16px;border-radius:8px;background:#fefefe;">
          <p><strong>🗂️ ${entry.type}</strong> <span style="color:#888;font-size:13px;">(${entry.timestamp})</span></p>
          <p><strong>Input:</strong> ${entry.input}</p>
          <div style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px;margin-top:10px;">
            ${entry.output}
          </div>
        </div>
      `).join('');
    }
    contentPanel.innerHTML = content;
  }

  else if (module === "dashboard") {
    const counts = {
      Script: 0,
      Voiceover: 0,
      "Upload Strategy": 0,
      "Legal Review": 0,
      Manager: 1
    };

    historyLog.forEach(entry => {
      if (counts[entry.type] !== undefined) {
        counts[entry.type]++;
      }
    });

    contentPanel.innerHTML = `
      <h1>📊 AI Performance Dashboard</h1>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 20px;">
        ${Object.entries(counts).map(([type, count]) => `
          <div style="border: 1px solid #ccc; border-radius: 10px; padding: 20px; background: #fefefe; text-align: center;">
            <h3>${type}</h3>
            <p style="font-size: 24px; margin: 8px 0;"><strong>${count}</strong></p>
            <p style="color: #666; font-size: 13px;">uses</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Sidebar toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});

// Dark/light mode toggle
document.getElementById("mode-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});
