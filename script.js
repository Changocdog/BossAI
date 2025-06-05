const apiKeyInput = document.getElementById("api-key");
const contentPanel = document.getElementById("content-panel");
let currentModule = "manager";

const sidebarButtons = document.querySelectorAll(".sidebar button[data-module]");
sidebarButtons.forEach(button => {
  button.addEventListener("click", () => {
    sidebarButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentModule = button.dataset.module;
    displayModule(currentModule);
  });
});

function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `<h2>General Manager AI</h2><p>Ask the Manager to oversee content creation and task coordination.</p>`;
  } else if (module === "legal") {
    contentPanel.innerHTML = `<h2>Legal AI Review</h2><p>This module checks content for compliance and copyright safety.</p>`;
  } else if (module === "script") {
    contentPanel.innerHTML = `
      <h2>Script Writer AI</h2>
      <textarea id="script-input" rows="4" placeholder="Enter your video topic or idea..."></textarea>
      <button id="run-script">Generate Script</button>
      <pre id="script-output">Script will appear here.</pre>
    `;

    document.getElementById("run-script").addEventListener("click", async () => {
      const prompt = document.getElementById("script-input").value;
      const apiKey = apiKeyInput.value.trim();
      const output = document.getElementById("script-output");
      output.textContent = "⏳ Generating script...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Write a viral short-form video script for: ${prompt}` }],
            temperature: 0.8
          })
        });

        const data = await response.json();
        const script = data.choices?.[0]?.message?.content || "⚠️ No output received.";
        output.textContent = script;
      } catch (error) {
        output.textContent = "❌ Error generating script.";
        console.error(error);
      }
    });
  } else if (module === "voiceover") {
    contentPanel.innerHTML = `
      <h2>Voiceover Generator AI</h2>
      <select id="voice-select">
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <textarea id="voice-script" rows="4" placeholder="Paste or write your script here..."></textarea>
      <button id="generate-voice">Generate Voiceover</button>
      <p id="voice-status">Status: Waiting</p>
      <audio id="voice-player" controls style="display:none;"></audio>
    `;

    document.getElementById("generate-voice").addEventListener("click", () => {
      const script = document.getElementById("voice-script").value;
      const voice = document.getElementById("voice-select").value;
      const status = document.getElementById("voice-status");
      const audio = document.getElementById("voice-player");

      if (!script) {
        status.textContent = "❌ Please enter a script.";
        return;
      }

      status.textContent = "⏳ Generating voiceover (simulated)...";
      setTimeout(() => {
        status.textContent = `✅ Voiceover (${voice}) ready`;
        audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        audio.style.display = "block";
      }, 2000);
    });
  } else if (module === "upload") {
    contentPanel.innerHTML = `
      <h2>Upload Strategy AI</h2>
      <textarea id="upload-description" rows="4" placeholder="Describe your audience or video..."></textarea>
      <button id="generate-strategy">Generate Strategy</button>
      <pre id="strategy-output">Strategy will appear here.</pre>
    `;

    document.getElementById("generate-strategy").addEventListener("click", async () => {
      const description = document.getElementById("upload-description").value;
      const apiKey = apiKeyInput.value.trim();
      const output = document.getElementById("strategy-output");

      if (!description) {
        output.textContent = "❌ Please enter a description.";
        return;
      }

      output.textContent = "⏳ Generating strategy...";

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
              content: `Give the best upload strategy for: ${description}`
            }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        const strategy = data.choices?.[0]?.message?.content || "⚠️ No strategy returned.";
        output.textContent = strategy;
      } catch (error) {
        output.textContent = "❌ Error generating strategy.";
        console.error(error);
      }
    });
  } else if (module === "output") {
    contentPanel.innerHTML = `
      <h2>Final Output</h2>
      <pre>[Last generated script will appear here]</pre>
      <video controls>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support video.
      </video>
      <p><a href="#">🔗 Link to Post</a></p>
    `;
  } else if (module === "history") {
    contentPanel.innerHTML = `
      <h2>Video History</h2>
      <ul>
        <li>🎬 "Crypto 101" – Script + Upload Plan</li>
        <li>🎬 "Budgeting Tips" – Script + Upload Plan</li>
      </ul>
      <p><em>Auto-logging coming soon...</em></p>
    `;
  } else if (module === "settings") {
    contentPanel.innerHTML = `
      <h2>Settings</h2>
      <input id="settings-api-key" placeholder="Enter OpenAI API Key" type="password" />
      <button id="save-api">Save API Key</button>
      <p id="api-status">Status: Not saved</p>
    `;

    document.getElementById("save-api").addEventListener("click", () => {
      const newKey = document.getElementById("settings-api-key").value.trim();
      if (newKey) {
        apiKeyInput.value = newKey;
        document.getElementById("api-status").textContent = "✅ Key saved for session.";
      } else {
        document.getElementById("api-status").textContent = "❌ Invalid key.";
      }
    });
  } else {
    contentPanel.innerHTML = `<p>Select a module from the sidebar.</p>`;
  }
}

// ✅ Sidebar Toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});

// Load default module
displayModule(currentModule);
