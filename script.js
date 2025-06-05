// Sidebar module switching
document.querySelectorAll(".sidebar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const module = btn.dataset.module;
    document.querySelectorAll(".module-panel").forEach(panel => {
      panel.style.display = "none";
    });
    document.getElementById(`${module}-panel`).style.display = "block";
  });
});

// Dark mode toggle
document.getElementById("mode-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode", e.target.checked);
});

// Script Writer AI (placeholder)
document.getElementById("generate-script-btn")?.addEventListener("click", () => {
  const prompt = document.getElementById("script-input").value.trim();
  const output = document.getElementById("script-output");

  if (!prompt) {
    output.textContent = "⚠️ Please enter a topic.";
    return;
  }

  output.textContent = `🧠 Generating script for: "${prompt}"...\n\n(This is a placeholder — connect OpenAI for real output.)`;
});

// Voiceover (simulated)
document.getElementById("generate-voiceover-btn")?.addEventListener("click", () => {
  const status = document.getElementById("voiceover-status");
  status.textContent = "🎧 Simulated voiceover generated.";
});

// Feedback form popup
document.getElementById("feedback-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("popup").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
  }, 2000);
});
