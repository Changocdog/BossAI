const modules = {
  manager: `<h2>Manager AI</h2><p>This module will oversee all others and ensure your content workflow is optimized.</p>`,
  legal: `<h2>Legal Review</h2><p>This module checks scripts and outputs for copyright, privacy, and platform compliance.</p>`,
  script: `<h2>Script Writer</h2>
           <textarea id="scriptInput" placeholder="Enter your video idea..."></textarea>
           <button class="generate-btn" onclick="generateScript()">Generate Script</button>
           <div id="scriptResult"></div>`,
  voiceover: `<h2>Voiceover AI</h2>
              <textarea id="voiceInput" placeholder="Enter script text..."></textarea>
              <button class="generate-btn" onclick="generateVoice()">Generate Voiceover</button>
              <div id="voiceResult"></div>`,
  upload: `<h2>Upload Strategy AI</h2>
           <textarea id="uploadInput" placeholder="Describe your video topic or script..."></textarea>
           <button class="generate-btn" onclick="generateUploadStrategy()">Suggest Upload Strategy</button>
           <div id="uploadResult" style="margin-top:15px;"></div>`,
  output: `<h2>Final Output</h2><p>This will display the final video preview or download link.</p>`,
  history: `<h2>Video History</h2><p>Logs and displays past video outputs and analytics.</p>`,
  trends: `<h2>Trend AI</h2><p>Shows current top trends for new video content ideas.</p>`,
  sheets: `<h2>Sheets Log</h2><p>Google Sheets logging will be activated in a later phase.</p>`,
  settings: `<h2>Settings</h2><p>Manage your API keys and integrations here.</p>`
};

document.querySelectorAll(".sidebar button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const module = btn.getAttribute("data-module");
    document.getElementById("main").innerHTML = modules[module] || "<p>Module not found.</p>";
  });
});

document.getElementById("toggle-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
  document.getElementById("main").classList.toggle("full");
});

// Simulated generation functions
function generateScript() {
  const input = document.getElementById('scriptInput').value.trim();
  const resultBox = document.getElementById('scriptResult');
  if (!input) {
    resultBox.innerHTML = "<p>Please enter a topic first.</p>";
    return;
  }
  resultBox.innerHTML = `<p><strong>Sample Script:</strong> Here's a viral short-form video script about "${input}" that grabs attention and ends with a strong call to action.</p>`;
}

function generateVoice() {
  const input = document.getElementById('voiceInput').value.trim();
  const resultBox = document.getElementById('voiceResult');
  if (!input) {
    resultBox.innerHTML = "<p>Please enter script text.</p>";
    return;
  }
  resultBox.innerHTML = `<p><strong>Voiceover URL:</strong> [Simulated] Voiceover audio link for "${input}" generated.</p>`;
}

function generateUploadStrategy() {
  const input = document.getElementById('uploadInput').value.trim();
  const resultBox = document.getElementById('uploadResult');
  if (!input) {
    resultBox.innerHTML = "<p>Please enter a topic first.</p>";
    return;
  }

  resultBox.innerHTML = `<p><strong>Recommended Strategy:</strong></p>
    <ul>
      <li>Platform: YouTube Shorts & TikTok</li>
      <li>Hashtags: #shorts #viral #${input.split(" ")[0]}</li>
      <li>Post Time: 6PM (based on viewer engagement)</li>
      <li>Call-to-Action: “Follow for more!”</li>
    </ul>`;
}
