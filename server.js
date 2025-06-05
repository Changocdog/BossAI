// ========== MODULE SWITCHING ==========
const moduleButtons = document.querySelectorAll(".sidebar-btn");
const modulePanels = document.querySelectorAll(".module-panel");

moduleButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-module");
    modulePanels.forEach((panel) => {
      panel.style.display = panel.id === `${target}-panel` ? "block" : "none";
    });
  });
});

// ========== SCRIPT WRITER AI ==========
const apiKeyInput = document.getElementById("api-key");
const generateBtn = document.getElementById("generate-script-btn");
const scriptInput = document.getElementById("script-input");
const scriptOutput = document.getElementById("script-output");

generateBtn?.addEventListener("click", async () => {
  const prompt = scriptInput.value;
  const apiKey = apiKeyInput.value;

  if (!prompt || !apiKey) return alert("Missing prompt or API key");

  scriptOutput.textContent = "Generating script...";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Write a short-form YouTube script based on: ${prompt}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No output";
  scriptOutput.textContent = result;
  logAIUsage("Script Writer AI");
});

// ========== VOICEOVER PLACEHOLDER ==========
document.getElementById("generate-voiceover-btn")?.addEventListener("click", () => {
  document.getElementById("voiceover-status").textContent = "🔈 (Voiceover placeholder activated)";
  logAIUsage("Voiceover AI");
});

// ========== UPLOAD STRATEGY AI ==========
const uploadOutput = document.getElementById("upload-panel");
const uploadBtn = document.createElement("button");
uploadBtn.id = "generate-upload-strategy-btn";
uploadBtn.className = "primary";
uploadBtn.textContent = "Generate Upload Strategy";
uploadOutput?.appendChild(uploadBtn);

const uploadDisplay = document.createElement("pre");
uploadDisplay.id = "upload-strategy-output";
uploadOutput?.appendChild(uploadDisplay);

uploadBtn?.addEventListener("click", async () => {
  const scriptText = scriptOutput?.textContent || "";
  const apiKey = apiKeyInput.value;

  if (!scriptText || !apiKey) return alert("Missing script or API key");

  uploadDisplay.textContent = "Generating upload plan...";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Based on this video script, what is the best time and platform to post it for max reach?\n\n${scriptText}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No output";
  uploadDisplay.textContent = result;
  logAIUsage("Upload Strategy AI");
});

// ========== LEGAL REVIEW AI ==========
const legalPanel = document.getElementById("legal-panel");
const legalBtn = document.createElement("button");
legalBtn.id = "run-legal-review-btn";
legalBtn.className = "primary";
legalBtn.textContent = "Run Legal Review";
legalPanel?.appendChild(legalBtn);

const legalDisplay = document.createElement("pre");
legalDisplay.id = "legal-review-output";
legalPanel?.appendChild(legalDisplay);

legalBtn?.addEventListener("click", async () => {
  const scriptText = scriptOutput?.textContent || "";
  const apiKey = apiKeyInput.value;

  if (!scriptText || !apiKey) return alert("Missing script or API key");

  legalDisplay.textContent = "Checking legality...";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Check the following script for any copyright issues or risky content. Be concise.\n\n${scriptText}`,
        },
      ],
    }),
  });

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "No output";
  legalDisplay.textContent = result;
  logAIUsage("Legal Review AI");
  trySaveHistory();
});

// ========== VIDEO HISTORY ==========
const historyList = document.getElementById("history-list");
const historyData = [];

function saveToHistory(scriptText, uploadPlan, legalNote) {
  const timestamp = new Date().toLocaleString();
  const entry = {
    timestamp,
    script: scriptText,
    upload: uploadPlan,
    legal: legalNote
  };
  historyData.unshift(entry);
  updateHistoryUI();
}

function updateHistoryUI() {
  if (!historyList) return;
  historyList.innerHTML = "";

  historyData.forEach(entry => {
    const container = document.createElement("div");
    container.className = "history-entry";

    const title = document.createElement("h4");
    title.textContent = `🕒 ${entry.timestamp}`;
    container.appendChild(title);

    const script = document.createElement("pre");
    script.textContent = `📝 Script:\n${entry.script}`;
    container.appendChild(script);

    const upload = document.createElement("pre");
    upload.textContent = `🚀 Upload Plan:\n${entry.upload}`;
    container.appendChild(upload);

    const legal = document.createElement("pre");
    legal.textContent = `🛡️ Legal Review:\n${entry.legal}`;
    container.appendChild(legal);

    historyList.appendChild(container);
  });
}

function trySaveHistory() {
  const script = document.getElementById("script-output")?.textContent || "";
  const upload = document.getElementById("upload-strategy-output")?.textContent || "";
  const legal = document.getElementById("legal-review-output")?.textContent || "";

  if (script && upload && legal) {
    saveToHistory(script, upload, legal);
  }
}

// ========== 📊 AI PERFORMANCE DASHBOARD ==========
const dashboard = document.getElementById("dashboard-metrics");
const aiUsageStats = {
  "Script Writer AI": [],
  "Voiceover AI": [],
  "Upload Strategy AI": [],
  "Legal Review AI": []
};

function logAIUsage(aiName) {
  const timestamp = new Date().toLocaleTimeString();
  aiUsageStats[aiName].unshift(timestamp);
  updateDashboard();
}

function updateDashboard() {
  if (!dashboard) return;

  dashboard.innerHTML = "";
  for (const [aiName, logs] of Object.entries(aiUsageStats)) {
    const section = document.createElement("div");
    section.className = "ai-log";

    const title = document.createElement("h4");
    title.textContent = `${aiName}`;
    section.appendChild(title);

    const list = document.createElement("ul");
    logs.slice(0, 5).forEach(time => {
      const li = document.createElement("li");
      li.textContent = `Used at: ${time}`;
      list.appendChild(li);
    });

    if (logs.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No activity yet.";
      list.appendChild(li);
    }

    section.appendChild(list);
    dashboard.appendChild(section);
  }
}
