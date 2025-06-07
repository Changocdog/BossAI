<script>
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  let apiKey = "";

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  });

  document.getElementById("api-key").addEventListener("input", (e) => {
    apiKey = e.target.value.trim();
  });

  const content = {
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
      <textarea id="script-input" placeholder="Write your topic here..."></textarea><br>
      <button class="generate-btn" onclick="generateScript()">Generate Script</button>
      <div id="script-result" style="margin-top:20px;"></div>
    `,
    voiceover: `
      <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
      <textarea placeholder='Paste your script here...'></textarea><br>
      <button class="generate-btn">Generate Voiceover</button>
    `,
    upload: `
      <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
      <textarea placeholder='Describe your video goals...'></textarea><br>
      <button class="generate-btn">Optimize Upload Plan</button>
    `,
    output: `
      <h2 style="color:#00bfff;">📺 Final Output</h2>
      <p>This is where your final video or result will appear.</p>
      <br><button class="generate-btn">Render Final Video</button>
    `,
    history: `
      <h2 style="color:#00bfff;">🗂️ History</h2>
      <p>Review your past content outputs.</p>
      <ul><li>Script 1</li><li>Voiceover 2</li><li>Upload Strategy 3</li></ul>
    `,
    settings: `
      <h2 style="color:#00bfff;">⚙️ Settings</h2>
      <textarea placeholder="Set custom preferences here..."></textarea><br>
      <button class="generate-btn">Save Settings</button>
    `
  };

  document.querySelectorAll(".sidebar button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const module = button.getAttribute("data-module");
      main.innerHTML = `
        <div style="max-width: 800px; text-align: center;">
          ${content[module] || ''}
        </div>
      `;
    });
  });

  async function generateScript() {
    const input = document.getElementById("script-input").value;
    const resultDiv = document.getElementById("script-result");

    if (!apiKey || !input) {
      resultDiv.innerHTML = "<p style='color: orange;'>Please enter your API key and a script topic.</p>";
      return;
    }

    resultDiv.innerHTML = "<p style='color: #00bfff;'>Generating script...</p>";

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta3/models/gemini-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      resultDiv.innerHTML = "<pre style='text-align:left; white-space:pre-wrap;'>" + data.candidates[0].content.parts[0].text + "</pre>";
    } else {
      resultDiv.innerHTML = "<p style='color: red;'>Failed to generate script. Please try again.</p>";
    }
  }
</script>
