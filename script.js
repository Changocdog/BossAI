const apiKeyInput = document.getElementById("api-key");
const contentPanel = document.getElementById("content-panel");
let currentModule = "manager";

// Sidebar switching
const sidebarButtons = document.querySelectorAll(".sidebar button");
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
    contentPanel.innerHTML = `
      <h2>General Manager AI</h2>
      <p>Ask the Manager to oversee content creation and task coordination.</p>
    `;
  } else if (module === "legal") {
    contentPanel.innerHTML = `
      <h2>Legal AI Review</h2>
      <p>This module checks content for compliance and copyright safety.</p>
    `;
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
        output.textContent = "❌ Error generating script. Check your API key and try again.";
        console.error(error);
      }
    });
  } else if (module === "voiceover") {
    contentPanel.innerHTML = `
      <h2>Voiceover Generator AI</h2>
      <p>Select voice type and click to generate narration:</p>
      <select id="voice-select">
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <textarea id="voice-script" rows="4" placeholder="Paste or write your script here..."></textarea>
      <button id="generate-voice">Generate Voiceover</button>
      <p id="voice-status">Status: Waiting for input</p>
      <audio id="voice-player" controls style="display:none;"></audio>
    `;

    document.getElementById("generate-voice").addEventListener("click", async () => {
      const voice = document.getElementById("voice-select").value;
      const script = document.getElementById("voice-script").value;
      const status = document.getElementById("voice-status");
      const audio = document.getElementById("voice-player");

      if (!script) {
        status.textContent = "❌ Please enter a script first.";
        return;
      }

      status.textContent = "⏳ Generating voiceover... (simulated)";
      audio.style.display = "none";

      setTimeout(() => {
        status.textContent = `✅ Voiceover (${voice}) ready!`;
        audio.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        audio.style.display = "block";
      }, 2000);
    });
  } else if (module === "upload") {
    contentPanel.innerHTML = `
      <h2>Upload Strategy AI</h2>
      <p>Describe your video or target audience:</p>
      <textarea id="upload-description" rows="4" placeholder="Example: A finance short targeting Gen Z about saving money"></textarea>
      <button id="generate-strategy">Generate Strategy</button>
      <pre id="strategy-output">Strategy will appear here.</pre>
    `;

    document.getElementById("generate-strategy").addEventListener("click", async () => {
      const description = document.getElementById("upload-description").value;
      const apiKey = apiKeyInput.value.trim();
      const output = document.getElementById("strategy-output");

      if (!description) {
        output.textContent = "❌ Please enter a video description.";
        return;
      }

      output.textContent = "⏳ Generating upload strategy...";

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
              content: `Generate the best upload strategy for a short-form video. Here's the video description: ${description}. Include platform, time of day, ideal hashtags, and tips.`
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
      <p><strong>Last Generated Script:</strong></p>
      <pre id="last-script">[This will later auto-populate with the final script]</pre>
      <hr>
      <p><strong>Video Preview:</strong></p>
      <video width="100%" controls>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        Your browser does not support video playback.
      </video>
      <p><a href="#" target="_blank">🔗 Link to Social Post (placeholder)</a></p>
    `;
  } else if (module === "history") {
    contentPanel.innerHTML = `
      <h2>Video History</h2>
      <ul>
        <li>🎬 <strong>How to Budget at 18</strong> — <em>Script + Strategy</em></li>
        <li>🎬 <strong>3 Side Hustles for Teens</strong> — <em>Script + Strategy</em></li>
        <li>🎬 <strong>Crypto Explained in 30 Seconds</strong> — <em>Script + Strategy</em></li>
      </ul>
      <p><em>Live saving and filtering coming soon.</em></p>
    `;
  } else if (module === "settings") {
    contentPanel.innerHTML = `
      <h2>Settings & Drafts</h2>
      <label for="api-key">OpenAI API Key:</label>
      <input type="password" id="settings-api-key" placeholder="Enter your API key" style="width: 100%;" />
      <button id="save-api">Save API Key</button>
      <p id="api-status">Status: Not saved</p>
      <hr>
      <h3>Last Drafted Script (coming soon)</h3>
      <p><em>This feature will autosave your last used script or voiceover.</em></p>
    `;

    document.getElementById("save-api").addEventListener("click", () => {
      const newKey = document.getElementById("settings-api-key").value.trim();
      if (newKey) {
        apiKeyInput.value = newKey;
        document.getElementById("api-status").textContent = "✅ API key saved for this session.";
      } else {
        document.getElementById("api-status").textContent = "❌ Please enter a valid key.";
      }
    });
  } else {
    contentPanel.innerHTML = `<p>Select a module from the sidebar.</p>`;
  }
}

// Load default module
displayModule(currentModule);
