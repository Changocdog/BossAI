document.getElementById("generate-script-btn").addEventListener("click", () => {
  const prompt = document.getElementById("script-input").value.trim();
  const output = document.getElementById("script-output");

  if (!prompt) {
    output.textContent = "⚠️ Please enter a topic before generating.";
    return;
  }

  // Placeholder output for now
  output.textContent = `🧠 Generating script for topic: "${prompt}"...\n\nThis is where your AI-generated script will appear.`;
});

// Future dark mode toggle
document.getElementById("mode-toggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark-mode", e.target.checked);
});
