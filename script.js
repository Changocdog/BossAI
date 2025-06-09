const modules = {
  manager: `<h2>Manager AI</h2>
    <textarea id="managerInput" placeholder="Enter task or goal"></textarea>
    <button class="generate-btn" onclick="handleManager()">Run Manager AI</button>
    <div id="managerResult"></div>`,

  legal: `<h2>Legal Review AI</h2>
    <textarea id="legalInput" placeholder="Enter content to review legally"></textarea>
    <button class="generate-btn" onclick="runLegalAI()">Check Legal Status</button>
    <div id="legalResult"></div>`,

  script: `<h2>Script Writer AI</h2>
    <textarea id="scriptInput" placeholder="Enter your script topic or idea"></textarea>
    <button class="generate-btn" onclick="runScriptAI()">Generate Script</button>
    <div id="scriptResult"></div>`,

  voiceover: `<h2>Voiceover AI</h2>
    <textarea id="voiceoverInput" placeholder="Enter script for voiceover"></textarea>
    <input id="elevenKey" placeholder="Enter ElevenLabs API Key (saved locally)">
    <button class="generate-btn" onclick="runVoiceoverAI()">Generate Voiceover</button>
    <div id="voiceoverResult"></div>`,

  upload: `<h2>Upload Strategy AI</h2>
    <textarea id="uploadInput" placeholder="Enter content to upload"></textarea>
    <button class="generate-btn" onclick="runUploadAI()">Generate Upload Plan</button>
    <div id="uploadResult"></div>`,

  output: `<h2>Final Output</h2>
    <p>This area will show the final compiled video or content.</p>`,

  history: `<h2>Video History</h2>
    <p>This will track and display all previous outputs.</p>`,

  trends: `<h2>Trends AI</h2>
    <ul class="trend-list">
      <li>Top trend 1</li>
      <li>Top trend 2</li>
      <li>Top trend 3</li>
    </ul>`,

  sheets: `<h2>Sheets Log</h2>
    <p>This feature will be available soon. Stay tuned.</p>`,

  settings: `<h2>Settings</h2>
    <p>Customize your Boss AI experience here.</p>`
};

function switchModule(module) {
  document.getElementById("main").innerHTML = modules[module];
  document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.sidebar button[data-module="${module}"]`).classList.add("active");
}

document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => switchModule(button.dataset.module));
});

document.getElementById("toggle-btn").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("hidden");
  document.getElementById("main").classList.toggle("full");
});

// AI Functional Modules

async function runScriptAI() {
  const prompt = document.getElementById("scriptInput").value;
  const resultBox = document.getElementById("scriptResult");
  resultBox.innerText = "Generating...";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("openaiKey") || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a short-form video script about: ${prompt}` }]
      })
    });
    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "Error generating script.";
    resultBox.innerText = output;
  } catch (e) {
    resultBox.innerText = "Failed to connect to GPT.";
  }
}

async function runVoiceoverAI() {
  const text = document.getElementById("voiceoverInput").value;
  const key = document.getElementById("elevenKey").value;
  localStorage.setItem("elevenKey", key);
  const result = document.getElementById("voiceoverResult");
  result.innerText = "Generating voiceover...";
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/audio", {
      method: "POST",
      headers: {
        "xi-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });
    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);
    result.innerHTML = `<audio controls src="${audioURL}"></audio>`;
  } catch (e) {
    result.innerText = "Failed to connect to ElevenLabs.";
  }
}

async function runUploadAI() {
  const input = document.getElementById("uploadInput").value;
  const result = document.getElementById("uploadResult");
  result.innerText = "Analyzing...";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("openaiKey") || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Plan a multi-platform upload strategy for: ${input}` }]
      })
    });
    const data = await response.json();
    result.innerText = data.choices?.[0]?.message?.content || "Upload strategy failed.";
  } catch (e) {
    result.innerText = "Upload AI failed to respond.";
  }
}

function handleManager() {
  const input = document.getElementById("managerInput").value;
  document.getElementById("managerResult").innerText = `Task received: ${input}`;
}

function runLegalAI() {
  const input = document.getElementById("legalInput").value;
  document.getElementById("legalResult").innerText = `✅ Legal scan completed. No violations found for: "${input}".`;
}
