  <script>
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const main = document.getElementById("main");
    const chatLog = document.getElementById("chat-log");
    const moduleContent = document.getElementById("module-content");

    toggleBtn.onclick = () => {
      sidebar.classList.toggle("hidden");
      main.classList.toggle("full");
    };

    const modules = {
      manager: `
        <h2 style="color:#00bfff;">Manager AI</h2>
        <p>I can manage all modules, fix broken features, and guide improvements.</p>
      `,
      script: `
        <h2 style="color:#00bfff;">✍️ Script Writer AI</h2>
        <textarea id="script-input" placeholder="Enter video idea..."></textarea>
        <div id="script-key-box"></div>
        <button class="generate-btn" onclick="generateScript()">Generate Script</button>
        <p id="script-output"></p>
      `,
      voiceover: `
        <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
        <textarea id="voice-text" placeholder="Paste your script..."></textarea>
        <div id="voice-key-box"></div>
        <button class="generate-btn" onclick="generateVoice()">Generate Voice</button>
        <p id="voice-status"></p>
      `,
      upload: `<h2 style="color:#00bfff;">📤 Upload Strategy</h2><textarea placeholder="Upload goals..."></textarea><button class="generate-btn">Optimize</button>`,
      output: `<h2 style="color:#00bfff;">📺 Final Output</h2><iframe width="100%" height="315" src="https://www.youtube.com/embed/fx1HgAG78qg" frameborder="0" allowfullscreen></iframe>`,
      legal: `<h2 style="color:#00bfff;">📜 Legal Review</h2><p>Check in progress...</p>`,
      history: `<h2 style="color:#00bfff;">🗂️ History Log</h2><ul><li>Script: “Passive Income”</li><li>Voice: “Crypto Tips”</li></ul>`,
      trends: `<h2 style="color:#00bfff;">📈 Trends AI</h2><ul><li>#Crypto2025</li><li>#AIContent</li></ul><button class="generate-btn">Refresh</button>`,
      settings: `<h2 style="color:#00bfff;">⚙️ Settings</h2><textarea placeholder="Your preferences..."></textarea><button class="generate-btn">Save</button>`
    };

    function switchModule(key) {
      document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
      document.querySelector(`.sidebar button[data-module="${key}"]`)?.classList.add("active");
      moduleContent.innerHTML = modules[key] || "<p>Module not found.</p>";

      if (key === "script") {
        const keySaved = localStorage.getItem("openrouter_key");
        document.getElementById("script-key-box").innerHTML = keySaved
          ? `<p style="color:lime;">✅ Key saved</p>`
          : `<input id="script-key" type="password" placeholder="🔑 OpenRouter Key"/><button class="generate-btn" onclick="saveScriptKey()">Save</button>`;
      }

      if (key === "voiceover") {
        const keySaved = localStorage.getItem("elevenlabs_key");
        document.getElementById("voice-key-box").innerHTML = keySaved
          ? `<p style="color:lime;">✅ Key saved</p>`
          : `<input id="voice-key" type="password" placeholder="🔑 ElevenLabs Key"/><button class="generate-btn" onclick="saveVoiceKey()">Save</button>`;
      }
    }

    function handleManagerInput() {
      const input = document.getElementById("manager-input").value.trim();
      if (!input) return;
      chatLog.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
      respondWithGPT(input);
      document.getElementById("manager-input").value = '';
    }

    async function respondWithGPT(text) {
      const key = localStorage.getItem("openrouter_key");
      if (!key) return speak("❌ OpenRouter key is missing. Please set it in the Script module.");
      speak("🤖 Thinking...");

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
              { role: "system", content: "You are Manager AI. You control and fix all parts of the Boss AI system, help the user, and improve modules." },
              { role: "user", content: text }
            ]
          })
        });
        const data = await res.json();
        const reply = data.choices[0].message.content;
        speak(reply);

        // Auto actions for known phrases
        if (text.toLowerCase().includes("script")) switchModule("script");
        if (text.toLowerCase().includes("voice")) switchModule("voiceover");
        if (text.toLowerCase().includes("upload")) switchModule("upload");
        if (text.toLowerCase().includes("output")) switchModule("output");
        if (text.toLowerCase().includes("legal")) switchModule("legal");
      } catch (err) {
        speak("❌ Error: " + err.message);
      }
    }

    function speak(text) {
      chatLog.innerHTML += `<p><strong>Manager AI:</strong> ${text}</p>`;
    }

    function saveScriptKey() {
      const val = document.getElementById("script-key").value.trim();
      if (val.length > 10) {
        localStorage.setItem("openrouter_key", val);
        switchModule("script");
      }
    }

    function saveVoiceKey() {
      const val = document.getElementById("voice-key").value.trim();
      if (val.length > 10) {
        localStorage.setItem("elevenlabs_key", val);
        switchModule("voiceover");
      }
    }

    async function generateScript() {
      const key = localStorage.getItem("openrouter_key");
      const prompt = document.getElementById("script-input").value.trim();
      const output = document.getElementById("script-output");
      if (!key || !prompt) return output.innerHTML = "❌ Missing input or key";

      output.innerHTML = "Generating...";
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
              { role: "system", content: "You're a short-form video script writer." },
              { role: "user", content: `Write a 30-second video script about: ${prompt}` }
            ]
          })
        });
        const data = await res.json();
        output.innerHTML = data.choices[0].message.content;
      } catch (err) {
        output.innerHTML = "❌ " + err.message;
      }
    }

    async function generateVoice() {
      const key = localStorage.getItem("elevenlabs_key");
      const text = document.getElementById("voice-text").value.trim();
      const status = document.getElementById("voice-status");
      if (!key || !text) return status.innerHTML = "❌ Missing input or key";

      status.innerHTML = "Generating...";
      try {
        const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB", {
          method: "POST",
          headers: {
            "xi-api-key": key,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: text })
        });
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
        status.innerHTML = "✅ Voiceover playing";
      } catch (err) {
        status.innerHTML = "❌ " + err.message;
      }
    }

    switchModule("manager");
  </script>
</body>
</html>
