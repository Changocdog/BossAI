document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const panels = document.querySelectorAll(".module-panel");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const modeToggle = document.getElementById("mode-toggle");
  const feedbackForm = document.getElementById("feedback-form");

  // Toggle sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Dark mode toggle
  modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeToggle.checked);
  });

  // Sidebar navigation
  sidebarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const module = btn.getAttribute("data-module");
      showPanel(module);
    });
  });

  function showPanel(module) {
    panels.forEach(panel => panel.style.display = "none");
    document.getElementById(`${module}-panel`).style.display = "block";
  }

  // Feedback form
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const message = document.getElementById("message").value;
      if (!message.trim()) {
        alert("Please enter feedback.");
        return;
      }
      document.getElementById("popup").classList.remove("hidden");
      setTimeout(() => {
        document.getElementById("popup").classList.add("hidden");
      }, 3000);
      feedbackForm.reset();
    });
  }

  // Script Writer AI
  const generateBtn = document.getElementById("generate-script-btn");
  const scriptInput = document.getElementById("script-input");
  const scriptOutput = document.getElementById("script-output");

  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      const prompt = scriptInput.value.trim();
      const apiKey = document.getElementById("api-key").value.trim();

      if (!prompt) {
        alert("Please enter a prompt.");
        return;
      }

      if (!apiKey) {
        alert("Please enter your OpenAI API key.");
        return;
      }

      scriptOutput.textContent = "Generating script...";

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
              role: "user",
              content: `Create a 60-second short video script based on this prompt: ${prompt}`
            }],
            max_tokens: 300,
            temperature: 0.7
          })
        });

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content;
        scriptOutput.textContent = result || "No response received.";
      } catch (error) {
        scriptOutput.textContent = "Error generating script.";
        console.error(error);
      }
    });
  }

  // Voiceover AI (simulated)
  const voiceoverBtn = document.getElementById("generate-voiceover-btn");
  const voiceoverStatus = document.getElementById("voiceover-status");

  if (voiceoverBtn) {
    voiceoverBtn.addEventListener("click", () => {
      voiceoverStatus.textContent = "Generating voiceover...";
      setTimeout(() => {
        voiceoverStatus.textContent = "✅ Voiceover ready! (simulated)";
      }, 2000);
    });
  }

  showPanel("home");
});
