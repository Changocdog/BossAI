// Sidebar Module Switching
document.querySelectorAll(".sidebar-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const module = btn.dataset.module;
    document.querySelectorAll(".module-panel").forEach((panel) => {
      panel.style.display = "none";
    });
    document.getElementById(`${module}-panel`).style.display = "block";
  });
});

// Toggle Sidebar
document.getElementById("toggle-btn")?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.display = sidebar.style.display === "none" ? "flex" : "none";
});

// Dark Mode
const modeToggle = document.getElementById("mode-toggle");
modeToggle?.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", modeToggle.checked);
});

// Script Writer AI
document.getElementById("generate-script-btn")?.addEventListener("click", async () => {
  const prompt = document.getElementById("script-input").value;
  const apiKey = document.getElementById("api-key").value;
  const output = document.getElementById("script-output");
  output.textContent = "⏳ Generating...";

  if (!apiKey || !prompt) {
    output.textContent = "⚠️ Enter both an API key and a prompt.";
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a scriptwriter that creates short-form video scripts." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const script = data.choices?.[0]?.message?.content || "❌ No response.";
    output.textContent = script;

    addToHistory(prompt, script);
    logAIActivity("Script Writer");

  } catch (err) {
    output.textContent = "❌ Error generating script.";
  }
});

// Voiceover (Placeholder)
document.getElementById("generate-voiceover-btn")?.addEventListener("click", () => {
  const status = document.getElementById("voiceover-status");
  status.textContent = "🎧 Simulated voiceover: Your script is being narrated...";
  logAIActivity("Voiceover Generator");
});

// Feedback Form
document.getElementById("feedback-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("popup").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
  }, 2000);
});

// History
function addToHistory(prompt, result) {
  const historyList = document.getElementById("history-list");
  const entry = document.createElement("div");
  entry.className = "history-entry";
  entry.innerHTML = `<strong>Prompt:</strong> ${prompt}<br/><strong>Result:</strong><br/>${result}`;
  historyList.prepend(entry);
}

// Dashboard Logs
const aiUsageLog = [];

function logAIActivity(toolName) {
  const timestamp = new Date().toLocaleString();
  aiUsageLog.unshift({ tool: toolName, time: timestamp });
  renderDashboard();
}

function renderDashboard() {
  const dashboard = document.getElementById("dashboard-metrics");
  dashboard.innerHTML = "";
  if (aiUsageLog.length === 0) {
    dashboard.innerHTML = "<p>No AI activity logged yet.</p>";
    return;
  }

  aiUsageLog.forEach(log => {
    const logItem = document.createElement("div");
    logItem.className = "ai-log";
    logItem.innerHTML = `<strong>${log.tool}</strong> ran at ${log.time}`;
    dashboard.appendChild(logItem);
  });
}
