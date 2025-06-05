document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  });

  const moduleContent = {
    manager: `<h2 style="color:#00bfff;">🤖 General Manager AI</h2><p>This AI coordinates the sub-AIs and manages workflows.</p>`,
    legal: `<h2 style="color:#00bfff;">📜 Legal Review</h2><p>Reviewing content for compliance...</p>`,
    script: `
      <h2 style="color:#00bfff;">✍️ Script Writer</h2>
      <p>Enter a topic and generate a short script:</p>
      <textarea id="script-input" placeholder="Enter video topic..."></textarea>
      <button onclick="generateScript()">Generate Script</button>
      <pre id="script-output"></pre>
    `,
    voiceover: `
      <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
      <p>Convert script text into voiceover audio (simulated):</p>
      <textarea id="voiceover-text" placeholder="Paste script here..."></textarea>
      <button onclick="generateVoiceover()">Generate Voiceover</button>
      <pre id="voiceover-output"></pre>
    `,
    upload: `
      <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
      <p>Get platform-specific upload recommendations:</p>
      <select id="platform-select">
        <option value="">Select a platform</option>
        <option value="YouTube">YouTube</option>
        <option value="TikTok">TikTok</option>
        <option value="Instagram">Instagram</option>
      </select>
      <button onclick="generateUploadStrategy()">Generate Strategy</button>
      <pre id="upload-output"></pre>
    `,
    output: `<h2 style="color:#00bfff;">📺 Final Output</h2><p>See the complete video or content result.</p>`,
    history: `<h2 style="color:#00bfff;">🗂️ History</h2><p>Review past scripts and outputs.</p>`,
    settings: `<h2 style="color:#00bfff;">⚙️ Settings</h2><p>Configure preferences and integrations.</p>`
  };

  document.querySelectorAll(".sidebar button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const module = button.getAttribute("data-module");
      main.innerHTML = `<div style="max-width: 800px; text-align: left;">${moduleContent[module] || ''}</div>`;
    });
  });
});

function generateScript() {
  const topic = document.getElementById("script-input").value;
  const output = document.getElementById("script-output");
  if (topic.trim() === "") {
    output.textContent = "❗ Please enter a topic to generate a script.";
    return;
  }

  output.textContent = `📝 Script on "${topic}":
Welcome to Boss AI! In today’s short, we’re diving into "${topic}" — let’s break it down in 60 seconds... [sample content here]`;
}

function generateVoiceover() {
  const script = document.getElementById("voiceover-text").value;
  const output = document.getElementById("voiceover-output");
  if (script.trim() === "") {
    output.textContent = "❗ Please paste a script first.";
    return;
  }

  output.textContent = `🔊 Simulated voiceover:
"${script}" [This is a placeholder. Real audio coming in future version.]`;
}

function generateUploadStrategy() {
  const platform = document.getElementById("platform-select").value;
  const output = document.getElementById("upload-output");

  const strategies = {
    YouTube: `📅 Best time: Weekdays at 2–4 PM\n📈 Tags: #shorts, #trending\n📝 Tips: Use strong thumbnails, short titles, and post consistently.`,
    TikTok: `📅 Best time: Evenings & weekends\n📈 Tags: #fyp, #viral\n📝 Tips: Hook viewers in first 2s, use trending audio, and post 1–2x daily.`,
    Instagram: `📅 Best time: Mornings (Tue–Thu)\n📈 Tags: #reels, #explore\n📝 Tips: Use hashtags, cross-promote stories, and reply to comments fast.`
  };

  if (!platform) {
    output.textContent = "❗ Please select a platform.";
    return;
  }

  output.textContent = strategies[platform] || "No strategy available for selected platform.";
}
