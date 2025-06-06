document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.sidebar button');
  const main = document.getElementById('main');

  const modules = {
    manager: `
      <h2 style="color:#00bfff;">🤖 Manager AI</h2>
      <p>This AI coordinates the sub-AIs and manages workflows.</p>
    `,
    legal: `
      <h2 style="color:#00bfff;">📜 Legal Review</h2>
      <p>Checking content for policy compliance...</p>
    `,
    script: `
      <h2 style="color:#00bfff;">✍️ Script Writer AI</h2>
      <textarea id="script-input" placeholder="Enter video topic..." style="width:100%;height:100px;"></textarea>
      <br><button onclick="generateScript()">Generate Script</button>
      <pre id="script-output"></pre>
    `,
    voiceover: `
      <h2 style="color:#00bfff;">🎤 Voiceover AI</h2>
      <input id="voice-key" type="password" placeholder="🔑 Enter ElevenLabs API Key" />
      <br><button onclick="generateVoiceover()">Generate Voiceover</button>
      <pre id="voice-output"></pre>
    `,
    upload: `
      <h2 style="color:#00bfff;">📤 Upload Strategy</h2>
      <p>Auto-scheduling and platform optimization tools coming soon.</p>
    `,
    output: `
      <h2 style="color:#00bfff;">📺 Final Output</h2>
      <p>Your rendered content will appear here.</p>
    `,
    history: `
      <h2 style="color:#00bfff;">🗂️ History</h2>
      <p>Logs of all scripts, voiceovers, and uploads.</p>
    `,
    settings: `
      <h2 style="color:#00bfff;">⚙️ Settings</h2>
      <p>Configure API keys, preferences, and custom tools.</p>
    `
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const module = button.dataset.module;
      main.innerHTML = modules[module] || '';
    });
  });
});

async function generateScript() {
  const input = document.getElementById('script-input').value;
  const output = document.getElementById('script-output');
  output.textContent = 'Generating script...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_KEY`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Write a short video script about: ${input}` }]
      })
    });
    const data = await response.json();
    output.textContent = data.choices?.[0]?.message?.content || 'No script returned.';
  } catch (err) {
    output.textContent = 'Error generating script.';
  }
}

async function generateVoiceover() {
  const key = document.getElementById('voice-key').value;
  const output = document.getElementById('voice-output');
  const sample = 'This is your Boss AI voiceover preview.';
  output.textContent = 'Generating voiceover...';

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/audio', {
      method: 'POST',
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: sample,
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
    output.textContent = '✅ Voiceover played successfully.';
  } catch (err) {
    output.textContent = '❌ Error with ElevenLabs API or key.';
  }
}
