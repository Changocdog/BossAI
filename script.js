document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  const toggleBtn = document.getElementById('toggle-btn');
  const moduleButtons = document.querySelectorAll('.sidebar button');

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    main.classList.toggle('full');
  });

  moduleButtons.forEach(button => {
    button.addEventListener('click', () => {
      moduleButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadModule(button.dataset.module);
    });
  });

  function loadModule(module) {
    if (module === 'manager') {
      main.innerHTML = `
        <h2>🤖 Manager AI</h2>
        <div id="chat-box" style="max-width:600px;text-align:left;background:#111;padding:10px;border-radius:8px;height:300px;overflow:auto;"></div>
        <textarea id="manager-input" placeholder="Ask Manager AI..."></textarea>
        <button onclick="handleManagerCommand()">Send</button>
      `;
    } else if (module === 'script') {
      const savedKey = localStorage.getItem('openai_key') || '';
      main.innerHTML = `
        <h2>✍️ Script Writer AI</h2>
        <input id="script-api-key" placeholder="OpenAI API Key" value="${savedKey}">
        <textarea id="script-prompt" placeholder="Enter script topic..."></textarea>
        <button class="generate-btn" onclick="generateScript()">Generate Script</button>
        <pre id="script-output"></pre>
      `;
    } else if (module === 'voiceover') {
      const savedKey = localStorage.getItem('voiceover_key') || '';
      main.innerHTML = `
        <h2>🎤 Voiceover AI</h2>
        <input id="voice-api-key" placeholder="ElevenLabs API Key" value="${savedKey}">
        <textarea id="voice-text" placeholder="Enter text to convert to speech..."></textarea>
        <button class="generate-btn" onclick="generateVoiceover()">Generate Voice</button>
        <audio id="voice-player" controls style="margin-top:10px;"></audio>
      `;
    } else {
      main.innerHTML = `<h2>${module.replace(/^\w/, c => c.toUpperCase())} Module</h2><p>Functionality coming soon!</p>`;
    }
  }

  window.handleManagerCommand = function () {
    const chatBox = document.getElementById('chat-box');
    const input = document.getElementById('manager-input').value;
    const response = interpretManagerCommand(input);
    chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p><p><strong>Boss AI:</strong> ${response}</p>`;
    document.getElementById('manager-input').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  function interpretManagerCommand(text) {
    const command = text.toLowerCase();
    if (command.includes('dark') && command.includes('background')) {
      document.body.style.backgroundColor = '#000';
      return 'Background set to dark mode.';
    } else if (command.includes('script')) {
      document.querySelector('button[data-module="script"]').click();
      return 'Opening Script Writer module...';
    } else if (command.includes('voice')) {
      document.querySelector('button[data-module="voiceover"]').click();
      return 'Opening Voiceover module...';
    }
    return 'Sorry, I didn’t understand that command yet.';
  }

  window.generateScript = async function () {
    const key = document.getElementById('script-api-key').value;
    const prompt = document.getElementById('script-prompt').value;
    localStorage.setItem('openai_key', key);

    const output = document.getElementById('script-output');
    output.textContent = 'Generating...';

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Create a short-form video script on: ${prompt}` }],
          max_tokens: 300
        })
      });
      const data = await res.json();
      output.textContent = data.choices[0].message.content;
    } catch (err) {
      output.textContent = 'Error generating script.';
    }
  };

  window.generateVoiceover = async function () {
    const key = document.getElementById('voice-api-key').value;
    const text = document.getElementById('voice-text').value;
    const player = document.getElementById('voice-player');
    localStorage.setItem('voiceover_key', key);

    try {
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': key
        },
        body: JSON.stringify({ text, voice_settings: { stability: 0.5, similarity_boost: 0.5 } })
      });

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      player.src = audioUrl;
    } catch (err) {
      alert('Error generating voiceover.');
    }
  };

  // Load default module
  loadModule('manager');
});
