const buttons = document.querySelectorAll(".sidebar button[data-module]");
const contentPanel = document.getElementById("content-panel");

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
      <p class="subtext">Welcome! Use the tools in the sidebar to generate scripts, voiceovers, and upload plans.</p>

      <h3>⚙️ Module Status</h3>
      <ul class="status-list">
        <li>✅ <strong>Script Writer AI</strong> — <span>Online</span></li>
        <li>✅ <strong>Upload Strategy AI</strong> — <span>Online</span></li>
        <li>✅ <strong>Voiceover Generator</strong> — <span>Simulated</span></li>
        <li>✅ <strong>Legal Review AI</strong> — <span>Enabled</span></li>
        <li>✅ <strong>History & Output Log</strong> — <span>Functional</span></li>
      </ul>

      <div class="emoji">🤖</div>
      <p class="subtext">Select a module from the sidebar to get started.</p>
    `;
  }

  else if (module === "script") {
    contentPanel.innerHTML = `
      <h1>✍️ Script Writer AI</h1>
      <p class="subtext">Describe your short-form video idea, and Boss AI will generate a viral script.</p>

      <textarea id="script-input" rows="4" placeholder="e.g. How to build credit as a student..." style="width:100%;padding:12px;font-size:15px;border-radius:8px;border:1px solid #ccc;"></textarea>
      <button id="generate-script" style="margin-top:10px;">Generate Script</button>

      <div id="script-result" style="margin-top:30px;"></div>
    `;

    document.getElementById("generate-script").addEventListener("click", async () => {
      const prompt = document.getElementById("script-input").value.trim();
      const apiKey = document.getElementById("api-key").value.trim();
      const resultBox = document.getElementById("script-result");

      if (!prompt || !apiKey) {
        resultBox.innerHTML = `<p style="color:red;">❗ Please enter a prompt and API key.</p>`;
        return;
      }

      resultBox.innerHTML = `<p>⏳ Generating script...</p>`;

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
              content: `Write a viral YouTube Shorts script for this topic: "${prompt}". Make it clear, engaging, and under 60 seconds.`
            }],
            temperature: 0.8
          })
        });

        const data = await response.json();
        const script = data.choices?.[0]?.message?.content || "⚠️ No response.";
        resultBox.innerHTML = `<div style="white-space:pre-wrap;padding:16px;background:#f9f9f9;border-radius:8px;border:1px solid #ddd;">${script}</div>`;
      } catch (err) {
        console.error(err);
        resultBox.innerHTML = `<p style="color:red;">❌ Failed to fetch script. Check your API key.</p>`;
      }
    });
  }

  else if (module === "voiceover") {
    contentPanel.innerHTML = `
      <h1>🎤 Voiceover AI</h1>
      <p class="subtext">Paste your script below. Boss AI will simulate voice output.</p>

      <textarea id="voice-script" rows="5" placeholder="Paste your video script here..." style="width:100%;padding:12px;font-size:15px;border-radius:8px;border:1px solid #ccc;"></textarea>
      <button id="generate-voiceover" style="margin-top:10px;">Generate Voiceover</button>

      <div id="voiceover-result" style="margin-top:30px;"></div>
    `;

    document.getElementById("generate-voiceover").addEventListener("click", () => {
      const script = document.getElementById("voice-script").value.trim();
      const resultBox = document.getElementById("voiceover-result");

      if (!script) {
        resultBox.innerHTML = `<p style="color:red;">❗ Please enter a script to simulate.</p>`;
        return;
      }

      resultBox.innerHTML = `
        <p>✅ Voiceover simulated!</p>
        <button style="padding:10px 18px;border-radius:6px;background:#007bff;color:#fff;border:none;font-weight:bold;cursor:pointer;">🔊 Play (Simulated)</button>
        <p style="color:#888;font-size:14px;margin-top:8px;">* This is a placeholder. Real voice output coming soon.</p>
      `;
    });
  }

  else {
    contentPanel.innerHTML = `<p class="subtext">🔧 ${module.charAt(0).toUpperCase() + module.slice(1)} Module – Coming Soon</p>`;
  }
}

// Sidebar toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("hidden");
  main.style.marginLeft = sidebar.classList.contains("hidden") ? "0" : "240px";
});
