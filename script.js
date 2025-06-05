// Sidebar toggle
const toggleBtn = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

// Dark mode toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', modeToggle.checked);
});

// Save API Key to localStorage
const apiKeyInput = document.getElementById('api-key');
apiKeyInput.value = localStorage.getItem('openai-api-key') || '';
apiKeyInput.addEventListener('input', () => {
  localStorage.setItem('openai-api-key', apiKeyInput.value);
});

// Module switching
const buttons = document.querySelectorAll('#sidebar button');
const contentPanel = document.getElementById('content-panel');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    const module = button.dataset.module;
    contentPanel.innerHTML = generateContentForModule(module);
  });
});

function generateContentForModule(module) {
  switch (module) {
    case 'manager':
      return `
        <h1>👑 Boss AI Manager</h1>
        <p class="subtext">Oversee your entire AI system here. Select a task to run or view analytics.</p>
        <button id="sample-script" class="primary">🎬 Try Sample Script</button>
      `;
    case 'script':
      return `
        <h1>✍️ Script Writer</h1>
        <textarea rows="6" placeholder="Enter your video topic or idea..."></textarea>
        <button class="primary">Generate Script</button>
      `;
    case 'voiceover':
      return `
        <h1>🎤 Voiceover Generator</h1>
        <textarea rows="4" placeholder="Paste your script here..."></textarea>
        <button class="primary">Generate Voiceover</button>
      `;
    case 'legal':
      return `
        <h1>🛡️ Legal Review</h1>
        <p class="subtext">This tool checks your content for copyright, fairness, and compliance issues.</p>
        <button class="primary">Run Legal Review</button>
      `;
    case 'upload':
      return `
        <h1>🚀 Upload Strategy AI</h1>
        <p class="subtext">Generate the best upload plan across platforms. Pick platform and time:</p>
        <button class="primary">Generate Strategy</button>
      `;
    case 'history':
      return `
        <h1>📂 Video History</h1>
        <p class="subtext">Review your previously generated scripts and outputs here.</p>
        <div class="history-entry">🔹 <strong>Finance Hook Script</strong><br>“This one investment trick…”</div>
        <div class="history-entry">🔹 <strong>Voiceover AI Output</strong><br>“Welcome to Boss AI…”</div>
      `;
    case 'dashboard':
      return `
        <h1>📊 Performance Dashboard</h1>
        <p class="subtext">Monitor engagement, AI usage, and key performance stats here.</p>
        <div><strong>Scripts Generated:</strong> 38</div>
        <div><strong>Videos Uploaded:</strong> 12</div>
        <div><strong>Engagement Rate:</strong> 82%</div>
      `;
    default:
      return `<p>Select a module to begin.</p>`;
  }
}

// Onboarding popup
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('onboarding-popup');
  const closeBtn = document.getElementById('close-popup');

  if (!sessionStorage.getItem('onboardingSeen')) {
    popup.classList.remove('hidden');
  }

  closeBtn?.addEventListener('click', () => {
    popup.classList.add('hidden');
    sessionStorage.setItem('onboardingSeen', 'true');
  });
});
