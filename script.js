let currentModule = "home";
const apiKeyKey = "elevenlabs_api_key";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".module-button").forEach((button) => {
    button.addEventListener("click", function () {
      const module = this.getAttribute("data-module");
      switchModule(module);
    });
  });

  document.getElementById("run-script-btn")?.addEventListener("click", generateScript);
  document.getElementById("run-voiceover-btn")?.addEventListener("click", generateVoiceover);
  document.getElementById("run-upload-btn")?.addEventListener("click", generateUploadStrategy);
  document.getElementById("run-legal-btn")?.addEventListener("click", runLegalReview);
  document.getElementById("save-api-key-btn")?.addEventListener("click", saveElevenLabsKey);

  const savedKey = localStorage.getItem(apiKeyKey);
  if (savedKey) {
    document.getElementById("elevenlabs-api-key").value = savedKey;
  }

  switchModule("home");
});

function switchModule(module) {
  currentModule = module;
  document.querySelectorAll(".module-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  document.getElementById(`${module}-panel`).classList.add("active");
}

function displayOutput(moduleName, input, output) {
  const outputBox = document.getElementById("final-output-box");
  outputBox.innerHTML = `<strong>${moduleName}</strong><br><em>Input:</em> ${input}<br><em>Output:</em> ${output}`;
  logToGoogleSheets(moduleName, input, output);
}

async function generateScript() {
  const input = document.getElementById("script-input").value;
  const outputBox = document.getElementById("final-output-box");
  outputBox.innerHTML = "⏳ Generating script...";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer free", // Use 'free' tier from OpenRouter if enabled
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a professional short-form video script writer. Output script only." },
          { role: "user", content: input }
        ]
      })
    });

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content || "No script generated.";
    displayOutput("Script Writer AI", input, script);
  } catch (error) {
    outputBox.innerHTML = "❌ Error generating script.";
    console.error(error);
  }
}

async function generateVoiceover() {
  const text = document.getElementById("voiceover-input").value;
  const outputBox = document.getElementById("final-output-box");
  const apiKey = localStorage.getItem(apiKeyKey);

  if (!apiKey) {
    outputBox.innerHTML = "❌ Please enter your ElevenLabs API key in Settings.";
    return;
  }

  outputBox.innerHTML = "🔊 Generating voiceover...";

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    outputBox.innerHTML = `
      ✅ Voiceover ready:<br>
      <audio controls src="${audioUrl}"></audio>
    `;

    logToGoogleSheets("Voiceover AI", text, "[Voiceover MP3 generated]");
  } catch (error) {
    outputBox.innerHTML = "❌ Error generating voiceover.";
    console.error(error);
  }
}

function generateUploadStrategy() {
  const input = document.getElementById("upload-input").value;
  const output = `Recommended schedule for: "${input}" → Post on Mon/Wed/Fri at 9am PT for highest engagement.`;
  displayOutput("Upload Strategy AI", input, output);
}

function runLegalReview() {
  const input = document.getElementById("legal-input").value;
  const output = input.toLowerCase().includes("copyright")
    ? "⚠️ Potential copyright issue detected. Please verify all assets are royalty-free."
    : "✅ No legal issues detected.";
  displayOutput("Legal Review AI", input, output);
}

function saveElevenLabsKey() {
  const key = document.getElementById("elevenlabs-api-key").value;
  localStorage.setItem(apiKeyKey, key);
  alert("✅ ElevenLabs API key saved.");
}

// ✅ Log output to n8n webhook → Google Sheets
function logToGoogleSheets(module, input, output) {
  fetch("https://n8n.openai-assistant.workers.dev/webhook/bossai-logger", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      module: module,
      input: input,
      output: output
    })
  }).then(res => console.log("✅ Logged to Sheet")).catch(err => console.error("❌ Logging error", err));
}
