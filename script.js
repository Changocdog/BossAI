<script>
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  const chatLog = document.getElementById("chat-log");
  const moduleContent = document.getElementById("module-content");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  });

  const modules = {
    script: `
      <h2>✍️ Script Writer</h2>
      <textarea id="script-input" placeholder="Enter your video idea..."></textarea>
      <div id="script-key-box"></div>
      <button class="generate-btn" onclick="generateScript()">Generate Script</button>
      <p id="script-output"></p>
    `,
    voiceover: `
      <h2>🎤 Voiceover</h2>
      <textarea id="voice-text" placeholder="Paste your script..."></textarea>
      <div id="key-entry"></div>
      <button class="generate-btn" onclick="generateVoice()">Generate Voiceover</button>
      <p id="voice-status"></p>
    `,
    upload: `
      <h2>📤 Upload Strategy</h2>
      <textarea placeholder='Upload goals...'></textarea>
      <button class="generate-btn">Optimize</button>
    `,
    output: `
      <h2>📺 Final Output</h2>
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/fx1HgAG78qg" frameborder="0" allowfullscreen></iframe>
    `,
    legal: `
      <h2>📜 Legal Review</h2>
      <p>Checking content compliance and copyright risks...</p>
    `,
    history: `
      <h2>🗂️ History</h2>
      <ul><li>Script: “Passive Income”</li><li>Voiceover: “Crypto Tips”</li></ul>
    `,
    trends: `
      <h2>📈 Trends AI</h2>
      <ul class="trend-list">
        <li>#MakeMoneyOnline</li>
        <li>#GPTBusiness</li>
        <li>#BossAI</li>
      </ul>
      <button class="generate-btn" onclick="updateTrends()">🔄 Refresh</button>
    `,
    settings: `
      <h2>⚙️ Settings</h2>
      <textarea placeholder="Preferences..."></textarea>
      <button class="generate-btn">Save</button>
    `
  };

  document.querySelectorAll(".sidebar button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const mod = button.getAttribute("data-module");

      if (mod === "manager") {
        moduleContent.innerHTML = "";
      } else {
        moduleContent.innerHTML = modules[mod] || "<p>Module not found.</p>";
      }

      if (mod === "script") {
        const key = localStorage.getItem("openrouter_key");
        const box = document.getElementById("script-key-box");
        if (!key) {
          box.innerHTML = `<input id="script-key" type="password" placeholder="🔑 OpenRouter API Key"/>
          <button class="generate-btn" onclick="saveScriptKey()">Save Key</button>`;
        } else {
          box.innerHTML = `<p style="color: #0f0;">✅ Key saved. <button class="generate-btn" onclick="clearScriptKey()">Change</button></p>`;
        }
      }

      if (mod === "voiceover") {
        const key = localStorage.getItem("elevenlabs_key");
        const box = document.getElementById("key-entry");
        if (!key) {
          box.innerHTML = `<input id="voice-key" type="password" placeholder="🔑 ElevenLabs Key"/>
          <button class="generate-btn" onclick="saveVoiceKey()">Save</button>`;
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

  function saveVoiceKey() {
    const val = document.getElementById("voice-key").value.trim();
    if (val.length > 10) {
      localStorage.setItem("elevenlabs_key", val);
      location.reload();
    }
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
      output.innerHTML = data.choices[0].message.content;
    } catch (err) {
      output.innerHTML = `<span style="color:red;">❌ ${err.message}</span>`;
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
        body: JSON.stringify({ text })
      });
      if (!response.ok) throw new Error("API request failed");
      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
      status.innerHTML = "✅ Voiceover playing";
    } catch (err) {
      status.innerHTML = `<span style="color:red;">❌ ${err.message}</span>`;
    }
  }

  async function handleManagerInput() {
    const input = document.getElementById("manager-input").value.trim();
    if (!input) return;

    const userMsg = `<p><strong>You:</strong> ${input}</p>`;
    chatLog.innerHTML += userMsg;
    document.getElementById("manager-input").value = "";

    chatLog.innerHTML += `<p><em>Thinking...</em></p>`;
    const key = localStorage.getItem("openrouter_key");
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
            { role: "system", content: "You are the Manager AI. Speak naturally, take initiative, and suggest or execute improvements to the app." },
            { role: "user", content: input }
          ]
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Error: no response.";
      chatLog.innerHTML = chatLog.innerHTML.replace(`<p><em>Thinking...</em></p>`, `<p><strong>Manager AI:</strong> ${reply}</p>`);
    } catch (err) {
      chatLog.innerHTML += `<p style="color:red;">❌ ${err.message}</p>`;
    }
  }

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

</script>
</body>
</html>
