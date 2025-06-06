document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".sidebar button");
  const main = document.getElementById("main");

  let elevenLabsKey = "";

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const module = button.getAttribute("data-module");
      loadModule(module);
    });
  });

  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  });

  function loadModule(module) {
    const content = {
      manager: `<h2 style="color:#00bfff;">🤖 General Manager AI</h2><p>This AI coordinates the sub-AIs and manages workflows.</p>`,
      legal: `<h2 style="color:#00bfff;">📜 Legal Review</h2><p>Reviewing content for compliance...</p>`,
      script: `
        <h2 style="color:#00bfff;">✍️ Script Writer</h2>
        <input type="text" id="script-input" placeholder="Enter video topic..." />
        <button id="generate-script">Generate Script</button>
        <pre id="script-output">Awaiting script...</pre>
      `,
      voiceover: `
        <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
        <input type="password" id="voice-api-key" placeholder="🔑 Enter ElevenLabs API Key" />
        <button id="simulate-voice">Generate Voiceover</button>
        <pre id="voiceover-output" style="margin-top: 10px;">Awaiting voiceover input...</pre>
      `,
      upload: `<h2 style="color:#00bfff;">📤 Upload Strategy</h2><p>Optimize upload timing and strategy.</p>`,
      output: `<h2 style="color:#00bfff;">📺 Final Output</h2><p>Your rendered video or content will appear here.</p>`,
      history: `<h2 style="color:#00bfff;">🗂️ History</h2><p>Review past scripts and outputs.</p>`,
      settings: `<h2 style="color:#00bfff;">⚙️ Settings</h2><p>Configure preferences and integrations.</p>`
    };

    main.innerHTML = `<div style="max-width: 800px; margin-top: 40px; text-align: left;">${content[module] || ""}</div>`;

    if (module === "script") activateScriptWriter();
    if (module === "voiceover") activateVoiceover();
  }

  function activateScriptWriter() {
    const input = document.getElementById("script-input");
    const output = document.getElementById("script-output");
    const button = document.getElementById("generate-script");

    button.addEventListener("click", async () => {
      output.textContent = "⏳ Generating script...";
      const topic = input.value.trim();

      if (!topic) {
        output.textContent = "❗ Please enter a topic.";
        return;
      }

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + document.getElementById("api-key").value
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Write a short YouTube video script about: ${topic}` }],
            temperature: 0.7
          })
        });

        const data = await response.json();
        const script = data.choices?.[0]?.message?.content;
        output.textContent = script || "No output.";
      } catch (err) {
        output.textContent = "⚠️ Error: " + err.message;
      }
    });
  }

  function activateVoiceover() {
    const button = document.getElementById("simulate-voice");
    const output = document.getElementById("voiceover-output");
    const keyInput = document.getElementById("voice-api-key");

    button.addEventListener("click", async () => {
      const apiKey = keyInput.value.trim();
      if (!apiKey) {
        output.textContent = "❗ Missing ElevenLabs API key.";
        return;
      }

      elevenLabsKey = apiKey;
      output.textContent = "🎙️ Generating voiceover...";

      try {
        const sampleText = "This is Boss AI. Voiceover generation successful.";
        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/default/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsKey
          },
          body: JSON.stringify({
            text: sampleText,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();

        output.textContent = "✅ Voiceover played successfully.";
      } catch (err) {
        output.textContent = "⚠️ Error: " + err.message;
      }
    });
  }
});
