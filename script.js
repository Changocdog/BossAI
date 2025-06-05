// Sidebar navigation logic
const buttons = document.querySelectorAll(".sidebar button[data-module]");
const contentPanel = document.getElementById("content-panel");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    displayModule(button.dataset.module);
  });
});

// Module display logic
function displayModule(module) {
  if (module === "manager") {
    contentPanel.innerHTML = `
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
    `;
  } else {
    contentPanel.innerHTML = `<p class="subtext">🔧 ${module.charAt(0).toUpperCase() + module.slice(1)} Module – Coming Soon</p>`;
  }
}

// Sidebar toggle logic (button always stays visible)
document.getElementById("toggle-btn").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  sidebar.classList.toggle("hidden");
  main.style.marginLeft = sidebar.classList.contains("hidden") ? "0" : "240px";
});
