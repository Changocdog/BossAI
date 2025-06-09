document.addEventListener("DOMContentLoaded", function () {
  const sidebarButtons = document.querySelectorAll(".sidebar button");
  const mainPanel = document.getElementById("main");

  function highlightActive(button) {
    sidebarButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  function setOutput(content) {
    mainPanel.innerHTML = content;
  }

  function getOpenAIKey() {
    return localStorage.getItem("openai_api_key") || "";
  }

  function getElevenLabsKey() {
    return localStorage.getItem("elevenlabs_key") || "";
  }

  async function generateScript(prompt) {
    const key = getOpenAIKey();
    if (!key) return "❌ OpenAI API key missing.";

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Create a short-form video script for: ${prompt}` }],
        max_tokens: 300
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "❌ No script generated.";
  }

  async function generateVoiceover(text) {
    const key = getElevenLabsKey();
    if (!key) return "❌ ElevenLabs API key missing.";

    const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/exAVoiceID/stream", {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    const audioBlob = await res.blob();
    const audioURL = URL.createObjectURL(audioBlob);
    return `<audio controls src="${audioURL}"></audio>`;
  }

  function uploadStrategyResponse(input) {
    if (!input) return "Please enter a topic.";
    return `
      <h2>📤 Upload Strategy</h2>
      <p><strong>Topic:</strong> ${input}</p>
      <ul>
        <li>Post to TikTok Shorts and YouTube Reels at 10am PST</li>
        <li>Use hashtags: #moneytips #sidehustle</li>
        <li>Title: "How to Make Money from This Simple Trick"</li>
      </ul>
    `;
  }

  function showInputPanel(module, callback) {
    setOutput(`
      <h2>${module}</h2>
      <textarea id="user-input" placeholder="Enter your prompt..."></textarea>
      <button class="generate-btn">Run</button>
      <div id="output-area" style="margin-top:20px;"></div>
    `);

    document.querySelector(".generate-btn").onclick = async () => {
      const input = document.getElementById("user-input").value;
      const outputArea = document.getElementById("output-area");
      outputArea.innerHTML = "⏳ Working...";

      const result = await callback(input);
      outputArea.innerHTML = result;
    };
  }

  sidebarButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const module = button.getAttribute("data-module");
      highlightActive(button);

      if (module === "manager") {
        showInputPanel("🤖 Manager AI", async (input) => {
          return `Manager received your input: <strong>${input}</strong><br>All modules are ready.`;
        });
      } else if (module === "script") {
        showInputPanel("✍️ Script Writer AI", async (input) => {
          return await generateScript(input);
        });
      } else if (module === "voiceover") {
        showInputPanel("🎤 Voiceover AI", async (input) => {
          return await generateVoiceover(input);
        });
      } else if (module === "upload") {
        showInputPanel("📤 Upload Strategy", async (input) => {
          return uploadStrategyResponse(input);
        });
      } else if (module === "output") {
        setOutput(`<h2>📺 Final Output</h2><p>All AI outputs will be collected here in the future version.</p>`);
      } else if (module === "history") {
        setOutput(`<h2>🗂️ Video History</h2><p>Saved video drafts will appear here in a future update.</p>`);
      } else if (module === "trends") {
        setOutput(`<h2>📈 Trends AI</h2><ul class="trend-list"><li>AI Side Hustles</li><li>Passive Income</li><li>Crypto Comeback</li></ul>`);
      } else if (module === "settings") {
        setOutput(`
          <h2>⚙️ Settings</h2>
          <label>OpenAI Key:</label><input id="openaiKeyInput" placeholder="sk-..." value="${getOpenAIKey()}"/><br>
          <label>ElevenLabs Key:</label><input id="elevenKeyInput" placeholder="eleven..." value="${getElevenLabsKey()}"/><br>
          <button class="generate-btn" onclick="saveKeys()">Save Keys</button>
        `);
      } else if (module === "sheets") {
        setOutput(`<h2>📊 Sheets Log</h2><p>This module is not yet active.</p>`);
      } else {
        setOutput(`<h2>Boss AI</h2><p>Select a module to begin.</p>`);
      }
    });
  });

  document.getElementById("toggle-btn").onclick = () => {
    document.getElementById("sidebar").classList.toggle("hidden");
    document.getElementById("main").classList.toggle("full");
  };
});

function saveKeys() {
  const openai = document.getElementById("openaiKeyInput").value;
  const eleven = document.getElementById("elevenKeyInput").value;
  localStorage.setItem("openai_api_key", openai);
  localStorage.setItem("elevenlabs_key", eleven);
  alert("✅ Keys saved!");
}
