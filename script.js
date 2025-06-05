const contentPanel = document.getElementById("content-panel");
const sidebarButtons = document.querySelectorAll("#sidebar button");
const toggleBtn = document.getElementById("toggle-btn");
const modeToggle = document.getElementById("mode-toggle");
const historyLog = JSON.parse(localStorage.getItem("historyLog")) || [];

function saveHistory() {
  localStorage.setItem("historyLog", JSON.stringify(historyLog));
}

toggleBtn.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});

modeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});

sidebarButtons.forEach(button => {
  button.addEventListener("click", () => {
    sidebarButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayModule(button.getAttribute("data-module"));
  });
});

document.getElementById("sample-script").addEventListener("click", () => {
  document.querySelector('[data-module="script"]').click();
  setTimeout(() => {
    runScriptAI("How to save money fast in your 20s");
  }, 300);
});

function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
      <h1>👑 Boss AI Manager</h1>
      <p>This is your command center. Use the sidebar to activate AI tools.</p>
      <button id="sample-script">🎬 Try Sample Script</button>
    `;
    document.getElementById("sample-script").addEventListener("click", () => {
      document.querySelector('[data-module="script"]').click();
      setTimeout(() => runScriptAI("How to save money fast in your 20s"), 300);
    });
  }

  else if (module === "script") {
    contentPanel.innerHTML = `
      <h1>✍️ Script Writer AI</h1>
      <input type="text" id="prompt" placeholder="Enter your video idea..." />
      <button id="run-script">Generate Script</button>
      <pre id="script-output"></pre>
    `;

    document.getElementById("run-script").addEventListener("click", () => {
      const prompt = document.getElementById("prompt").value.trim();
      if (prompt) runScriptAI(prompt);
    });
  }

  else if (module === "legal") {
    const latestScript = [...historyLog].reverse().find(entry => entry.type === "Script");
    if (!latestScript) {
      contentPanel.innerHTML = "<h1>🛡️ Legal Review</h1><p class='subtext'>No script available for review.</p>";
      return;
    }

    contentPanel.innerHTML = `
      <h1>🛡️ Legal Review AI</h1>
      <pre style="white-space:pre-wrap;background:#f4f4f4;padding:10px;">${latestScript.output}</pre>
      <button id="run-legal-check">Run Legal Check</button>
      <pre id="legal-output"></pre>
    `;

    document.getElementById("run-legal-check").addEventListener("click", async () => {
      const apiKey = document.getElementById("api-key").value;
      const output = document.getElementById("legal-output");
      if (!apiKey) return alert("Please enter your OpenAI API key.");
      output.textContent = "🔍 Reviewing for legal risks...";

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Analyze the following video script for any potential copyright issues, risky claims, or platform policy violations. Be brief and only flag actual risks:\n\n"${latestScript.output}"`
            }],
            temperature: 0.4
          })
        });
        const data = await res.json();
        const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
        output.textContent = result;

        historyLog.push({ type: "Legal Review", input: latestScript.output, output: result, timestamp: new Date().toLocaleString() });
        saveHistory();
      } catch {
        output.textContent = "❌ Error running legal review.";
      }
    });
  }

  else if (module === "upload") {
    const latestScript = [...historyLog].reverse().find(entry => entry.type === "Script");
    if (!latestScript) {
      contentPanel.innerHTML = "<h1>🚀 Upload Strategy</h1><p class='subtext'>No script found to generate strategy.</p>";
      return;
    }

    contentPanel.innerHTML = `
      <h1>🚀 Upload Strategy AI</h1>
      <pre style="white-space:pre-wrap;background:#f4f4f4;padding:10px;">${latestScript.output}</pre>
      <button id="run-upload-strategy">Generate Upload Plan</button>
      <pre id="upload-output"></pre>
    `;

    document.getElementById("run-upload-strategy").addEventListener("click", async () => {
      const apiKey = document.getElementById("api-key").value;
      const output = document.getElementById("upload-output");
      if (!apiKey) return alert("Please enter your OpenAI API key.");
      output.textContent = "📈 Analyzing script for upload strategy...";

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Based on this video script, generate a short social media upload plan:\n\nScript:\n"${latestScript.output}"\n\nInclude:\n- Suggested title\n- Ideal platforms (YouTube Shorts, TikTok, Reels)\n- Best post time\n- 3–5 relevant hashtags\n- Target audience summary`
            }],
            temperature: 0.7
          })
        });
        const data = await res.json();
        const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
        output.textContent = result;

        historyLog.push({ type: "Upload Strategy", input: latestScript.output, output: result, timestamp: new Date().toLocaleString() });
        saveHistory();
      } catch {
        output.textContent = "❌ Error generating upload strategy.";
      }
    });
  }

  else if (module === "history") {
    const historyHTML = historyLog.length
      ? historyLog.map(entry => `
        <div class="history-entry">
          <strong>${entry.type}</strong> <em>${entry.timestamp}</em>
          <details><summary>View</summary><pre>${entry.output}</pre></details>
        </div>
      `).join("")
      : "<p>No history yet.</p>";
    contentPanel.innerHTML = `<h1>📂 Video History</h1>${historyHTML}`;
  }

  else if (module === "dashboard") {
    const counts = {};
    historyLog.forEach(entry => counts[entry.type] = (counts[entry.type] || 0) + 1);
    const statsHTML = Object.entries(counts).map(([type, count]) =>
      `<li><strong>${type}</strong>: ${count}</li>`).join("");
    contentPanel.innerHTML = `<h1>📊 AI Performance</h1><ul>${statsHTML || "<li>No usage data yet.</li>"}</ul>`;
  }
}

async function runScriptAI(prompt) {
  const apiKey = document.getElementById("api-key").value;
  const output = document.getElementById("script-output");
  if (!apiKey) return alert("Please enter your OpenAI API key.");
  output.textContent = "✍️ Generating script...";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a short-form video script about: ${prompt}` }],
        temperature: 0.7
      })
    });
    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
    output.textContent = result;

    historyLog.push({ type: "Script", input: prompt, output: result, timestamp: new Date().toLocaleString() });
    saveHistory();
  } catch {
    output.textContent = "❌ Error generating script.";
  }
}

displayModule("manager");
