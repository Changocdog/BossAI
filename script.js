document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const module = button.getAttribute("data-module");
    const contentArea = document.getElementById("main-content");

    const views = {
      manager: `
        <h2 style="color:#00bfff;">🤖 General Manager AI</h2>
        <p>This AI coordinates the sub-AIs and manages workflows.</p>
      `,
      legal: `
        <h2 style="color:#00bfff;">📜 Legal Review</h2>
        <p>Checking content for legal compliance...</p>
        <textarea placeholder="Paste script here..." style="width:100%; height:120px; margin-top:10px;"></textarea>
        <button style="margin-top:10px;">Run Legal Check</button>
      `,
      script: `
        <h2 style="color:#00bfff;">✍️ Script Writer</h2>
        <input id="script-input" type="text" placeholder="Enter video topic..." style="width:100%; margin-bottom:10px;">
        <button id="generate-script-btn">Generate Script</button>
        <pre id="script-output" style="margin-top:15px;"></pre>
      `,
      voiceover: `
        <h2 style="color:#00bfff;">🎤 Voiceover</h2>
        <textarea placeholder="Paste script to convert to voice..." style="width:100%; height:100px;"></textarea>
        <button style="margin-top:10px;">Simulate Voiceover</button>
      `,
      upload: `
        <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
        <p>Suggesting best time to post based on engagement data... (coming soon)</p>
      `,
      output: `
        <h2 style="color:#00bfff;">📺 Final Output</h2>
        <p>Generated video and summary will appear here.</p>
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

    contentArea.innerHTML = views[module] || '';
    
    if (module === "script") {
      document.getElementById("generate-script-btn").addEventListener("click", async () => {
        const prompt = document.getElementById("script-input").value;
        const key = document.getElementById("api-key").value;
        const output = document.getElementById("script-output");

        if (!prompt || !key) {
          output.textContent = "⚠️ Please enter a topic and your OpenAI API key.";
          return;
        }

        output.textContent = "🧠 Generating script...";
        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: `Write a YouTube Shorts script on: ${prompt}` }],
              temperature: 0.7
            })
          });

          const data = await response.json();
          const result = data.choices?.[0]?.message?.content;
          output.textContent = result || "No output from OpenAI.";
        } catch (err) {
          output.textContent = "❌ Error fetching from OpenAI API.";
        }
      });
    }
  });
});
