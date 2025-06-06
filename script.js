const moduleContent = {
  manager: `
    <h2 style="color:#00bfff;">🤖 General Manager AI</h2>
    <p>This AI coordinates the sub-AIs and manages workflows.</p>
  `,
  legal: `
    <h2 style="color:#00bfff;">📜 Legal Review</h2>
    <p>Reviewing content for compliance...</p>
  `,
  script: `
    <h2 style="color:#00bfff;">✍️ Script Writer</h2>
    <p>Generate and edit video scripts here.</p>
    <input id="script-input" type="text" placeholder="Enter a video topic..." style="margin-top:10px; padding:10px; width:100%; max-width:400px;" />
    <button id="generate-script-btn" style="margin-top:10px;">Generate Script</button>
    <pre id="script-output" style="margin-top:20px;"></pre>
  `,
  voiceover: `
    <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
    <p>Convert scripts into audio narration.</p>
  `,
  upload: `
    <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
    <p>Optimize upload timing and strategy.</p>
  `,
  output: `
    <h2 style="color:#00bfff;">📺 Final Output</h2>
    <p>See the complete video or content result here.</p>
  `,
  history: `
    <h2 style="color:#00bfff;">🗂️ History</h2>
    <p>Review past scripts and outputs.</p>
  `,
  settings: `
    <h2 style="color:#00bfff;">⚙️ Settings</h2>
    <p>Configure preferences and integrations.</p>
  `
};

// Sidebar button click behavior
document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const module = button.getAttribute("data-module");
    const content = moduleContent[module] || "";
    const container = document.getElementById("main-content");

    if (container) {
      container.innerHTML = content;
    }

    // Activate Script Writer AI logic
    if (module === "script") {
      document.getElementById("generate-script-btn")?.addEventListener("click", async () => {
        const input = document.getElementById("script-input").value;
        const apiKey = document.getElementById("api-key").value;
        const output = document.getElementById("script-output");

        if (!input || !apiKey) {
          output.textContent = "⚠️ Please enter a topic and your OpenAI API key.";
          return;
        }

        output.textContent = "Generating...";
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: `Write a short video script about: ${input}` }],
              max_tokens: 300
            })
          });

          const data = await response.json();
          output.textContent = data.choices?.[0]?.message?.content?.trim() || "No output.";
        } catch (err) {
          output.textContent = "❌ Error generating script.";
        }
      });
    }
  });
});
