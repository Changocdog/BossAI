const adminKey = "changosecretkey"; // ✅ ONLY YOU KNOW THIS KEY

const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("full");
});

document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const module = button.getAttribute("data-module");
    loadModule(module);
  });
});

function loadModule(module) {
  if (module === "legal" && !localStorage.getItem("hasLegalAccess")) {
    const attempt = prompt("🔐 Enter admin key to access Legal AI:");
    if (attempt !== adminKey) {
      alert("❌ Access denied.");
      return;
    } else {
      localStorage.setItem("hasLegalAccess", "true");
    }
  }

  const contentMap = {
    manager: `<h2 style="color:#00bfff;">🤖 General Manager AI</h2><p>This AI coordinates the sub-AIs and manages workflows.</p>`,
    legal: `
      <h2 style="color:#00bfff;">📜 Legal Review</h2>
      <p>Enter content below to simulate a compliance review:</p>
      <textarea id="legal-input" placeholder="Paste your script or content here..."></textarea>
      <button onclick="runLegalCheck()">Run Legal Check</button>
      <pre id="legal-result">🧠 Waiting for input...</pre>
    `,
    script: `
      <h2 style="color:#00bfff;">✍️ Script Writer</h2>
      <textarea id="script-input" placeholder="Enter video topic..."></textarea>
      <button onclick="generateScript()">Generate Script</button>
      <pre id="script-output">🧠 Awaiting input...</pre>
    `,
    voiceover: `<h2 style="color:#00bfff;">🎤 Voiceover AI</h2><p>This module will convert text to voice. (Coming soon!)</p>`,
    upload: `<h2 style="color:#00bfff;">📤 Upload Strategy</h2><p>Plan optimal times and platforms for uploads.</p>`,
    output: `<h2 style="color:#00bfff;">📺 Final Output</h2><p>Review and export completed content.</p>`,
    history: `<h2 style="color:#00bfff;">🗂️ History</h2><p>Review past scripts and outputs.</p>`,
    settings: `<h2 style="color:#00bfff;">⚙️ Settings</h2><p>Configure preferences and integrations.</p>`
  };

  document.getElementById("main").innerHTML = `
    <div style="max-width: 800px; margin: auto; text-align: left;">
      ${contentMap[module] || ""}
    </div>
  `;
}

async function generateScript() {
  const input = document.getElementById("script-input").value.trim();
  const apiKey = document.getElementById("api-key").value.trim();
  const output = document.getElementById("script-output");

  if (!input || !apiKey) {
    output.textContent = "⚠️ Please provide a topic and OpenAI API key.";
    return;
  }

  output.textContent = "🌀 Generating script...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Write a short script on: ${input}` }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    output.textContent = data.choices[0].message.content;
  } catch (error) {
    output.textContent = "❌ Error generating script.";
  }
}

function runLegalCheck() {
  const content = document.getElementById("legal-input").value.trim();
  const result = document.getElementById("legal-result");

  if (!content) {
    result.textContent = "⚠️ Please paste content to review.";
    return;
  }

  let warning = "";
  if (/copyright/i.test(content)) warning += "⚠️ Possible copyright issue.\n";
  if (/violence|hate/i.test(content)) warning += "⚠️ Inappropriate language detected.\n";

  result.textContent = warning || "✅ No issues detected. Content is likely compliant.";
}
