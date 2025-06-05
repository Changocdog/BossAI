// Select all sidebar buttons and main panel
const buttons = document.querySelectorAll(".sidebar button");
const contentPanel = document.getElementById("content-panel");

// Highlight active button and load its module
buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayModule(button.dataset.module);
  });
});

// Display content for selected module
function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
      <div class="dashboard-box">
        <h1>👑 Boss AI Dashboard</h1>
        <p class="subtext">Welcome! Use the tools in the sidebar to generate scripts, voiceovers, and upload plans.</p>

        <h3>⚙️ Module Status</h3>
        <ul class="status-list">
          <li>✅ <strong>Script Writer AI</strong> — <span>Online</span></li>
          <li>✅ <strong>Upload Strategy AI</strong> — <span>Online</span></li>
          <li>✅ <strong>Voiceover Generator</strong> — <span>Simulated</span></li>
          <li>✅ <strong>Legal Review AI</strong> — <span>Enabled</span></li>
          <li>✅ <strong>History & Output Log</strong> — <span>Functional</span></li>
        </ul>

        <div class="emoji">🤖</div>
        <p class="subtext">Select a module from the sidebar to get started.</p>
      </div>
    `;
  } else if (module === "legal") {
    contentPanel.innerHTML = `<p style="text-align:center;">📜 Legal Review Module – Coming Soon</p>`;
  } else if (module === "script") {
    contentPanel.innerHTML = `<p style="text-align:center;">✍️ Script Writer Module – Coming Soon</p>`;
  } else if (module === "voiceover") {
    contentPanel.innerHTML = `<p style="text-align:center;">🎤 Voiceover Module – Coming Soon</p>`;
  } else if (module === "upload") {
    contentPanel.innerHTML = `<p style="text-align:center;">📤 Upload Strategy Module – Coming Soon</p>`;
  } else if (module === "output") {
    contentPanel.innerHTML = `<p style="text-align:center;">📺 Final Output Module – Coming Soon</p>`;
  } else if (module === "history") {
    contentPanel.innerHTML = `<p style="text-align:center;">🗂️ History Module – Coming Soon</p>`;
  } else if (module === "settings") {
    contentPanel.innerHTML = `<p style="text-align:center;">⚙️ Settings Module – Coming Soon</p>`;
  } else {
    contentPanel.innerHTML = `<p style="text-align:center;">Module not found.</p>`;
  }
}

// Sidebar retract toggle
document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});
