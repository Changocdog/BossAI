const buttons = document.querySelectorAll(".sidebar button[data-module]");
const contentPanel = document.getElementById("content-panel");

const historyLog = []; // Global log array

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayModule(button.dataset.module);
  });
});

function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
      <h1>👑 Boss AI Dashboard</h1>
      <p class="subtext">Use the tools in the sidebar to generate content and manage uploads.</p>
      <ul class="status-list">
        <li>✅ Script Writer AI</li>
        <li>✅ Voiceover AI</li>
        <li>✅ Upload Strategy AI</li>
        <li>✅ Legal Review AI</li>
        <li>✅ Output Log</li>
      </ul>
    `;
  }

  else if (module === "script") {
    contentPanel.innerHTML = `
      <h1>✍️ Script Writer AI</h1>
      <textarea id="script-input" rows="4" placeholder="Video topic..." style="width:100%;padding:12px;"></textarea>
      <button id="generate-script">Generate Script</button>
      <div id="script-result" style="margin-top:20px;"></div>
    `;

    document.getElementById("generate-script").addEventListener("click", async () => {
      const prompt = document.getElementById("script-input").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("script-result");

      if (!prompt || !apiKey) {
        resultBox.innerHTML = `<p style="color:red;">Missing input or key.</p>`;
        return;
      }

      resultBox.innerHTML = `⏳ Generating...`;

      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Write a YouTube Shorts script: ${prompt}` }],
            temperature: 0.8
          })
        });

        const data = await res.json();
        const script = data.choices?.[0]?.message?.content || "No output.";
        resultBox.innerHTML = `<pre>${script}</pre>`;

        historyLog.push({
          type: "Script",
          input: prompt,
          output: script,
          timestamp: new Date().toLocaleString()
        });
      } catch {
        resultBox.innerHTML = `<p style="color:red;">API error.</p>`;
      }
    });
  }

  else if (module === "voiceover") {
    contentPanel.innerHTML = `
      <h1>🎤 Voiceover AI</h1>
      <textarea id="voice-script" rows="5" placeholder="Paste your script..." style="width:100%;padding:12px;"></textarea>
      <button id="generate-voiceover">Generate Voiceover</button>
      <div id="voiceover-result" style="margin-top:20px;"></div>
    `;

    document.getElementById("generate-voiceover").addEventListener("click", () => {
      const script = document.getElementById("voice-script").value.trim();
      const resultBox = document.getElementById("voiceover-result");

      if (!script) {
        resultBox.innerHTML = `<p style="color:red;">Enter script.</p>`;
        return;
      }

      resultBox.innerHTML = `
        <p>✅ Simulated voiceover ready.</p>
        <button style="padding:10px;">🔊 Play (Simulated)</button>
        <p style="font-size:12px;">* Upgrade to real voice API later.</p>
      `;
    });
  }

  else if (module === "upload") {
    contentPanel.innerHTML = `
      <h1>📤 Upload Strategy AI</h1>
      <textarea id="upload-script" rows="5" placeholder="Paste your script..." style="width:100%;padding:12px;"></textarea>
      <button id="generate-upload">Generate Upload Strategy</button>
      <div id="upload-result" style="margin-top:20px;"></div>
    `;

    document.getElementById("generate-upload").addEventListener("click", async () => {
      const script = document.getElementById("upload-script").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("upload-result");

      if (!script || !apiKey) {
        resultBox.innerHTML = `<p style="color:red;">Missing input or key.</p>`;
        return;
      }

      resultBox.innerHTML = `⏳ Generating strategy...`;

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
              content: `Give me platform, title, 3 hashtags, post time, and reasoning for this script:\n\n${script}`
            }],
            temperature: 0.7
          })
        });

        const data = await res.json();
        const result = data.choices?.[0]?.message?.content || "No output.";
        resultBox.innerHTML = `<pre>${result}</pre>`;

        historyLog.push({
          type: "Upload Strategy",
          input: script,
          output: result,
          timestamp: new Date().toLocaleString()
        });
      } catch {
        resultBox.innerHTML = `<p style="color:red;">API error.</p>`;
      }
    });
  }

  else if (module === "legal") {
    contentPanel.innerHTML = `
      <h1>📜 Legal Review AI</h1>
      <textarea id="legal-script" rows="5" placeholder="Paste your script..." style="width:100%;padding:12px;"></textarea>
      <button id="run-legal-review">Run Legal Review</button>
      <div id="legal-result" style="margin-top:20px;"></div>
    `;

    document.getElementById("run-legal-review").addEventListener("click", async () => {
      const script = document.getElementById("legal-script").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("legal-result");

      if (!script || !apiKey) {
        resultBox.innerHTML = `<p style="color:red;">Missing input or key.</p>`;
        return;
      }

      resultBox.innerHTML = `🔍 Reviewing script...`;

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
              content: `Check this script for copyright, defamation, unsafe content:\n\n${script}`
            }],
            temperature: 0.6
          })
        });

        const data = await res.json();
        const result = data.choices?.[0]?.message?.content || "No output.";
        resultBox.innerHTML = `<pre>${result}</pre>`;

        historyLog.push({
          type: "Legal Review",
          input: script,
          output: result,
          timestamp: new Date().toLocaleString()
        });
      } catch {
        resultBox.innerHTML = `<p style="color:red;">API error.</p>`;
      }
    });
  }

  else if (module === "history") {
    let content = `<h1>📂 Video History Log</h1>`;
    if (historyLog.length === 0) {
      content += `<p>No content yet.</p>`;
    } else {
      content += historyLog.slice().reverse().map(entry => `
        <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px;border-radius:6px;">
          <p><strong>${entry.type}</strong> – <em>${entry.timestamp}</em></p>
          <p><strong>Input:</strong> ${entry.input}</p>
          <pre style="background:#f8f8f8;padding:10px;border-radius:4px;">${entry.output}</pre>
        </div>
      `).join('');
    }
    contentPanel.innerHTML = content;
  }
}

document.getElementById("toggle-btn").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("hidden");
  main.style.marginLeft = sidebar.classList.contains("hidden") ? "0" : "240px";
});
