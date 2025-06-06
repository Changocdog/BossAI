const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main");
const apiKeyInput = document.getElementById("api-key");

const adminKey = "my-secret-key"; // Replace with your own

// Restore access if already granted
if (localStorage.getItem("access_granted") === "true") {
  apiKeyInput.style.display = "none";
}

// Toggle sidebar
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
  main.classList.toggle("full");
});

// Handle sidebar button clicks
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
        showContent(module);
      } else {
        alert("Incorrect key. Access denied.");
        return;
      }
    } else {
      showContent(module);
    }
  });
});

// Main content function
function showContent(module) {
  const baseStyle = "font-size:18px; line-height:1.6;";
  const contentMap = {
    manager: `<h2 style="font-size: 24px; color:#00bfff;">🤖 General Manager AI</h2><p style="${baseStyle}">This AI coordinates the sub-AIs and manages workflows.</p>`,
    legal: `<h2 style="font-size: 24px; color:#00bfff;">📜 Legal Review</h2><p style="${baseStyle}">Running legal compliance checks...</p>`,
    script: `
      <h2 style="font-size: 24px; color:#00bfff;">✍️ Script Writer</h2>
      <textarea style="width:100%; height:200px; font-size:16px; background:#111; color:#fff; border:1px solid #00bfff; border-radius:8px;" placeholder="Write your script here..."></textarea>
    `,
    voiceover: `<h2 style="font-size: 24px; color:#00bfff;">🎤 Voiceover AI</h2><p style="${baseStyle}">Upload your script or type below:</p>
      <textarea style="width:100%; height:150px; font-size:16px; background:#111; color:#fff; border:1px solid #00bfff; border-radius:8px;"></textarea>`,
    upload: `<h2 style="font-size: 24px; color:#00bfff;">📤 Upload Strategy</h2><p style="${baseStyle}">We'll suggest platforms, titles, and times based on your audience.</p>`,
    output: `<h2 style="font-size: 24px; color:#00bfff;">📺 Final Output</h2><p style="${baseStyle}">Your rendered video or content will appear here.</p>`,
    history: `
      <h2 style="font-size: 24px; color:#00bfff;">🗂️ History</h2>
      <ul style="${baseStyle} list-style-type:none; padding-left:0;">
        <li><strong>5/25:</strong> "How to Start Investing at 18"</li>
        <li><strong>5/26:</strong> "Top 3 Passive Income Myths"</li>
        <li><strong>5/27:</strong> "Is Crypto Dead? Here's What You Need to Know"</li>
      </ul>
    `,
    settings: `<h2 style="font-size: 24px; color:#00bfff;">⚙️ Settings</h2><p style="${baseStyle}">Coming soon: voice options, platform integrations, and app preferences.</p>`
  };

  main.innerHTML = `
    <div style="max-width: 800px; text-align: left; margin-top: 40px;">
      ${contentMap[module] || "<p>Module not found.</p>"}
    </div>
  `;
}
