const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const apiKeyInput = document.getElementById("api-key");

// Protected admin key
const adminKey = "my-secret-key"; // ← replace with your own

// If access previously granted, hide the key box
if (localStorage.getItem("access_granted") === "true") {
  apiKeyInput.style.display = "none";
}

// Sidebar toggle
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("full");
});

// Handle sidebar clicks
document.querySelectorAll(".sidebar button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const module = button.getAttribute("data-module");

    if (module === "legal" && localStorage.getItem("access_granted") !== "true") {
      const userKey = prompt("Enter access key:");
      if (userKey === adminKey) {
        localStorage.setItem("access_granted", "true");
        apiKeyInput.style.display = "none";
        updateContent(module);
      } else {
        alert("Incorrect key.");
        return;
      }
    } else {
      updateContent(module);
    }
  });
});

// Core logic for loading module-specific content
function updateContent(module) {
  const base = document.getElementById("module-content");
  if (!base) return;

  const style = "font-size: 18px; color: #ccc; line-height: 1.6;";
  const modules = {
    manager: `<h2 style="color:#00bfff;">🤖 General Manager AI</h2><p style="${style}">This AI coordinates the sub-AIs and manages workflows.</p>`,
    legal: `<h2 style="color:#00bfff;">📜 Legal Review</h2><p style="${style}">Running compliance and copyright safety checks...</p>`,
    script: `
      <h2 style="color:#00bfff;">✍️ Script Writer AI</h2>
      <textarea placeholder="Enter your script here..." style="width:100%; height:200px; background:#111; color:#fff; font-size:16px; border:1px solid #00bfff; border-radius:8px;"></textarea>
    `,
    voiceover: `
      <h2 style="color:#00bfff;">🎤 Voiceover Generator</h2>
      <p style="${style}">Convert your script to audio. (Coming soon!)</p>
      <textarea placeholder="Paste script..." style="width:100%; height:160px; background:#111; color:#fff; font-size:16px; border:1px solid #00bfff; border-radius:8px;"></textarea>
    `,
    upload: `<h2 style="color:#00bfff;">📤 Upload Strategy</h2><p style="${style}">We’ll analyze your video and suggest posting times and hashtags. (Coming soon!)</p>`,
    output: `<h2 style="color:#00bfff;">📺 Final Output</h2><p style="${style}">Your rendered video or image summary will appear here. (Coming soon!)</p>`,
    history: `
      <h2 style="color:#00bfff;">🗂️ History</h2>
      <ul style="padding-left: 1.2em; ${style}">
        <li><strong>6/01:</strong> "Top AI Tools for Content Creators"</li>
        <li><strong>6/02:</strong> "Boss AI Explained in 60 Seconds"</li>
        <li><strong>6/03:</strong> "Why Automation Matters Now"</li>
      </ul>
    `,
    settings: `<h2 style="color:#00bfff;">⚙️ Settings</h2><p style="${style}">Change preferences, voice style, and integrations. (Coming soon!)</p>`
  };

  base.innerHTML = modules[module] || "<p>Unknown module.</p>";
}

// Show Script Writer module by default
updateContent("script");
