// Handle sidebar module switching
document.querySelectorAll(".sidebar-btn").forEach(button => {
  button.addEventListener("click", () => {
    const module = button.dataset.module;

    // Toggle sidebar active state
    document.querySelectorAll(".sidebar-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Hide all panels
    document.querySelectorAll(".module-panel").forEach(panel => {
      panel.style.display = "none";
    });

    // Show selected panel
    const target = document.getElementById(`${module}-panel`);
    if (target) target.style.display = "block";
  });
});

// Dark mode toggle
document.getElementById("mode-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode", e.target.checked);
});

// Script Writer AI (placeholder output)
document.getElementById("generate-script-btn")?.addEventListener("click", () => {
  const input = document.getElementById("script-input").value.trim();
  const output = document.getElementById("script-output");

  if (!input) {
    output.textContent = "⚠️ Please enter a video topic first.";
    return;
  }

  output.textContent = `🧠 Generating script for:\n"${input}"...\n\n(This is placeholder output.)`;
});

// Simulate voiceover generation
document.getElementById("generate-voiceover-btn")?.addEventListener("click", () => {
  document.getElementById("voiceover-status").textContent = "🎧 Simulated voiceover generated.";
});

// Handle feedback form
document.getElementById("feedback-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("popup").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("popup").classList.add("hidden");
  }, 2000);
});

// Optional: highlight Manager module by default
document.querySelector('.sidebar-btn[data-module="manager"]')?.click();
