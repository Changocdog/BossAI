document.addEventListener("DOMContentLoaded", () => {
  const sidebarButtons = document.querySelectorAll(".sidebar-btn");
  const panels = document.querySelectorAll(".module-panel");
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const modeToggle = document.getElementById("mode-toggle");
  const feedbackForm = document.getElementById("feedback-form");

  // Sidebar toggle
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Dark mode toggle
  modeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", modeToggle.checked);
  });

  // Navigation between panels
  sidebarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const module = btn.getAttribute("data-module");
      showPanel(module);
    });
  });

  function showPanel(module) {
    panels.forEach(panel => panel.style.display = "none");
    const target = document.getElementById(`${module}-panel`);
    if (target) target.style.display = "block";
  }

  // Feedback form
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
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

      if (!prompt || !apiKey) {
        alert("Please enter both a prompt and an API key.");
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
        scriptOutput.textContent = "❌ Error generating script.";
        console.error(error);
      }
    });
  }

  // Voiceover AI (simulated)
  const voiceoverBtn = document.getElementById("generate-voiceover-btn");
  const voiceoverStatus = document.getElementById("voiceover-status");

  if (voiceoverBtn && voiceoverStatus) {
    voiceoverBtn.addEventListener("click", () => {
      voiceoverStatus.textContent = "Generating voiceover...";
      setTimeout(() => {
        voiceoverStatus.textContent = "✅ Voiceover ready! (simulated)";
      }, 2000);
    });
  }

  // Upload Strategy AI
  const uploadBtn = document.createElement("button");
  uploadBtn.id = "generate-upload-strategy-btn";
  uploadBtn.className = "primary";
  uploadBtn.textContent = "Generate Upload Strategy";

  const uploadPanel = document.getElementById("upload-panel");
  if (uploadPanel) {
    uploadPanel.appendChild(uploadBtn);
    const output = document.createElement("pre");
    output.id = "upload-strategy-output";
    uploadPanel.appendChild(output);

    uploadBtn.addEventListener("click", async () => {
      const apiKey = document.getElementById("api-key").value.trim();
      const script = document.getElementById("script-output").textContent.trim();

      if (!apiKey || !script) {
        alert("Please enter API key and generate a script first.");
        return;
      }

      output.textContent = "Generating strategy...";

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
              content: `Based on the following video script, suggest the best upload time and platform for maximum reach:\n\n${script}`
            }],
            max_tokens: 200,
            temperature: 0.6
          })
        });

        const data = await response.json();
        const strategy = data.choices?.[0]?.message?.content;
        output.textContent = strategy || "No response received.";
      } catch (err) {
        output.textContent = "❌ Error generating upload strategy.";
        console.error(err);
      }
    });
  }

  // Legal Review AI
  const legalBtn = document.createElement("button");
  legalBtn.id = "run-legal-review-btn";
  legalBtn.className = "primary";
  legalBtn.textContent = "Run Legal Review";

  const legalPanel = document.getElementById("legal-panel");
  if (legalPanel) {
    legalPanel.appendChild(legalBtn);
    const output = document.createElement("pre");
    output.id = "legal-review-output";
    legalPanel.appendChild(output);

    legalBtn.addEventListener("click", async () => {
      const apiKey = document.getElementById("api-key").value.trim();
      const script = document.getElementById("script-output").textContent.trim();

      if (!apiKey || !script) {
        alert("Please enter your API key and generate a script first.");
        return;
      }

      output.textContent = "Running legal review...";

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
              content: `Please review the following script for any copyright or legal issues. Respond with a clear, brief note if there are any problems:\n\n${script}`
            }],
            max_tokens: 150,
            temperature: 0.5
          })
        });

        const data = await response.json();
        const review = data.choices?.[0]?.message?.content;
        output.textContent = review || "No issues detected.";
      } catch (err) {
        output.textContent = "❌ Error during legal review.";
        console.error(err);
      }
    });
  }

  // History Logging
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
    historyData.unshift(entry); // newest on top
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

  const legalBtnHook = document.getElementById("run-legal-review-btn");
  if (legalBtnHook) {
    legalBtnHook.addEventListener("click", () => {
      setTimeout(trySaveHistory, 4000);
    });
  }

  // Set initial view
  showPanel("home");
});
