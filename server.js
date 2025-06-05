const contentPanel = document.getElementById("content-panel");
const buttons = document.querySelectorAll("#sidebar button");
const historyLog = [];

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
    `;
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
      } catch (err) {
        output.textContent = "❌ Error generating script.";
      }
    });
  }

  else if (module === "voiceover") {
    contentPanel.innerHTML = `
      <h1>🎤 Voiceover (Simulated)</h1>
      <p class="subtext">This module will simulate a voiceover using text only for now.</p>
      <textarea id="voice-input" rows="4" placeholder="Paste script for voiceover..."></textarea>
      <button id="simulate-voice">Simulate Voice</button>
      <pre id="voice-output"></pre>
    `;

    document.getElementById("simulate-voice").addEventListener("click", () => {
      const text = document.getElementById("voice-input").value.trim();
      const output = document.getElementById("voice-output");
      if (!text) return alert("Please paste a script.");
      output.textContent = `🔊 Simulating voiceover...\n\n"${text}"`;
      historyLog.push({
        type: "Voiceover",
        input: text,
        output: text,
        timestamp: new Date().toLocaleString()
      });
    });
  }

  else if (module === "upload") {
    contentPanel.innerHTML = `
      <h1>📤 Upload Strategy AI</h1>
      <textarea id="upload-script" rows="4" placeholder="Paste your final script here..."></textarea>
      <button id="generate-upload">Generate Strategy</button>
      <pre id="upload-result"></pre>
    `;

    document.getElementById("generate-upload").addEventListener("click", async () => {
      const script = document.getElementById("upload-script").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("upload-result");

      if (!script || !apiKey) return alert("Please provide both script and API key.");

      resultBox.textContent = "📤 Thinking...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Given this video script, suggest a title, 3 hashtags, and the best platform & time to upload:\n\n"${script}"`
            }],
            temperature: 0.6
          })
        });

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
        resultBox.textContent = result;

        historyLog.push({
          type: "Upload Strategy",
          input: script,
          output: result,
          timestamp: new Date().toLocaleString()
        });
      } catch (err) {
        resultBox.textContent = "❌ Error generating strategy.";
      }
    });
  }

  else if (module === "legal") {
    contentPanel.innerHTML = `
      <h1>📜 Legal AI Review</h1>
      <textarea id="legal-script" rows="5" placeholder="Paste script here for legal review..."></textarea>
      <button id="run-legal-review">Run Legal Review</button>
      <div id="legal-result"></div>
    `;

    document.getElementById("run-legal-review").addEventListener("click", async () => {
      const script = document.getElementById("legal-script").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("legal-result");

      if (!script || !apiKey) {
        resultBox.innerHTML = `<p style="color:red;">❗ Please enter a script and API key.</p>`;
        return;
      }

      resultBox.innerHTML = `<p>🔎 Reviewing script for legal risks...</p>`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Review this script for legal issues like copyright, defamation, false claims, or offensive content:\n\n"${script}"`
            }],
            temperature: 0.5
          })
        });

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content || "⚠️ No response.";
        resultBox.innerHTML = `<pre>${result}</pre>`;

        historyLog.push({
          type: "Legal Review",
          input: script,
          output: result,
          timestamp: new Date().toLocaleString()
        });
      } catch (err) {
        resultBox.innerHTML = `<p style="color:red;">❌ Legal review failed. Check your API key.</p>`;
      }
    });
  }

  else if (module === "history") {
    let content = `<h1>📂 Video History Log</h1>`;

    if (historyLog.length === 0) {
      content += `<p class="subtext">No content generated yet.</p>`;
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
}

// Sidebar toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});

// Dark/light mode toggle
document.getElementById("mode-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});
