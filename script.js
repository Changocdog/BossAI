// Sidebar module switching
document.querySelectorAll(".sidebar-btn").forEach(button => {
  button.addEventListener("click", () => {
    const module = button.dataset.module;

    // Reset active states
    document.querySelectorAll(".sidebar-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Hide all panels
    document.querySelectorAll(".module-panel").forEach(panel => {
      panel.style.display = "none";
    });

    // Show the selected module panel
    const targetPanel = document.getElementById(`${module}-panel`);
    if (targetPanel) targetPanel.style.display = "block";
  });
});

// Load default module (Dashboard)
document.querySelector('.sidebar-btn[data-module="manager"]')?.click();

// Script Writer (placeholder output)
document.getElementById("generate-script-btn")?.addEventListener("click", () => {
  const input = document.getElementById("script-input").value.trim();
  const output = document.getElementById("script-output");

  if (!input) {
    output.textContent = "⚠️ Please enter a topic.";
    return;
  }

  output.textContent = `🎬 Generating video script for:\n"${input}"\n\n(This is simulated output.)`;
});

// Voiceover Simulation
document.getElementById("generate-voiceover-btn")?.addEventListener("click", () => {
  const status = document.getElementById("voiceover-status");
  status.textContent = "🔊 Simulated voiceover generated!";
});

// Feedback popup
document.getElementById("feedback-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2000);
});
