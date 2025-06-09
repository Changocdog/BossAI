const modules = {
  manager: "Welcome to Manager AI. Enter a prompt below to begin coordination.",
  legal: "Legal Review AI is active. Please submit text to review.",
  script: "Script Writer AI ready. Enter your video idea and submit.",
  voiceover: "Voiceover AI active. Enter script to generate voice.",
  upload: "Upload Strategy AI ready. Enter script or title for strategy tips.",
  output: "Final Output panel will show completed videos here.",
  history: "History panel loading...",
  trends: "Trends AI active. Current trending topics will appear here.",
  settings: "Settings panel loaded.",
};

const main = document.getElementById("main");
const sidebarButtons = document.querySelectorAll(".sidebar button");
const toggleBtn = document.getElementById("toggle-btn");

let currentModule = "manager";

function showModule(module) {
  currentModule = module;
  sidebarButtons.forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`[data-module="${module}"]`).classList.add("active");

  main.innerHTML = `
    <h2>${module.charAt(0).toUpperCase() + module.slice(1)} Module</h2>
    <p>${modules[module]}</p>
    <textarea id="input-box" rows="6" placeholder="Enter your input here..."></textarea>
    <button class="generate-btn" onclick="runAI('${module}')">Generate</button>
    <div id="result-box" style="margin-top:20px;"></div>
  `;
}

function runAI(module) {
  const input = document.getElementById("input-box").value;
  const resultBox = document.getElementById("result-box");
  resultBox.innerHTML = "<em>Generating...</em>";

  if (module === "script") {
    const apiKey = localStorage.getItem("openai_key");
    if (!apiKey) return alert("No OpenAI API key found. Please add it in Settings.");
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a viral short-form video script about: ${input}` }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const output = data.choices?.[0]?.message?.content || "No output.";
        resultBox.innerText = output;
      })
      .catch((err) => {
        resultBox.innerText = "Error: " + err.message;
      });

  } else if (module === "voiceover") {
    const voiceKey = localStorage.getItem("eleven_key");
    if (!voiceKey) return alert("No ElevenLabs API key found. Add it in Settings.");
    fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB", {
      method: "POST",
      headers: {
        "xi-api-key": voiceKey,
        "Content-Type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({ text: input, model_id: "eleven_monolingual_v1", voice_settings: { stability: 0.3, similarity_boost: 0.7 } }),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        resultBox.innerHTML = `<audio controls src="${audioUrl}"></audio>`;
      })
      .catch((err) => {
        resultBox.innerText = "Voiceover error: " + err.message;
      });

  } else if (module === "upload") {
    const tips = `
      🔹 Post to TikTok, Reels, and Shorts.\n
      🔹 Use 3-5 hashtags related to: "${input.split(" ").slice(0, 3).join(", ")}"\n
      🔹 Upload between 3-6 PM local time.\n
      🔹 Thumbnail should include a face and large text.\n
      🔹 Hook in first 2 seconds is key!
    `;
    resultBox.innerText = tips;

  } else if (module === "manager") {
    resultBox.innerText = `👔 Manager AI suggests you run Script AI, then Voiceover, then Upload Strategy.`;
  } else {
    resultBox.innerText = "This module is under development.";
  }
}

toggleBtn.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
  main.classList.toggle("full");
});

sidebarButtons.forEach((btn) =>
  btn.addEventListener("click", () => showModule(btn.dataset.module))
);

showModule(currentModule);
